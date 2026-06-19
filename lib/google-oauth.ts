import "server-only"

// Minimal Google OAuth 2.0 (Authorization Code) helpers — no external SDK.
// Used by the /api/auth/google routes to sign users in with Google and plug
// into the app's existing session/cookie system.

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"
}

export function googleRedirectUri(): string {
  // Explicit override wins; otherwise derive from the site URL. Must exactly
  // match an Authorized redirect URI configured in Google Cloud Console.
  return process.env.GOOGLE_REDIRECT_URI || `${siteUrl()}/api/auth/google/callback`
}

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  })
  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: googleRedirectUri(),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status}`)
  }
  return res.json() as Promise<GoogleTokenResponse>
}

export interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  given_name?: string
  picture?: string
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Google userinfo request failed: ${res.status}`)
  }
  return res.json() as Promise<GoogleUserInfo>
}
