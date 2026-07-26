// Client-safe product types and pure helpers (no DB / server-only imports).

import { currencyDecimals } from "./currency"

export type ProductType = "digital" | "physical"

// Shape exposed to client components (ObjectId -> string)
export interface PublicProduct {
  id: string
  slug: string
  title: string
  category: string
  type: ProductType
  // base price in minor units of `currency` (the required fallback)
  price: number
  currency: string
  // optional manually-entered amounts keyed by currency code (minor units)
  prices?: Record<string, number>
  image: string
  images: string[]
  badge?: string
  rating: number
  reviews: number
  shortDescription: string
  description: string
  highlights: string[]
  stock: number | null
  featured: boolean
  // Digital book fields
  author?: string
  pageCount?: number
  hasPdf?: boolean  // true when a PDF has been uploaded (pdfPublicId is never sent to client)
}

// Format an amount given in minor units into a localized currency string.
// Handles 0-decimal (JPY), 2-decimal (USD) and 3-decimal (KWD) currencies, and
// drops the fraction for whole amounts (e.g. "$14" instead of "$14.00").
export function formatPrice(minor: number, currency = "USD"): string {
  const decimals = currencyDecimals(currency)
  const factor = 10 ** decimals
  const isWhole = minor % factor === 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: isWhole ? 0 : decimals,
    maximumFractionDigits: decimals,
  }).format(minor / factor)
}
