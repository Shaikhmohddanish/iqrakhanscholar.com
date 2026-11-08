import { StarRating } from '@/components/ui/star-rating'

interface ReviewSectionProps {
  rating: number
  reviewCount: number
}

/**
 * The product's review summary: average and count, nothing else.
 *
 * This used to render three hard-coded, invented reviews with made-up
 * "Helpful" counts and an 80/15/5% star breakdown on every product and e-book. None of it was real - there is no
 * reviews collection - and the client asked for it to be removed. Callers only
 * render this when the product actually has reviews.
 */
export function ReviewSection({ rating, reviewCount }: ReviewSectionProps) {
  if (reviewCount < 1) return null

  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 p-6 text-center">
      <p className="font-heading text-5xl font-bold text-foreground">{rating.toFixed(1)}</p>
      <StarRating value={rating} className="mt-2 justify-center" />
      <p className="mt-2 text-sm text-muted-foreground">
        {reviewCount} review{reviewCount === 1 ? '' : 's'}
      </p>
    </div>
  )
}
