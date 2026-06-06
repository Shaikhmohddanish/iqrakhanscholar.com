"use server"

import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { hashPassword, verifyPassword, generateToken, hashToken } from "@/lib/crypto"
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
  signAccessToken,
  signRefreshToken,
} from "@/lib/tokens"
import {
  usersCollection,
  findUserByEmail,
  normalizeEmail,
  addRefreshToken,
  removeRefreshToken,
} from "@/lib/users"
import { toPublicUser, type UserDoc, type Role } from "@/lib/types"
import { registerSchema, loginSchema, forgotSchema, resetSchema } from "@/lib/validation"
import { sendAuthEmail } from "@/lib/email"

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

async function establishSession(user: UserDoc) {
  const publicUser = toPublicUser(user)
  const accessToken = await signAccessToken(publicUser)
  const refreshToken = await signRefreshToken(publicUser.id)
  await addRefreshToken(publicUser.id, hashToken(refreshToken))

  const store = await cookies()
  store.set(ACCESS_COOKIE, accessToken, cookieOptions.access)
  store.set(REFRESH_COOKIE, refreshToken, cookieOptions.refresh)
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
    return { ok: false, fieldErrors: { email: "An account with this email already exists" } }
  }

  const { raw, hashed } = generateToken()
  const now = new Date()
  const doc: UserDoc = {
    name,
    email: normalizeEmail(email),
    passwordHash: await hashPassword(password),
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
    devLink: process.env.NODE_ENV === "development" ? link : undefined,
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
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
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
      devLink: process.env.NODE_ENV === "development" ? link : undefined,
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

// Admin-only helper used later by the admin portal.
export async function setUserRole(userId: string, role: Role): Promise<void> {
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role, updatedAt: new Date() } },
  )
}
