'use client'

import { useState } from 'react'
import { BookSection } from '@/components/library/book-section'
import { BookCard } from '@/components/library/book-card'
import { LibrarySearch } from '@/components/library/library-search'
import { GridSkeleton } from '@/components/ui/grid-skeleton'
import { useInfiniteScroll } from '@/lib/use-infinite-scroll'
import { cn } from '@/lib/utils'

export interface LibraryItem {
  id: string
  slug: string
  title: string
  author: string
  coverImage: string
  rating: number
  reviews: number
  price: number
  currency: string
  category: string
}

interface LibraryClientProps {
  categories: string[]
  recentlyAdded: LibraryItem[]
  popular: LibraryItem[]
  initialItems: LibraryItem[]
  initialHasMore: boolean
}

export function LibraryClient({
  categories,
  recentlyAdded,
  popular,
  initialItems,
  initialHasMore,
}: LibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const isFiltering = searchQuery.trim().length > 0 || activeCategory !== 'All'

  const apiParams = {
    category: activeCategory !== 'All' ? activeCategory : undefined,
    q: searchQuery.trim() || undefined,
  }

  const { items, hasMore, isLoading, isLoadingMore, sentinelRef } =
    useInfiniteScroll<LibraryItem>({
      endpoint: '/api/library',
      params: apiParams,
      pageSize: 8,
      initialItems: isFiltering ? [] : initialItems,
      initialHasMore: isFiltering ? false : initialHasMore,
    })

  return (
    <>
      {/* Search + Category tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((cat) => (
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
        <LibrarySearch onSearch={setSearchQuery} className="sm:w-64" />
      </div>

      {isFiltering ? (
        /* Search / filter results — infinite grid */
        <div className="mt-8">
          {isLoading ? (
            <GridSkeleton variant="book" count={8} />
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-foreground">No books found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  slug={book.slug}
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  rating={book.rating}
                  reviews={book.reviews}
                  price={book.price}
                  currency={book.currency}
                  category={book.category}
                  className="w-full"
                />
              ))}
            </div>
          )}
          {/* Sentinel */}
          <div ref={sentinelRef} className="mt-6 py-2">
            {isLoadingMore && <GridSkeleton variant="book" count={5} />}
            {!hasMore && items.length > 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">All books shown</p>
            )}
          </div>
        </div>
      ) : (
        /* Default — Netflix rows + All books infinite */
        <div className="mt-8 space-y-10">
          <BookSection title="Recently Added" subtitle="Fresh knowledge for your journey">
            {recentlyAdded.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                slug={book.slug}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                rating={book.rating}
                reviews={book.reviews}
                price={book.price}
                currency={book.currency}
                category={book.category}
                className="w-44 shrink-0 sm:w-48"
              />
            ))}
          </BookSection>

          <BookSection title="Most Popular" subtitle="Loved by the community">
            {popular.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                slug={book.slug}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                rating={book.rating}
                reviews={book.reviews}
                price={book.price}
                currency={book.currency}
                category={book.category}
                className="w-44 shrink-0 sm:w-48"
              />
            ))}
          </BookSection>

          <div>
            <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">All Books</h2>
            {isLoading ? (
              <GridSkeleton variant="book" count={8} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {items.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    slug={book.slug}
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage}
                    rating={book.rating}
                    reviews={book.reviews}
                    price={book.price}
                    currency={book.currency}
                    category={book.category}
                    className="w-full"
                  />
                ))}
              </div>
            )}
            <div ref={sentinelRef} className="mt-6 py-2">
              {isLoadingMore && <GridSkeleton variant="book" count={5} />}
              {!hasMore && items.length > 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">All books loaded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
