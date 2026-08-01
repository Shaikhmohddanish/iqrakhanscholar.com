import Link from 'next/link'
import { Clock, Tag } from 'lucide-react'

const categories = ['Worship', 'Parenting', 'Women in Islam', 'Spirituality', 'Knowledge']
const tags = ['Salah', 'Quran', 'Dua', 'Family', 'Taqwa', 'Ramadan', 'Sunnah', 'Sisters']

export interface SidebarPost {
  slug: string
  title: string
  category: string
  readTime: string
}

interface BlogSidebarProps {
  currentSlug?: string
  recentPosts?: SidebarPost[]
}

export function BlogSidebar({ recentPosts = [] }: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Author card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            IK
          </div>
          <div>
            <p className="font-semibold text-foreground">Iqra Khan</p>
            <p className="text-xs text-muted-foreground">Islamic Scholar & Educator</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Sharing authentic Islamic knowledge for the modern Muslim - rooted in Quran & Sunnah.
        </p>
        <Link
          href="/about"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          Learn more →
        </Link>
      </div>

      {/* Recent articles */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">Recent Articles</h3>
          <ul className="mt-4 space-y-4">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group flex gap-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary">{post.category}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </p>
                    <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {post.readTime}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">Categories</h3>
        <ul className="mt-4 space-y-1">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/blog?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <span>{cat}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">Topics</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Tag className="size-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
