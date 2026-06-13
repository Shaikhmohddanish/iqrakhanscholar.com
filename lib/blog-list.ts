// Client-safe — only imports from site-data (no server-only)
import { blogPosts } from '@/lib/site-data'

export interface BlogPostItem {
  id: string
  slug: string
  title: string
  category: string
  readTime: string
  excerpt: string
  image: string
}

export interface BlogPostPage {
  items: BlogPostItem[]
  total: number
  hasMore: boolean
  page: number
}

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

const allPosts: BlogPostItem[] = blogPosts.map((p, i) => ({
  id: `post-${i}`,
  slug: toSlug(p.title),
  title: p.title,
  category: p.category,
  readTime: p.readTime,
  excerpt: p.excerpt,
  image: p.image || '/placeholder.svg',
}))

export function queryBlogPosts(opts: {
  page?: number
  limit?: number
  category?: string
  q?: string
} = {}): BlogPostPage {
  const { page = 1, limit = 9, category, q } = opts
  let result = [...allPosts]

  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category)
  }
  if (q) {
    const lower = q.toLowerCase()
    result = result.filter(
      (p) => p.title.toLowerCase().includes(lower) || p.excerpt.toLowerCase().includes(lower),
    )
  }

  const total = result.length
  const skip = (page - 1) * limit
  const items = result.slice(skip, skip + limit)
  return { items, total, hasMore: skip + items.length < total, page }
}

export function getBlogCategories(): string[] {
  return ['All', ...new Set(allPosts.map((p) => p.category))]
}
