'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LibrarySearchProps {
  onSearch: (query: string) => void
  className?: string
}

export function LibrarySearch({ onSearch, className }: LibrarySearchProps) {
  const [query, setQuery] = useState('')

  function handleChange(value: string) {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search books..."
        className="input-base w-full pl-9 pr-9"
        aria-label="Search library"
      />
      {query && (
        <button
          type="button"
          onClick={() => handleChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
