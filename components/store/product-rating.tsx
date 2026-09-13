import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductRatingProps {
  rating: number
  reviews: number
  /** Render "N reviews" instead of the compact "(N)". */
  verbose?: boolean
  className?: string
}

/**
 * Star rating + review count for a product.
 *
 * Renders NOTHING when the product has no reviews. Stars with no reviews behind
 * them are fabricated social proof - and, via the product JSON-LD, would also
 * report a non-existent aggregateRating to search engines. Ratings reappear on
 * their own once real reviews exist.
 */
export function ProductRating({ rating, reviews, verbose, className }: ProductRatingProps) {
  if (!reviews || reviews < 1) return null

  const filled = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5 text-accent" aria-hidden>
        {Array.from({ length: filled }).map((_, i) => (
          <Star key={i} className="size-3.5 fill-current" />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {verbose ? `${reviews} review${reviews === 1 ? '' : 's'}` : `(${reviews})`}
      </span>
      <span className="sr-only">
        Rated {filled} out of 5 from {reviews} review{reviews === 1 ? '' : 's'}
      </span>
    </div>
  )
}
