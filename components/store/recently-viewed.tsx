'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, X } from 'lucide-react'
import { type PublicProduct } from '@/lib/product-types'
import { formatPrice } from '@/lib/product-types'

const STORAGE_KEY = 'ik-recently-viewed'
const MAX_ITEMS = 8

export function addToRecentlyViewed(product: PublicProduct) {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(STORAGE_KEY)
  const list: PublicProduct[] = stored ? JSON.parse(stored) : []
  const filtered = list.filter((p) => p.id !== product.id)
  const updated = [product, ...filtered].slice(0, MAX_ITEMS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
  const [items, setItems] = useState<PublicProduct[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: PublicProduct[] = JSON.parse(stored)
      setItems(currentProductId ? parsed.filter((p) => p.id !== currentProductId) : parsed)
    }
  }, [currentProductId])

  if (items.length === 0) return null

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="size-5 text-muted-foreground" />
        <h2 className="font-heading text-xl font-semibold text-foreground">Recently Viewed</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/store/${product.slug}`}
            className="group flex w-40 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-sm)]"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
