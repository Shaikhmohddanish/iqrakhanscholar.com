import { type NextRequest, NextResponse } from 'next/server'
import { getPublishedArticles, toBlogListItem } from '@/lib/blog'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '9', 10)
  const category = searchParams.get('category') ?? undefined
  const q = searchParams.get('q')?.trim() || undefined

  const { articles, total } = await getPublishedArticles({ page, limit, category, q })
  const items = articles.map(toBlogListItem)
  const hasMore = page * limit < total

  return NextResponse.json({ items, total, hasMore, page })
}
