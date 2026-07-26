// Client-safe shared types for the blog list UI. The data itself comes from
// MongoDB via lib/blog.ts (server-only); these types are imported by both the
// server (mapper in lib/blog.ts) and the client list component.

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
