import type { Metadata } from "next"
import { Suspense } from "react"
import { getAllProducts, type ProductType } from "@/lib/products"
import { StoreFilters } from "@/components/store/store-filters"
import { StoreProductCard } from "@/components/store/store-product-card"

export const metadata: Metadata = {
  title: "Store — Books, Journals & Digital Resources",
  description:
    "Shop signed hardcover books, premium Islamic journals and planners, plus instant-download ebooks, study guides and resource packs by Iqra Khan.",
  alternates: { canonical: "/store" },
}

type SearchParams = Promise<{ type?: string; sort?: string }>

export default async function StorePage({ searchParams }: { searchParams: SearchParams }) {
  const { type, sort } = await searchParams
  let products = await getAllProducts()

  if (type === "digital" || type === "physical") {
    products = products.filter((p) => p.type === (type as ProductType))
  }

  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price)
  else if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price)
  else if (sort === "rating")
    products = [...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The Store</p>
        <h1 className="mt-3 text-balance font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Knowledge you can hold &amp; download
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          A carefully curated collection of books, journals, and digital resources — each crafted to
          help you draw closer to Allah with clarity, beauty, and intention.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<div className="h-12" />}>
          <StoreFilters />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No products match this filter yet. Try a different category.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
