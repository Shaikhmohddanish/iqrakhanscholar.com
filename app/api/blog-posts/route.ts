import { type NextRequest, NextResponse } from 'next/server'
import { queryBlogPosts } from '@/lib/blog-list'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '9', 10)
  const category = searchParams.get('category') ?? undefined
  const q = searchParams.get('q') ?? undefined
  const result = queryBlogPosts({ page, limit, category, q })
  return NextResponse.json(result)
}
