'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type BlogPostItem } from '@/lib/blog-list'
import { useInfiniteScroll } from '@/lib/use-infinite-scroll'
import { GridSkeleton } from '@/components/ui/grid-skeleton'

interface BlogListClientProps {
  categories: string[]
  initialItems: BlogPostItem[]
  initialHasMore: boolean
}

export function BlogListClient({ categories, initialItems, initialHasMore }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(v: string) {
    setSearchQuery(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQ(v.trim()), 300)
  }

  const apiParams = {
    category: activeCategory !== 'All' ? activeCategory : undefined,
    q: debouncedQ || undefined,
  }

  const { items, hasMore, isLoading, isLoadingMore, sentinelRef } =
    useInfiniteScroll<BlogPostItem>({
      endpoint: '/api/blog-posts',
      params: apiParams,
      pageSize: 9,
      initialItems,
      initialHasMore,
    })

  return (
    <>
      {/* Filters row */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-foreground hover:bg-muted',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setDebouncedQ('') }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {isLoading ? (
          <GridSkeleton variant="article" count={6} />
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">No articles found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-md)]"
              >
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    Read more <ArrowRight className="ml-1 size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} className="mt-8 py-2">
          {isLoadingMore && <GridSkeleton variant="article" count={3} />}
          {!hasMore && items.length > 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">All articles loaded</p>
          )}
        </div>
      </div>
    </>
  )
}
