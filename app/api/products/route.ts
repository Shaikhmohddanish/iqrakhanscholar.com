import { type NextRequest, NextResponse } from 'next/server'
import { queryProducts } from '@/lib/products'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '8', 10)
  const type = searchParams.get('type') ?? undefined
  const sort = searchParams.get('sort') ?? 'featured'
  const q = searchParams.get('q') ?? undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const categoriesRaw = searchParams.get('categories')
  const categories = categoriesRaw ? categoriesRaw.split(',').filter(Boolean) : undefined

  const result = await queryProducts({ page, limit, type, categories, minPrice, maxPrice, sort, q })
  return NextResponse.json(result)
}
