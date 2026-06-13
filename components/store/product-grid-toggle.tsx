'use client'

import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGridToggleProps {
  view: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
  className?: string
}

export function ProductGridToggle({ view, onChange, className }: ProductGridToggleProps) {
  return (
    <div className={cn('inline-flex rounded-lg border border-border p-0.5', className)}>
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-md transition-colors',
          view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
        aria-label="Grid view"
        aria-pressed={view === 'grid'}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-md transition-colors',
          view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
        aria-label="List view"
        aria-pressed={view === 'list'}
      >
        <List className="size-4" />
      </button>
    </div>
  )
}
