'use client'

import { cn } from '@/lib/utils'

interface TabItem {
  value: string
  label: string
  count?: number
  icon?: React.ReactNode
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  variant?: 'underline' | 'pill'
  className?: string
}

export function Tabs({ items, value, onChange, variant = 'underline', className }: TabsProps) {
  if (variant === 'pill') {
    return (
      <div className={cn('flex gap-1 rounded-xl bg-muted p-1', className)} role="tablist">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={value === item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              value === item.value
                ? 'bg-card text-foreground shadow-[var(--shadow-sm)]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                  value === item.value
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted-foreground/10 text-muted-foreground',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  // Underline variant
  return (
    <div className={cn('flex border-b border-border', className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            'relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            value === item.value
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {item.icon}
          {item.label}
          {item.count !== undefined && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                value === item.value
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {item.count}
            </span>
          )}
          {value === item.value && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  )
}
