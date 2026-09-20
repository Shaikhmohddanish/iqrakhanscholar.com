import { SITE_URL } from '@/lib/site-config'
import { queryProducts, getProductFacets } from '@/lib/products'
import { getCurrentUser } from '@/lib/session'
import { getWishlist } from '@/lib/wishlist'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { StoreClient } from '@/components/store/store-client'

interface StoreCategoryViewProps {
  /** Category to pre-filter by. Omit for the full catalogue. */
  category?: string
  /** Breadcrumb / h1 label. */
  label: string
}

/**
 * Shared body for the store pages: the full catalogue at /store and each
 * category route (/store/abayas, /store/accessories).
 *
 * Categories used to be query params (`/store?category=Accessories`), which
 * meant every category shared one URL, one <title> and one canonical - and the
 * header could never highlight them, because Next's `pathname` has no query
 * string. Real routes fix all of that.
 */
export async function StoreCategoryView({ category, label }: StoreCategoryViewProps) {
  const categories = category ? [category] : undefined

  const [initial, facets, user] = await Promise.all([
    queryProducts({ page: 1, limit: 8, sort: 'featured', categories }),
    getProductFacets(),
    getCurrentUser(),
  ])
  const wishlistIds = user ? new Set(await getWishlist(user.id)) : new Set<string>()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Iqra Khan - ${label}`,
    description: `${label} by Iqra Khan.`,
    numberOfItems: initial.total,
    itemListElement: initial.items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.title,
        url: `${SITE_URL}/store/${p.slug}`,
        image: p.image,
      },
    })),
  }

  // A category route with nothing in it yet is "coming soon", not a failed
  // search - the visitor didn't set a filter, the nav did, so the usual
  // "adjust your filters" empty state reads as a broken page.
  const isEmptyCategory = Boolean(category) && initial.total === 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[{ label }]} />

      {/* The visible header block was removed at the client's request; the page
          still needs a single h1 for SEO/screen readers. */}
      <h1 className="sr-only">{label}</h1>

      {isEmptyCategory ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {label} — coming soon
          </h2>
          <p className="mt-2 max-w-sm text-pretty text-sm text-muted-foreground">
            This collection is being prepared. In the meantime, explore the rest of the
            shop or browse our e-books.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/store"
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse the shop
            </a>
            <a
              href="/library"
              className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              E-books
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <StoreClient
            initialItems={initial.items}
            initialHasMore={initial.hasMore}
            initialTotal={initial.total}
            initialCategories={category ? [category] : []}
            facets={facets}
            wishlistIds={wishlistIds}
          />
        </div>
      )}
    </div>
  )
}
