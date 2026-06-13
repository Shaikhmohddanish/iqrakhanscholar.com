'use client'

import { PriceRangeFilter } from './price-range-filter'
import { cn } from '@/lib/utils'

interface StoreSidebarProps {
  // Filter state
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
  className?: string
}

const typeOptions = [
  { label: 'All Products', value: '' },
  { label: 'Digital', value: 'digital' },
  { label: 'Physical', value: 'physical' },
]

export function StoreSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  onClearAll,
  className,
}: StoreSidebarProps) {
  const hasFilters = selectedCategories.length > 0 || typeFilter || priceRange[0] > minPrice || priceRange[1] < maxPrice

  function toggleCategory(cat: string) {
    if (selectedCategories.includes(cat)) {
      onCategoryChange(selectedCategories.filter((c) => c !== cat))
    } else {
      onCategoryChange([...selectedCategories, cat])
    }
  }

  return (
    <aside className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Filters</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Type */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Type</h3>
        <div className="space-y-2">
          {typeOptions.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="type"
                checked={typeFilter === opt.value}
                onChange={() => onTypeChange(opt.value)}
                className="size-4 accent-primary"
              />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="size-4 rounded accent-primary"
              />
              <span className="text-sm text-foreground">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Price Range</h3>
        <PriceRangeFilter
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={onPriceRangeChange}
        />
      </div>
    </aside>
  )
}
