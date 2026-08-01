import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import { queryProducts, getProductFacets } from '@/lib/products'
import { getCurrentUser } from '@/lib/session'
import { getWishlist } from '@/lib/wishlist'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { StoreClient } from '@/components/store/store-client'

export const metadata: Metadata = {
  title: 'Abayas - Modest Wear, Books & Digital Resources',
  description:
    'Shop elegant abayas and modest wear, signed hardcover books, premium Islamic journals and planners, plus instant-download ebooks, study guides and resource packs by Iqra Khan.',
  alternates: { canonical: '/store' },
  openGraph: {
    title: 'Abayas - Modest Wear, Books & Digital Resources | Iqra Khan',
    description:
      'Signed hardcover books, premium Islamic journals and planners, plus instant-download ebooks and guides.',
    url: '/store',
  },
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  // `?category=` lets nav links (e.g. Accessories) land on a pre-filtered store.
  const { category } = await searchParams
  const initialCategories = category ? [category] : []

  const [initial, facets, user] = await Promise.all([
    queryProducts({
      page: 1,
      limit: 8,
      sort: 'featured',
      categories: initialCategories.length > 0 ? initialCategories : undefined,
    }),
    getProductFacets(),
    getCurrentUser(),
  ])
  const wishlistIds = user ? new Set(await getWishlist(user.id)) : new Set<string>()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Iqra Khan Abayas & Store',
    description: 'Abayas, Islamic books, journals, and digital resources by Iqra Khan.',
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[{ label: category ?? 'Abayas' }]} />

      {/* The visible header block was removed at the client's request; the page
          still needs a single h1 for SEO/screen readers. */}
      <h1 className="sr-only">{category ?? 'Abayas'}</h1>

      <div className="mt-6">
        <StoreClient
          initialItems={initial.items}
          initialHasMore={initial.hasMore}
          initialTotal={initial.total}
          initialCategories={initialCategories}
          facets={facets}
          wishlistIds={wishlistIds}
        />
      </div>
    </div>
  )
}
