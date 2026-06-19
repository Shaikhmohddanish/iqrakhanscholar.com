import { type NextRequest, NextResponse } from "next/server"
import { exchangeCodeForTokens, fetchGoogleUserInfo } from "@/lib/google-oauth"
import { findOrCreateGoogleUser } from "@/lib/users"
import { issueSessionTokens } from "@/lib/auth-session"
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptions } from "@/lib/tokens"
import { OAUTH_STATE_COOKIE } from "../route"

// Handles Google's redirect back: validates state, exchanges the code, loads
// the profile, finds/links/creates the user, and establishes a session.
export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const code = url.searchParams.get("code")
  const returnedState = url.searchParams.get("state")
  const oauthError = url.searchParams.get("error")

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/login?error=${reason}`, req.url))

  if (oauthError) return fail("google_denied")
  if (!code || !returnedState) return fail("google_invalid")

  // Validate state against the cookie (CSRF protection).
  const raw = req.cookies.get(OAUTH_STATE_COOKIE)?.value
  if (!raw) return fail("google_state")
  let stored: { state: string; next: string }
  try {
    stored = JSON.parse(raw)
  } catch {
    return fail("google_state")
  }
  if (stored.state !== returnedState) return fail("google_state")

  try {
    const tokens = await exchangeCodeForTokens(code)
    const info = await fetchGoogleUserInfo(tokens.access_token)
    if (!info.email) return fail("google_no_email")

    const user = await findOrCreateGoogleUser({
      googleId: info.sub,
      email: info.email,
      name: info.name || info.given_name || "",
      emailVerified: Boolean(info.email_verified),
      image: info.picture,
    })

    const session = await issueSessionTokens(user)

    const safeNext =
      stored.next?.startsWith("/") && !stored.next.startsWith("//") ? stored.next : "/account"
    const res = NextResponse.redirect(new URL(safeNext, req.url))
    res.cookies.set(ACCESS_COOKIE, session.accessToken, cookieOptions.access)
    res.cookies.set(REFRESH_COOKIE, session.refreshToken, cookieOptions.refresh)
    res.cookies.delete(OAUTH_STATE_COOKIE)
    return res
  } catch {
    return fail("google_failed")
  }
}
