import Link from 'next/link'
import Image from 'next/image'
import { Star, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookCardProps {
  id: string
  slug: string
  title: string
  author: string
  coverImage: string
  rating: number
  reviews: number
  price: number
  currency?: string
  category: string
  owned?: boolean
  progress?: number // 0-100
  className?: string
}

export function BookCard({
  slug,
  title,
  author,
  coverImage,
  rating,
  reviews,
  price,
  currency = 'USD',
  category,
  owned,
  progress,
  className,
}: BookCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: price % 100 === 0 ? 0 : 2,
  }).format(price / 100)

  return (
    <Link
      href={`/library/${slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        className,
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <Image
          src={coverImage || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 44vw, 200px"
        />

        {/* Owned badge */}
        {owned && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-success/90 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            <BookOpen className="size-3" />
            Owned
          </div>
        )}

        {/* Category */}
        <span className="absolute bottom-2 right-2 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-medium text-primary backdrop-blur">
          {category}
        </span>
      </div>

      {/* Progress bar */}
      {owned && typeof progress === 'number' && progress > 0 && (
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-heading text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{author}</p>

        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex items-center gap-0.5 text-accent">
            {Array.from({ length: Math.round(rating) }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({reviews})</span>
        </div>

        <div className="mt-auto pt-2">
          {owned ? (
            <span className="text-xs font-medium text-success">
              {progress ? `${progress}% complete` : 'Start reading'}
            </span>
          ) : (
            <span className="font-heading text-sm font-bold text-foreground">{formattedPrice}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
