'use client'

import { useState } from 'react'
import { type PublicProduct } from '@/lib/product-types'
import { ProductCard } from '@/components/store/product-card'
import { QuickViewModal } from '@/components/store/quick-view-modal'

interface SearchProductGridProps {
  products: PublicProduct[]
  wishlistIds?: Set<string>
}

export function SearchProductGrid({ products, wishlistIds = new Set() }: SearchProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<PublicProduct | null>(null)

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={() => setQuickViewProduct(product)}
            initialWishlisted={wishlistIds.has(product.id)}
          />
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          open={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  )
}
