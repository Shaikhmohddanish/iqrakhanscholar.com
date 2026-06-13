'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PublicProduct } from '@/lib/product-types'
import { ProductCard } from '@/components/store/product-card'
import { QuickViewModal } from '@/components/store/quick-view-modal'

type Props = {
  id: string
  eyebrow: string
  title: string
  description: string
  products: PublicProduct[]
  ctaLabel: string
  ctaHref: string
  variant?: 'default' | 'muted'
}

export function ProductShowcase({
  id,
  eyebrow,
  title,
  description,
  products,
  ctaLabel,
  ctaHref,
  variant = 'default',
}: Props) {
  const [quickView, setQuickView] = useState<PublicProduct | null>(null)

  return (
    <section
      id={id}
      className={
        variant === 'muted'
          ? 'scroll-mt-20 border-y border-border bg-card'
          : 'scroll-mt-20'
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={() => setQuickView(product)}
              showWishlist={false}
            />
          ))}
        </div>
      </div>

      {quickView && (
        <QuickViewModal
          product={quickView}
          open={!!quickView}
          onClose={() => setQuickView(null)}
        />
      )}
    </section>
  )
}
