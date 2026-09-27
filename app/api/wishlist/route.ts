import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { getWishlist } from "@/lib/wishlist"

/**
 * The signed-in visitor's wishlisted product ids.
 *
 * Exists so the store pages don't have to read the session server-side. That
 * single getCurrentUser() call was the only per-visitor thing on /store,
 * /store/abayas and /store/accessories, and it forced all three - the site's
 * main commercial pages - to be rendered on demand for every visitor.
 */
export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ productIds: [] })

  const productIds = await getWishlist(user.id)
  return NextResponse.json(
    { productIds },
    // Per-visitor: must never be cached by a CDN or shared proxy.
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  )
}
