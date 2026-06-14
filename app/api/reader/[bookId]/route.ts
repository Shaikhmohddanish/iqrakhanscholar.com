import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { getPurchasedProductSlugs } from "@/lib/orders"
import { getDb } from "@/lib/mongodb"
import type { ProductDoc } from "@/lib/products"
import { signedPdfUrl } from "@/lib/cloudinary"

async function findProduct(bookId: string): Promise<ProductDoc | null> {
  const db = await getDb()
  const col = db.collection<ProductDoc>("products")
  const { ObjectId } = await import("mongodb")
  if (ObjectId.isValid(bookId)) {
    const byId = await col.findOne({ _id: new ObjectId(bookId) })
    if (byId) return byId
  }
  return col.findOne({ slug: bookId, type: "digital" })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await params

  // 1. Auth
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Book lookup (from products collection)
  const product = await findProduct(bookId)
  if (!product) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }

  // 3. Purchase check (admins bypass)
  if (user.role !== "admin") {
    const purchasedSlugs = await getPurchasedProductSlugs(user.id)
    if (!purchasedSlugs.includes(product.slug)) {
      return NextResponse.json({ error: "Purchase required" }, { status: 403 })
    }
  }

  // 4. Serve PDF - never expose the Cloudinary URL to the client
  if (!product.pdfPublicId) {
    return NextResponse.json(
      { error: "PDF not yet available for this book" },
      { status: 404 },
    )
  }

  try {
    const url = signedPdfUrl(product.pdfPublicId)
    const upstream = await fetch(url, { cache: "no-store" })
    if (!upstream.ok) {
      return NextResponse.json({ error: "PDF unavailable" }, { status: 502 })
    }
    const bytes = await upstream.arrayBuffer()
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve PDF" },
      { status: 500 },
    )
  }
}
