import { type NextRequest, NextResponse } from 'next/server'
import { queryProducts } from '@/lib/products'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '8', 10)
  const category = searchParams.get('category') ?? undefined
  const q = searchParams.get('q') ?? undefined

  const result = await queryProducts({
    page,
    limit,
    type: 'digital',
    categories: category ? [category] : undefined,
    q,
  })

  // Map to the shape the library client expects
  const items = result.items.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    author: p.author ?? '',
    coverImage: p.image,
    rating: p.rating,
    reviews: p.reviews,
    price: p.price,
    currency: p.currency,
    category: p.category,
  }))

  return NextResponse.json({ items, total: result.total, hasMore: result.hasMore, page: result.page })
}
