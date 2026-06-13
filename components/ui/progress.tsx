import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number // 0–100
  max?: number
  variant?: 'linear' | 'circular'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
  color?: 'primary' | 'success' | 'warning' | 'destructive'
}

const colorClasses = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
}

const circularSizes = {
  sm: { size: 32, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 64, stroke: 5 },
}

const circularColors = {
  primary: 'stroke-primary',
  success: 'stroke-success',
  warning: 'stroke-warning',
  destructive: 'stroke-destructive',
}

export function Progress({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  showLabel = false,
  className,
  color = 'primary',
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  if (variant === 'circular') {
    const { size: svgSize, stroke } = circularSizes[size]
    const radius = (svgSize - stroke) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={stroke}
            className="fill-none stroke-muted"
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn('fill-none transition-[stroke-dashoffset] duration-500', circularColors[color])}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-xs font-semibold text-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    )
  }

  // Linear
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2' : 'h-3'

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full overflow-hidden rounded-full bg-muted', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out', colorClasses[color])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  )
}
