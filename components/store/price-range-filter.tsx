'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface PriceRangeFilterProps {
  min: number // in cents
  max: number // in cents
  value: [number, number]
  onChange: (range: [number, number]) => void
  currency?: string
  className?: string
}

function formatCents(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
  currency = 'USD',
  className,
}: PriceRangeFilterProps) {
  const [localValue, setLocalValue] = useState(value)

  function handleMinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    const newMin = Math.min(v, localValue[1])
    setLocalValue([newMin, localValue[1]])
    onChange([newMin, localValue[1]])
  }

  function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    const newMax = Math.max(v, localValue[0])
    setLocalValue([localValue[0], newMax])
    onChange([localValue[0], newMax])
  }

  const leftPercent = ((localValue[0] - min) / (max - min)) * 100
  const rightPercent = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{formatCents(localValue[0], currency)}</span>
        <span className="text-muted-foreground">—</span>
        <span className="font-medium text-foreground">{formatCents(localValue[1], currency)}</span>
      </div>

      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute inset-0 rounded-full bg-muted" />
        {/* Active range */}
        <div
          className="absolute top-0 h-full rounded-full bg-primary"
          style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
        />
        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:shadow-sm"
          aria-label="Minimum price"
        />
        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:shadow-sm"
          aria-label="Maximum price"
        />
      </div>
    </div>
  )
}
