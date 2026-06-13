'use client'

import { useEffect } from 'react'
import { addToRecentlyViewed } from './recently-viewed'
import { type PublicProduct } from '@/lib/product-types'

/** Tracks the product view in recently-viewed localStorage */
export function ProductViewTracker({ product }: { product: PublicProduct }) {
  useEffect(() => {
    addToRecentlyViewed(product)
  }, [product])
  return null
}
