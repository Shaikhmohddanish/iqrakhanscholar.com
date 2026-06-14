'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface InfiniteScrollResponse<T> {
  items: T[]
  total: number
  hasMore: boolean
  page: number
}

interface UseInfiniteScrollOptions<T> {
  endpoint: string
  params: Record<string, string | number | boolean | undefined | null>
  pageSize?: number
  initialItems?: T[]
  initialHasMore?: boolean
}

function buildUrl(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined | null>,
  page: number,
  limit: number,
): string {
  const qs = new URLSearchParams()
  qs.set('page', String(page))
  qs.set('limit', String(limit))
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      qs.set(k, String(v))
    }
  }
  return `${endpoint}?${qs.toString()}`
}

export function useInfiniteScroll<T extends { id: string }>({
  endpoint,
  params,
  pageSize = 8,
  initialItems = [],
  initialHasMore = false,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [page, setPage] = useState(initialItems.length > 0 ? 1 : 0)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(initialItems.length === 0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stable key for the current params so we can detect changes
  const paramsKey = JSON.stringify(params)
  const paramsKeyRef = useRef(paramsKey)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Fetch a specific page, optionally replacing existing items
  const fetchPage = useCallback(
    async (p: number, replace: boolean) => {
      if (replace) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsLoadingMore(true)
      }
      try {
        const url = buildUrl(endpoint, params, p, pageSize)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: InfiniteScrollResponse<T> = await res.json()
        setItems((prev) => {
          if (replace) return data.items
          // Dedupe by id
          const seen = new Set(prev.map((i) => i.id))
          const fresh = data.items.filter((i) => !seen.has(i.id))
          return [...prev, ...fresh]
        })
        setHasMore(data.hasMore)
        setPage(p)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, paramsKey, pageSize],
  )

  // When params change, reset to page 1
  useEffect(() => {
    if (paramsKeyRef.current === paramsKey && initialItems.length > 0 && page === 1) {
      // First mount with initialItems - skip refetch
      paramsKeyRef.current = paramsKey
      return
    }
    paramsKeyRef.current = paramsKey
    fetchPage(1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey])

  // Intersection observer on sentinel
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          fetchPage(page + 1, false)
        }
      },
      { threshold: 0.1, rootMargin: '200px' },
    )
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [hasMore, isLoadingMore, isLoading, page, fetchPage])

  const reset = useCallback(() => fetchPage(1, true), [fetchPage])

  return { items, hasMore, isLoading, isLoadingMore, error, sentinelRef, reset }
}
