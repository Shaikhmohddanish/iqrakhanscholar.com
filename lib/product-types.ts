// Client-safe product types and pure helpers (no DB / server-only imports).

export type ProductType = "digital" | "physical"

// Shape exposed to client components (ObjectId -> string)
export interface PublicProduct {
  id: string
  slug: string
  title: string
  category: string
  type: ProductType
  // price in integer cents
  price: number
  currency: string
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

export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}
