import { ProductCardSkeleton, ProductListSkeleton } from '@/components/store/product-card-skeleton'
import { BookCardSkeleton } from '@/components/library/book-card-skeleton'
import { ArticleCardSkeleton } from '@/components/blog/article-card-skeleton'

type GridVariant = 'product-grid' | 'product-list' | 'book' | 'article'

interface GridSkeletonProps {
  variant: GridVariant
  count?: number
}

export function GridSkeleton({ variant, count = 6 }: GridSkeletonProps) {
  const items = Array.from({ length: count })

  if (variant === 'product-grid') {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading products">
        {items.map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }

  if (variant === 'product-list') {
    return (
      <div className="space-y-4" aria-label="Loading products">
        {items.map((_, i) => <ProductListSkeleton key={i} />)}
      </div>
    )
  }

  if (variant === 'book') {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-label="Loading books">
        {items.map((_, i) => <BookCardSkeleton key={i} />)}
      </div>
    )
  }

  // article
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading articles">
      {items.map((_, i) => <ArticleCardSkeleton key={i} />)}
    </div>
  )
}
