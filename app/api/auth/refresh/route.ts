import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/tokens"
import { hashToken } from "@/lib/crypto"
import { findUserById, hasRefreshToken, rotateRefreshToken } from "@/lib/users"
import { toPublicUser } from "@/lib/types"

// Node.js runtime: needs MongoDB access.
export const runtime = "nodejs"

function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/account"
  return next
}

export async function GET(req: NextRequest) {
  const next = safeNext(req.nextUrl.searchParams.get("next"))
  const loginUrl = new URL(`/login?next=${encodeURIComponent(next)}`, req.url)

  const store = await cookies()
  const refresh = store.get(REFRESH_COOKIE)?.value
  if (!refresh) return NextResponse.redirect(loginUrl)

  const payload = await verifyRefreshToken(refresh)
  if (!payload) return NextResponse.redirect(loginUrl)

  const hashed = hashToken(refresh)
  // Enforce server-side revocation: the refresh token must still be on file.
  const valid = await hasRefreshToken(payload.sub, hashed)
  if (!valid) return NextResponse.redirect(loginUrl)

  const user = await findUserById(payload.sub)
  if (!user) return NextResponse.redirect(loginUrl)

  // Rotate: issue a new refresh token and revoke the old one.
  const newRefresh = await signRefreshToken(user._id!.toString())
  await rotateRefreshToken(payload.sub, hashed, hashToken(newRefresh))
  const newAccess = await signAccessToken(toPublicUser(user))

  const res = NextResponse.redirect(new URL(next, req.url))
  res.cookies.set(ACCESS_COOKIE, newAccess, cookieOptions.access)
  res.cookies.set(REFRESH_COOKIE, newRefresh, cookieOptions.refresh)
  return res
}
