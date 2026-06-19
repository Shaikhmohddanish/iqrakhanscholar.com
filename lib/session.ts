import { cookies } from "next/headers"
import { ACCESS_COOKIE, verifyAccessToken } from "./tokens"
import { findUserById } from "./users"
import type { PublicUser, Role } from "./types"
import { hasRole } from "./types"

// Reads the current user from the access-token cookie. Returns null if no valid
// session. Token refresh is handled by the proxy/middleware layer.
export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies()
  const token = store.get(ACCESS_COOKIE)?.value
  if (!token) return null

  const claims = await verifyAccessToken(token)
  if (!claims) return null

  return {
    id: claims.sub,
    name: claims.name,
    email: claims.email,
    role: claims.role,
    emailVerified: claims.emailVerified,
  }
}

// Throws-style guard for server actions / route handlers: returns user or null.
export async function requireUser(): Promise<PublicUser | null> {
  return getCurrentUser()
}

export async function requireRole(required: Role): Promise<PublicUser | null> {
  const user = await getCurrentUser()
  if (!user) return null
  if (!hasRole(user.role, required)) return null
  return user
}

// Authoritative email-verification check against the database. The access-token
// claim can be up to 15 minutes stale (e.g. right after a user clicks the
// verification link), so security-sensitive gates — checkout, downloads —
// should confirm against the DB rather than trusting the cached claim.
export async function isUserVerified(userId: string): Promise<boolean> {
  const doc = await findUserById(userId)
  return Boolean(doc?.emailVerified)
}
