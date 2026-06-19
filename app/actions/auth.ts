"use server"

import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { hashPassword, verifyPassword, generateToken, hashToken } from "@/lib/crypto"
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/tokens"
import {
  usersCollection,
  findUserByEmail,
  normalizeEmail,
  removeRefreshToken,
} from "@/lib/users"
import { establishSession } from "@/lib/auth-session"
import { getCurrentUser } from "@/lib/session"
import type { UserDoc, Role } from "@/lib/types"
import { registerSchema, loginSchema, forgotSchema, resetSchema } from "@/lib/validation"
import { sendAuthEmail, emailConfigured } from "@/lib/email"

export interface AuthState {
  ok?: boolean
  error?: string
  fieldErrors?: Record<string, string>
  message?: string
  // Surfaced only in development so flows can be tested without an email provider.
  devLink?: string
}

function siteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"
  return `${base}${path}`
}

function zodFieldErrors(error: { issues: { path: (string | number)[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return fieldErrors
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) }
  }

  const { name, email, password } = parsed.data
  const existing = await findUserByEmail(email)
  if (existing) {
    // A Google-only account (no password) can't log in with email yet. Point
    // them at the right path instead of a generic "already exists".
    const message = existing.passwordHash
      ? "An account with this email already exists"
      : "This email is registered with Google. Sign in with Google, or use “Forgot password” to set a password."
    return { ok: false, fieldErrors: { email: message } }
  }

  const { raw, hashed } = generateToken()
  const now = new Date()
  const doc: UserDoc = {
    name,
    email: normalizeEmail(email),
    passwordHash: await hashPassword(password),
    authProvider: "password",
    role: "customer",
    emailVerified: false,
    verificationToken: hashed,
    verificationExpires: new Date(now.getTime() + 1000 * 60 * 60 * 24), // 24h
    refreshTokens: [],
    createdAt: now,
    updatedAt: now,
  }

  const col = await usersCollection()
  const result = await col.insertOne(doc)
  const created = { ...doc, _id: result.insertedId }

  const link = siteUrl(`/verify-email?token=${raw}`)
  await sendAuthEmail({ kind: "verify", to: email, link })

  // Log the user in immediately; they can verify via the emailed link.
  await establishSession(created)

  return {
    ok: true,
    message: "Account created. Check your email to verify your address.",
    devLink:
      process.env.NODE_ENV === "development" && !emailConfigured() ? link : undefined,
  }
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) }
  }

  const { email, password } = parsed.data
  const user = await findUserByEmail(email)
  if (!user) {
    return { ok: false, error: "Incorrect email or password" }
  }
  // Accounts created via Google have no password set.
  if (!user.passwordHash) {
    return {
      ok: false,
      error: "This account uses Google sign-in. Use “Continue with Google” above.",
    }
  }
  if (!(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, error: "Incorrect email or password" }
  }

  await establishSession(user)
  return { ok: true }
}

export async function logoutAction(): Promise<void> {
  const store = await cookies()
  const refresh = store.get(REFRESH_COOKIE)?.value
  if (refresh) {
    const { verifyRefreshToken } = await import("@/lib/tokens")
    const payload = await verifyRefreshToken(refresh)
    if (payload) {
      await removeRefreshToken(payload.sub, hashToken(refresh))
    }
  }
  store.delete(ACCESS_COOKIE)
  store.delete(REFRESH_COOKIE)
}

export async function forgotPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") })
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) }
  }

  const user = await findUserByEmail(parsed.data.email)
  // Always respond success to avoid leaking which emails are registered.
  if (user) {
    const { raw, hashed } = generateToken()
    const col = await usersCollection()
    await col.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken: hashed,
          resetExpires: new Date(Date.now() + 1000 * 60 * 60), // 1h
          updatedAt: new Date(),
        },
      },
    )
    const link = siteUrl(`/reset-password?token=${raw}`)
    await sendAuthEmail({ kind: "reset", to: user.email, link })
    return {
      ok: true,
      message: "If an account exists, a reset link has been sent.",
      devLink:
      process.env.NODE_ENV === "development" && !emailConfigured() ? link : undefined,
    }
  }

  return { ok: true, message: "If an account exists, a reset link has been sent." }
}

export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: zodFieldErrors(parsed.error) }
  }

  const col = await usersCollection()
  const hashed = hashToken(parsed.data.token)
  const user = await col.findOne({
    resetToken: hashed,
    resetExpires: { $gt: new Date() },
  })
  if (!user) {
    return { ok: false, error: "This reset link is invalid or has expired." }
  }

  await col.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordHash: await hashPassword(parsed.data.password),
        updatedAt: new Date(),
        // invalidate all existing sessions on password change
        refreshTokens: [],
      },
      $unset: { resetToken: "", resetExpires: "" },
    },
  )

  return { ok: true, message: "Your password has been reset. You can now sign in." }
}

export async function verifyEmailAction(token: string): Promise<AuthState> {
  if (!token) return { ok: false, error: "Missing verification token." }
  const col = await usersCollection()
  const hashed = hashToken(token)
  const user = await col.findOne({
    verificationToken: hashed,
    verificationExpires: { $gt: new Date() },
  })
  if (!user) {
    return { ok: false, error: "This verification link is invalid or has expired." }
  }
  await col.updateOne(
    { _id: user._id },
    {
      $set: { emailVerified: true, updatedAt: new Date() },
      $unset: { verificationToken: "", verificationExpires: "" },
    },
  )
  return { ok: true, message: "Your email has been verified." }
}

// Re-sends the verification email to the currently signed-in user. Used by the
// "unverified" banner and account settings.
export async function resendVerificationAction(): Promise<AuthState> {
  const current = await getCurrentUser()
  if (!current) return { ok: false, error: "Please sign in first." }
  if (current.emailVerified) {
    return { ok: true, message: "Your email is already verified." }
  }

  const col = await usersCollection()
  const { raw, hashed } = generateToken()
  await col.updateOne(
    { _id: new ObjectId(current.id) },
    {
      $set: {
        verificationToken: hashed,
        verificationExpires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
        updatedAt: new Date(),
      },
    },
  )

  const link = siteUrl(`/verify-email?token=${raw}`)
  await sendAuthEmail({ kind: "verify", to: current.email, link })

  return {
    ok: true,
    message: "Verification email sent. Please check your inbox.",
    devLink:
      process.env.NODE_ENV === "development" && !emailConfigured() ? link : undefined,
  }
}

// Admin-only helper used later by the admin portal.
export async function setUserRole(userId: string, role: Role): Promise<void> {
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role, updatedAt: new Date() } },
  )
}
