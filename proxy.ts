import { type NextRequest, NextResponse } from "next/server"
import { ACCESS_COOKIE, REFRESH_COOKIE, verifyAccessToken } from "@/lib/tokens"
import { hasRole } from "@/lib/types"

// Routes that require an authenticated session.
const PROTECTED = ["/account", "/library", "/read", "/reader"]
// Routes that require an elevated role.
const ROLE_GATES: { prefix: string; role: "editor" | "admin" }[] = [
  { prefix: "/admin", role: "admin" },
]
// Auth pages an authenticated user should be redirected away from.
const AUTH_PAGES = ["/login", "/register", "/forgot-password"]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const access = req.cookies.get(ACCESS_COOKIE)?.value
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value
  const claims = access ? await verifyAccessToken(access) : null

  const roleGate = ROLE_GATES.find((g) => pathname.startsWith(g.prefix))
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p)) || Boolean(roleGate)

  if (isProtected) {
    if (claims) {
      if (roleGate && !hasRole(claims.role, roleGate.role)) {
        // Authenticated but lacking privileges.
        return NextResponse.redirect(new URL("/account?denied=1", req.url))
      }
      return NextResponse.next()
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
  if (claims && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/account", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/account/:path*",
    "/library/:path*",
    "/read/:path*",
    "/reader/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
}
