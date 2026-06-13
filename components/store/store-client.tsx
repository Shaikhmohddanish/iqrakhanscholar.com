'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Eye, ShoppingBag, SlidersHorizontal, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice, type PublicProduct } from '@/lib/product-types'
import { useCart } from '@/components/cart/cart-provider'
import { StoreSearchBar } from './search-bar'
import { StoreSidebar } from './store-sidebar'
import { FilterDrawer } from './filter-drawer'
import { ProductGridToggle } from './product-grid-toggle'
import { WishlistButton } from './wishlist-button'
import { QuickViewModal } from './quick-view-modal'
import { ProductCard } from './product-card'
import { RecentlyViewed } from './recently-viewed'
import { GridSkeleton } from '@/components/ui/grid-skeleton'
import { useInfiniteScroll } from '@/lib/use-infinite-scroll'

const sorts = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
]

interface ProductFacets {
  categories: string[]
  minPrice: number
  maxPrice: number
}

interface StoreClientProps {
  initialItems: PublicProduct[]
  initialHasMore: boolean
  initialTotal: number
  facets: ProductFacets
  wishlistIds?: Set<string>
}

export function StoreClient({
  initialItems,
  initialHasMore,
  initialTotal,
  facets,
  wishlistIds = new Set(),
}: StoreClientProps) {
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([facets.minPrice, facets.maxPrice])
  const [sortBy, setSortBy] = useState('featured')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<PublicProduct | null>(null)

  const apiParams = {
    type: typeFilter || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    minPrice: priceRange[0] !== facets.minPrice ? priceRange[0] : undefined,
    maxPrice: priceRange[1] !== facets.maxPrice ? priceRange[1] : undefined,
    sort: sortBy,
  }

  const { items, hasMore, isLoading, isLoadingMore, error, sentinelRef } =
    useInfiniteScroll<PublicProduct>({
      endpoint: '/api/products',
      params: apiParams,
      pageSize: 8,
      initialItems,
      initialHasMore,
    })

  function clearAll() {
    setTypeFilter('')
    setSelectedCategories([])
    setPriceRange([facets.minPrice, facets.maxPrice])
    setSortBy('featured')
  }

  const filterProps = {
    categories: facets.categories,
    selectedCategories,
    onCategoryChange: setSelectedCategories,
    typeFilter,
    onTypeChange: setTypeFilter,
    priceRange,
    onPriceRangeChange: setPriceRange,
    minPrice: facets.minPrice,
    maxPrice: facets.maxPrice,
    onClearAll: clearAll,
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <StoreSearchBar products={initialItems} className="flex-1 sm:max-w-xs" />

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <ProductGridToggle view={view} onChange={setView} className="hidden sm:flex" />
        </div>
      </div>

      {/* Results count */}
      <p className="mt-4 text-sm text-muted-foreground">
        {isLoading ? 'Loading…' : `${items.length} product${items.length !== 1 ? 's' : ''}`}
      </p>

      {/* Layout */}
      <div className="mt-6 flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <StoreSidebar {...filterProps} />
          </div>
        </div>

        {/* Products */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <GridSkeleton variant="product-grid" count={8} />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                <ShoppingBag className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">No products found</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try adjusting your filters or search query to find what you&apos;re looking for.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Clear Filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => setQuickViewProduct(product)}
                  initialWishlisted={wishlistIds.has(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onQuickView={() => setQuickViewProduct(product)}
                  initialWishlisted={wishlistIds.has(product.id)}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="mt-6">
            {isLoadingMore && (
              <GridSkeleton variant={view === 'grid' ? 'product-grid' : 'product-list'} count={4} />
            )}
            {!hasMore && items.length > 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                All products loaded
              </p>
            )}
            {error && (
              <p className="py-4 text-center text-sm text-destructive">
                {error} — <button type="button" onClick={clearAll} className="underline">retry</button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recently viewed */}
      <RecentlyViewed />

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={items.length}
        {...filterProps}
      />

      {/* Quick view */}
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

// --- Product List Item ---
function ProductListItem({
  product,
  onQuickView,
  initialWishlisted,
}: {
  product: PublicProduct
  onQuickView: () => void
  initialWishlisted: boolean
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const soldOut = product.type === 'physical' && product.stock != null && product.stock <= 0

  function handleAdd() {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="group flex overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm">
      <Link href={`/store/${product.slug}`} className="relative w-32 shrink-0 sm:w-48">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.title}
          fill
          className="object-cover"
          sizes="200px"
        />
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary">{product.category}</p>
            <h3 className="mt-1 font-heading text-base font-semibold text-foreground sm:text-lg">
              <Link href={`/store/${product.slug}`} className="hover:underline underline-offset-4">
                {product.title}
              </Link>
            </h3>
          </div>
          <WishlistButton productId={product.id} initialWishlisted={initialWishlisted} size="sm" />
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-accent">
            {Array.from({ length: product.rating }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground hidden sm:block">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-heading text-lg font-bold text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onQuickView() }}
              className="hidden h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
            >
              <Eye className="size-4" />
              Quick View
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {soldOut ? 'Sold Out' : added ? <><Check className="size-3.5" /></> : <><ShoppingBag className="size-3.5" /> Add</>}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
