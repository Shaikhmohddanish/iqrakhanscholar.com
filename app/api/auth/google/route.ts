import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { buildGoogleAuthUrl, googleConfigured } from "@/lib/google-oauth"

export const OAUTH_STATE_COOKIE = "ik_oauth_state"

// Initiates Google sign-in: generates a CSRF state, remembers the post-login
// destination, and redirects to Google's consent screen.
export async function GET(req: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/login?error=google_unavailable", req.url))
  }

  const nextParam = req.nextUrl.searchParams.get("next") || "/account"
  // Only allow internal, single-leading-slash paths as the redirect target.
  const safeNext =
    nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account"

  const state = randomBytes(16).toString("hex")
  const res = NextResponse.redirect(buildGoogleAuthUrl(state))
  res.cookies.set(OAUTH_STATE_COOKIE, JSON.stringify({ state, next: safeNext }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  })
  return res
}
