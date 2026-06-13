'use client'

import { Star, ThumbsUp } from 'lucide-react'
import { StarRating } from '@/components/ui/star-rating'

interface Review {
  id: string
  name: string
  rating: number
  date: string
  text: string
  helpful: number
}

// Mock reviews for demo
const mockReviews: Review[] = [
  {
    id: '1',
    name: 'Aisha R.',
    rating: 5,
    date: '2 weeks ago',
    text: 'Absolutely beautiful. The content is deeply rooted in the Quran and Sunnah, and presented in such an accessible way. I have recommended it to all my sisters.',
    helpful: 12,
  },
  {
    id: '2',
    name: 'Fatima K.',
    rating: 5,
    date: '1 month ago',
    text: 'MashaAllah, this was exactly what I needed. The practical steps are so easy to implement and I already feel a difference in my daily practice.',
    helpful: 8,
  },
  {
    id: '3',
    name: 'Maryam S.',
    rating: 4,
    date: '2 months ago',
    text: 'Very well-written and beautifully designed. I wish there were more examples, but overall an excellent resource that I keep coming back to.',
    helpful: 5,
  },
]

interface ReviewSectionProps {
  rating: number
  reviewCount: number
}

export function ReviewSection({ rating, reviewCount }: ReviewSectionProps) {
  return (
    <div>
      {/* Summary */}
      <div className="mb-8 flex flex-col items-center gap-6 rounded-xl border border-border bg-muted/30 p-6 sm:flex-row">
        <div className="text-center">
          <p className="font-heading text-5xl font-bold text-foreground">{rating}.0</p>
          <StarRating value={rating} className="mt-2 justify-center" />
          <p className="mt-2 text-sm text-muted-foreground">{reviewCount} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct = stars === rating ? 80 : stars === rating - 1 ? 15 : 5
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-4 text-right text-xs font-medium text-muted-foreground">{stars}</span>
                <Star className="size-3 fill-accent text-accent" />
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {review.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>
            <StarRating value={review.rating} size="sm" className="mt-2" />
            <p className="mt-2 text-sm leading-relaxed text-foreground">{review.text}</p>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ThumbsUp className="size-3" />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
