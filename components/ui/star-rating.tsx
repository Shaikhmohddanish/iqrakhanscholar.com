'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  max?: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'size-3.5',
  md: 'size-5',
  lg: 'size-6',
}

export function StarRating({
  value,
  max = 5,
  onChange,
  size = 'md',
  showValue = false,
  className,
}: StarRatingProps) {
  const interactive = Boolean(onChange)

  return (
    <div className={cn('flex items-center gap-0.5', className)} role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value)
        const halfFilled = !filled && i < value
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default',
            )}
            aria-label={`${i + 1} star${i + 1 === 1 ? '' : 's'}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? 'fill-accent text-accent'
                  : halfFilled
                    ? 'fill-accent/50 text-accent'
                    : 'fill-none text-muted-foreground/40',
              )}
            />
          </button>
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">{value.toFixed(1)}</span>
      )}
    </div>
  )
}
