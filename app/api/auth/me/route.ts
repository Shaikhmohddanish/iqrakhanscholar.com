import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"

// Lets the header resolve the session from the browser instead of every page
// having to read cookies server-side, which forced all ~40 public routes to
// render on demand (see the note in components/site-header.tsx).
//
// Cheap: getCurrentUser only verifies the JWT and reads its claims - no
// database round-trip. Returns the same PublicUser shape the server passed
// before, or null when signed out.
export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getCurrentUser()
  return NextResponse.json(
    { user },
    {
      headers: {
        // Per-visitor and short-lived: must never be cached by a CDN or shared
        // proxy, or one visitor's identity would be served to another.
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  )
}
