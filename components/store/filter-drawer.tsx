'use client'

import { X, SlidersHorizontal } from 'lucide-react'
import { StoreSidebar } from './store-sidebar'
import { useEffect } from 'react'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  // Pass all filter props through
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  typeFilter: string
  onTypeChange: (type: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  minPrice: number
  maxPrice: number
  onClearAll: () => void
  resultCount: number
}

export function FilterDrawer({
  open,
  onClose,
  resultCount,
  ...filterProps
}: FilterDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleKey)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKey)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop - same stacking context, renders before panel so it stays behind */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="absolute inset-x-0 bottom-0 z-10 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card shadow-[var(--shadow-xl)] animate-slide-in-bottom"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Filters</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close filters"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Filter content */}
        <div className="px-5 py-6">
          <StoreSidebar {...filterProps} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-border bg-card px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Show {resultCount} Result{resultCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
