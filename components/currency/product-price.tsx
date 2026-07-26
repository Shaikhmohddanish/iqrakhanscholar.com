"use client"

import { formatPrice } from "@/lib/product-types"
import { resolveProductPrice, type PricedLike } from "@/lib/currency"
import { useCurrency } from "./currency-provider"

// Renders a price in the visitor's active currency, falling back to the item's
// base price when no local price is configured. Works inside server components
// as a client island (it reads the currency context).
export function ProductPrice({
  item,
  className,
}: {
  item: PricedLike
  className?: string
}) {
  const { currency } = useCurrency()
  const { amount, currency: resolved } = resolveProductPrice(item, currency)
  return <span className={className}>{formatPrice(amount, resolved)}</span>
}
