'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type PublicProduct } from '@/lib/product-types'
import Link from 'next/link'

interface StoreSearchBarProps {
  products: PublicProduct[]
  className?: string
}

export function StoreSearchBar({ products, className }: StoreSearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<PublicProduct[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('ik-recent-searches')
    if (stored) setRecentSearches(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      const q = query.toLowerCase()
      const filtered = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q),
      )
      setResults(filtered.slice(0, 6))
    }, 200) // debounce

    return () => clearTimeout(timer)
  }, [query, products])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function saveSearch(term: string) {
    const trimmed = term.trim()
    if (!trimmed) return
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('ik-recent-searches', JSON.stringify(updated))
  }

  function handleSelect(product: PublicProduct) {
    saveSearch(product.title)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          aria-label="Search products"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && (query || recentSearches.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-lg)] animate-scale-in">
          {!query && recentSearches.length > 0 && (
            <div className="p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="size-3" />
                Recent Searches
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setQuery(s) }}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No products found for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/store/${product.slug}`}
                  onClick={() => handleSelect(product)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.image && (
                      <img src={product.image} alt="" className="size-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
