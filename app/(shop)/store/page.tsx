import type { Metadata } from 'next'
import { queryProducts, getProductFacets } from '@/lib/products'
import { getCurrentUser } from '@/lib/session'
import { getWishlist } from '@/lib/wishlist'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { StoreClient } from '@/components/store/store-client'

export const metadata: Metadata = {
  title: 'Store - Books, Journals & Digital Resources',
  description:
    'Shop signed hardcover books, premium Islamic journals and planners, plus instant-download ebooks, study guides and resource packs by Iqra Khan.',
  alternates: { canonical: '/store' },
}

export default async function StorePage() {
  const [initial, facets, user] = await Promise.all([
    queryProducts({ page: 1, limit: 8, sort: 'featured' }),
    getProductFacets(),
    getCurrentUser(),
  ])
  const wishlistIds = user ? new Set(await getWishlist(user.id)) : new Set<string>()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Iqra Khan Store',
    description: 'Islamic books, journals, and digital resources by Iqra Khan.',
    numberOfItems: initial.total,
    itemListElement: initial.items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.title,
        url: `https://iqrakhan.com/store/${p.slug}`,
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

      <Breadcrumb items={[{ label: 'Store' }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The Store</p>
        <h1 className="mt-3 text-balance font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Knowledge you can hold &amp; download
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          A carefully curated collection of books, journals, and digital resources - each crafted to
          help you draw closer to Allah with clarity, beauty, and intention.
        </p>
      </header>

      <div className="mt-10">
        <StoreClient
          initialItems={initial.items}
          initialHasMore={initial.hasMore}
          initialTotal={initial.total}
          facets={facets}
          wishlistIds={wishlistIds}
        />
      </div>
    </div>
  )
}
