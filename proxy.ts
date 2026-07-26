import { type NextRequest, NextResponse } from "next/server"
import { ACCESS_COOKIE, REFRESH_COOKIE, verifyAccessToken } from "@/lib/tokens"
import { hasRole } from "@/lib/types"
import { CURRENCY_COOKIE, currencyForCountry } from "@/lib/currency"

// Routes that require an authenticated session.
const PROTECTED = ["/account", "/library", "/read", "/reader"]
// Routes that require an elevated role.
const ROLE_GATES: { prefix: string; role: "editor" | "admin" }[] = [
  { prefix: "/admin", role: "admin" },
]
// Auth pages an authenticated user should be redirected away from.
const AUTH_PAGES = ["/login", "/register", "/forgot-password"]

// Attach a currency cookie derived from the visitor's IP geo (Vercel edge
// header) on first visit, so server-rendered prices have a sensible default
// before the visitor makes any manual choice. Never overrides an existing cookie.
function withCurrency(req: NextRequest, res: NextResponse): NextResponse {
  if (!req.cookies.get(CURRENCY_COOKIE)) {
    const country = req.headers.get("x-vercel-ip-country")
    res.cookies.set(CURRENCY_COOKIE, currencyForCountry(country), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }
  return res
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const roleGate = ROLE_GATES.find((g) => pathname.startsWith(g.prefix))
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p)) || Boolean(roleGate)
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p))

  // Only verify the session when the route actually depends on it - the matcher
  // now runs on all storefront pages too, purely for currency detection.
  const access = isProtected || isAuthPage ? req.cookies.get(ACCESS_COOKIE)?.value : undefined
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value
  const claims = access ? await verifyAccessToken(access) : null

  if (isProtected) {
    if (claims) {
      if (roleGate && !hasRole(claims.role, roleGate.role)) {
        // Authenticated but lacking privileges.
        return NextResponse.redirect(new URL("/account?denied=1", req.url))
      }
      return withCurrency(req, NextResponse.next())
    }
    // No valid access token. Try to refresh if a refresh cookie exists.
    if (refresh) {
      const refreshUrl = new URL("/api/auth/refresh", req.url)
      refreshUrl.searchParams.set("next", pathname + req.nextUrl.search)
      return NextResponse.redirect(refreshUrl)
    }
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("next", pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  // Keep authenticated users out of auth pages.
  if (claims && isAuthPage) {
    return NextResponse.redirect(new URL("/account", req.url))
  }

  return withCurrency(req, NextResponse.next())
}

export const config = {
  matcher: [
    // Run on all pages except API routes, Next internals and static files (any
    // path with a file extension). This lets the currency cookie be set on a
    // first storefront visit while preserving the auth/role gates above.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)",
  ],
}
