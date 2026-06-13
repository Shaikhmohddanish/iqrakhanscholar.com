'use client'

import Image from 'next/image'
import { X, Star, ShoppingBag, Check, Loader2 } from 'lucide-react'
import { formatPrice, type PublicProduct } from '@/lib/product-types'
import { useCart } from '@/components/cart/cart-provider'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface QuickViewModalProps {
  product: PublicProduct
  open: boolean
  onClose: () => void
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const { addItem, isPending } = useCart()
  const [added, setAdded] = useState(false)

  if (!open) return null

  const isDigital = product.type === 'digital'
  const soldOut = product.type === 'physical' && product.stock != null && product.stock <= 0

  function handleAdd() {
    if (soldOut) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="backdrop-overlay animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        className="relative z-[51] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-xl)] animate-scale-in"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full bg-card/90 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          aria-label="Close quick view"
        >
          <X className="size-5" />
        </button>

        <div className="grid sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-muted">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
            {product.badge && (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {product.category}
            </span>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">
              {product.title}
            </h2>

            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 text-accent">
                {Array.from({ length: product.rating }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>

            <div className="mt-auto pt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isDigital ? 'Digital' : 'Physical'}
                </span>
              </div>

              {product.type === 'physical' && product.stock != null && (
                <p className={cn('mt-1 text-xs font-medium', soldOut ? 'text-destructive' : 'text-success')}>
                  {soldOut ? 'Out of stock' : `${product.stock} in stock`}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={soldOut}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {soldOut ? (
                    'Sold Out'
                  ) : isPending && !added ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : added ? (
                    <><Check className="size-4" /> Added</>
                  ) : (
                    <><ShoppingBag className="size-4" /> Add to Cart</>
                  )}
                </button>
                <a
                  href={`/store/${product.slug}`}
                  className="flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
