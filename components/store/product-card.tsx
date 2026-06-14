'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Eye, ShoppingBag, Check } from 'lucide-react'
import { BarLoader } from '@/components/ui/bar-loader'
import { formatPrice, type PublicProduct } from '@/lib/product-types'
import { useCart } from '@/components/cart/cart-provider'
import { WishlistButton } from './wishlist-button'

interface ProductCardProps {
  product: PublicProduct
  onQuickView: () => void
  initialWishlisted?: boolean
  showWishlist?: boolean
}

export function ProductCard({
  product,
  onQuickView,
  initialWishlisted = false,
  showWishlist = true,
}: ProductCardProps) {
  const { addItem, isPending } = useCart()
  const [added, setAdded] = useState(false)

  const soldOut = product.type === 'physical' && product.stock != null && product.stock <= 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/store/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {product.badge}
          </span>
        )}

        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-primary backdrop-blur">
          {product.type === 'digital' ? 'Digital' : 'Physical'}
        </span>

        {/* Hover overlay with eye icon */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView() }}
            className="flex size-10 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-transform hover:scale-110"
            aria-label="Quick view"
          >
            <Eye className="size-5" />
          </button>
        </div>

        {showWishlist && (
          <div className="absolute bottom-3 right-3">
            <WishlistButton productId={product.id} initialWishlisted={initialWishlisted} variant="overlay" size="sm" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{product.category}</p>
        <h3 className="mt-1.5 font-heading text-lg font-semibold leading-snug text-foreground">
          <Link href={`/store/${product.slug}`} className="hover:underline underline-offset-4">
            {product.title}
          </Link>
        </h3>

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-accent">
            {Array.from({ length: product.rating }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-heading text-xl font-bold text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {soldOut ? 'Sold Out' : added ? (
              <><Check className="size-4" /> Added</>
            ) : isPending ? (
              <BarLoader size="md" />
            ) : (
              <><ShoppingBag className="size-4" /> Add</>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
