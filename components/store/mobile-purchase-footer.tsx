'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { type PublicProduct } from '@/lib/product-types'
import { useCart } from '@/components/cart/cart-provider'
import { BuyNowButton } from '@/components/cart/buy-now-button'
import { ProductPrice } from '@/components/currency/product-price'
import { cn } from '@/lib/utils'

interface StickyPurchaseBarProps {
  product: PublicProduct
}

export function StickyPurchaseBar({ product }: StickyPurchaseBarProps) {
  const { addItem, isPending } = useCart()
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)

  const soldOut = product.type === 'physical' && product.stock != null && product.stock <= 0

  useEffect(() => {
    function handleScroll() {
      // Show after scrolling past the buy panel (roughly 600px)
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleAdd() {
    if (soldOut) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur transition-transform duration-300 lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
          <ProductPrice item={product} className="font-heading text-lg font-bold text-foreground" />
        </div>
        {soldOut ? (
          <button
            type="button"
            disabled
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground opacity-50"
          >
            Sold Out
          </button>
        ) : (
          // Icon-only Add to Cart so Buy Now fits beside it on a phone.
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              aria-label={added ? 'Added to cart' : `Add ${product.title} to cart`}
              className="inline-flex size-11 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-secondary"
            >
              {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
            </button>
            <BuyNowButton product={product} className="h-11 px-5" />
          </div>
        )}
      </div>
    </div>
  )
}
