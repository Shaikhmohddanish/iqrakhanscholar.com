import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { LibraryHero } from '@/components/library/library-hero'
import { LibraryClient, type LibraryItem } from './library-client'
import { queryProducts, getProductFacets } from '@/lib/products'
import { SITE_URL } from '@/lib/site-config'

// This page reads the catalogue but no longer reads cookies, so Next will
// prerender it. Without a revalidate window that prerender happens once at
// build time and a new or edited book would never appear until the next
// deploy. One hour matches the homepage and blog.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'E-books - Islamic Books & Guides',
  description:
    'Explore our curated digital library of Islamic books, study guides, and resources. Read in-browser with our immersive PDF reader.',
  alternates: { canonical: '/library' },
  openGraph: {
    title: 'E-books - Islamic Books & Guides | Iqra Khan',
    description:
      'A curated digital library of Islamic books, study guides, and resources, read in-browser.',
    url: '/library',
  },
}

function toLibraryItem(p: { id: string; slug: string; title: string; author?: string; image: string; rating: number; reviews: number; price: number; currency: string; prices?: Record<string, number>; category: string; featured: boolean; }): LibraryItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    author: p.author ?? '',
    coverImage: p.image,
    rating: p.rating,
    reviews: p.reviews,
    price: p.price,
    currency: p.currency,
    prices: p.prices,
    category: p.category,
  }
}

export default async function LibraryPage() {
  // `initial` seeds the paginated grid and is sorted by `featured`, so it can't
  // be sliced out of `allResult` (which is sorted by `newest`) - but it has no
  // dependency on the other two either, so all three go in one wave instead of
  // hanging a third round-trip off the end.
  const [allResult, facets, initial] = await Promise.all([
    queryProducts({ page: 1, limit: 100, type: 'digital', sort: 'newest' }),
    getProductFacets(),
    queryProducts({ page: 1, limit: 8, type: 'digital' }),
  ])

  const allBooks = allResult.items
  const categories = [...new Set(allBooks.map((b) => b.category))].sort()

  const featured = allBooks.find((b) => b.featured) ?? allBooks[0]
  const recentlyAdded = [...allBooks].slice(0, 6)
  const popular = [...allBooks].sort((a, b) => b.reviews - a.reviews).slice(0, 6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Iqra Khan E-books',
    description: 'Islamic books and study guides for in-browser reading.',
    numberOfItems: allBooks.length,
    itemListElement: allBooks.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Book',
        name: b.title,
        author: { '@type': 'Person', name: b.author ?? '' },
        url: `${SITE_URL}/library/${b.slug}`,
      },
    })),
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <Breadcrumb items={[{ label: 'Library' }]} />

          <div className="mt-6">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              E-books
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Islamic books &amp; guides - read in-browser, anytime, anywhere.
            </p>
          </div>

          {featured && (
            <div className="mt-8">
              <LibraryHero
                book={{
                  slug: featured.slug,
                  title: featured.title,
                  author: featured.author ?? '',
                  coverImage: featured.image,
                  description: featured.description,
                  rating: featured.rating,
                  reviews: featured.reviews,
                  category: featured.category,
                }}
              />
            </div>
          )}

          <div className="mt-12">
            <LibraryClient
              categories={categories}
              recentlyAdded={recentlyAdded.map(toLibraryItem)}
              popular={popular.map(toLibraryItem)}
              initialItems={initial.items.map(toLibraryItem)}
              initialHasMore={initial.hasMore}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
