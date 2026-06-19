import "server-only"
import { cookies } from "next/headers"
import { hashToken } from "@/lib/crypto"
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
  signAccessToken,
  signRefreshToken,
} from "@/lib/tokens"
import { addRefreshToken } from "@/lib/users"
import { toPublicUser, type UserDoc } from "@/lib/types"

export interface SessionTokens {
  accessToken: string
  refreshToken: string
}

// Mints access + refresh tokens and records the refresh token for the user.
// Returns the raw tokens so callers can set cookies wherever appropriate
// (the cookies() store in a server action, or a NextResponse in a route handler).
export async function issueSessionTokens(user: UserDoc): Promise<SessionTokens> {
  const publicUser = toPublicUser(user)
  const accessToken = await signAccessToken(publicUser)
  const refreshToken = await signRefreshToken(publicUser.id)
  await addRefreshToken(publicUser.id, hashToken(refreshToken))
  return { accessToken, refreshToken }
}

// Issues a session via the cookies() store. Use from server actions / RSC where
// cookies() is writable. Route handlers that return their own NextResponse
// should call issueSessionTokens() and set cookies on the response instead.
export async function establishSession(user: UserDoc): Promise<void> {
  const { accessToken, refreshToken } = await issueSessionTokens(user)
  const store = await cookies()
  store.set(ACCESS_COOKIE, accessToken, cookieOptions.access)
  store.set(REFRESH_COOKIE, refreshToken, cookieOptions.refresh)
}
