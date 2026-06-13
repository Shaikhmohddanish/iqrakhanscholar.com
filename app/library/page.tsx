import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { LibraryHero } from '@/components/library/library-hero'
import { LibraryClient, type LibraryItem } from './library-client'
import { queryProducts, getProductFacets } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Digital Library — Islamic Books & Guides',
  description:
    'Explore our curated digital library of Islamic books, study guides, and resources. Read in-browser with our immersive PDF reader.',
}

function toLibraryItem(p: { id: string; slug: string; title: string; author?: string; image: string; rating: number; reviews: number; price: number; currency: string; category: string; featured: boolean; }): LibraryItem {
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
    category: p.category,
  }
}

export default async function LibraryPage() {
  const [allResult, facets] = await Promise.all([
    queryProducts({ page: 1, limit: 100, type: 'digital', sort: 'newest' }),
    getProductFacets(),
  ])

  const allBooks = allResult.items
  const categories = [...new Set(allBooks.map((b) => b.category))].sort()

  const featured = allBooks.find((b) => b.featured) ?? allBooks[0]
  const recentlyAdded = [...allBooks].slice(0, 6)
  const popular = [...allBooks].sort((a, b) => b.reviews - a.reviews).slice(0, 6)

  const initial = await queryProducts({ page: 1, limit: 8, type: 'digital' })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Iqra Khan Digital Library',
    description: 'Islamic books and study guides for in-browser reading.',
    numberOfItems: allBooks.length,
    itemListElement: allBooks.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Book',
        name: b.title,
        author: { '@type': 'Person', name: b.author ?? '' },
        url: `https://iqrakhan.com/library/${b.slug}`,
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
              Digital Library
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Islamic books &amp; guides — read in-browser, anytime, anywhere.
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
