import { SignJWT, jwtVerify } from "jose"
import type { PublicUser, Role } from "./types"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET)

if (!process.env.AUTH_SECRET) {
  throw new Error("Missing AUTH_SECRET environment variable")
}

export const ACCESS_COOKIE = "ik_access"
export const REFRESH_COOKIE = "ik_refresh"

// Short-lived access token, long-lived refresh token.
const ACCESS_TTL_SECONDS = 60 * 15 // 15 minutes
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

export const REFRESH_TTL = REFRESH_TTL_SECONDS

export interface AccessClaims {
  sub: string
  email: string
  name: string
  role: Role
  emailVerified: boolean
}

export async function signAccessToken(user: PublicUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(secret)
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SECONDS}s`)
    .sign(secret)
}

export async function verifyAccessToken(token: string): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
      emailVerified: payload.emailVerified as boolean,
    }
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.type !== "refresh") return null
    return { sub: payload.sub as string }
  } catch {
    return null
  }
}

export const cookieOptions = {
  access: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ACCESS_TTL_SECONDS,
  },
  refresh: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: REFRESH_TTL_SECONDS,
  },
}
