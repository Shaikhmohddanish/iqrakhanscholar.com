import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowRight, Clock } from 'lucide-react'
import { queryProducts } from '@/lib/products'
import { getPublishedArticles, toBlogListItem } from '@/lib/blog'
import { getCurrentUser } from '@/lib/session'
import { getWishlist } from '@/lib/wishlist'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SearchProductGrid } from '@/components/search/search-product-grid'

const PRODUCT_LIMIT = 12
const ARTICLE_LIMIT = 6

export const metadata: Metadata = {
  title: 'Search',
  // Search results pages shouldn't be indexed.
  robots: { index: false, follow: true },
}

function SearchForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/search" role="search" className="relative mt-6 max-w-xl">
      <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus
        placeholder="Search books, products, articles..."
        aria-label="Search"
        className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </form>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: rawQuery } = await searchParams
  const q = rawQuery?.trim() ?? ''

  // No query yet — invite the visitor to search.
  if (!q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Search' }]} />
        <header className="mt-6 max-w-2xl">
          <h1 className="font-heading text-4xl font-semibold text-foreground sm:text-5xl">
            Search
          </h1>
          <p className="mt-3 text-muted-foreground">
            Find books, products, and articles across the site.
          </p>
          <SearchForm />
        </header>
      </div>
    )
  }

  const [products, blog, user] = await Promise.all([
    queryProducts({ q, page: 1, limit: PRODUCT_LIMIT }),
    getPublishedArticles({ q, page: 1, limit: ARTICLE_LIMIT }),
    getCurrentUser(),
  ])
  const wishlistIds = user ? new Set(await getWishlist(user.id)) : new Set<string>()
  const articles = blog.articles.map(toBlogListItem)

  const nothingFound = products.total === 0 && blog.total === 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Search' }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          Search results for{' '}
          <span className="text-primary">&ldquo;{q}&rdquo;</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {products.total + blog.total} result
          {products.total + blog.total !== 1 ? 's' : ''} found
        </p>
        <SearchForm defaultValue={q} />
      </header>

      {nothingFound ? (
        <div className="mt-16 flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">No results found</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t find anything matching &ldquo;{q}&rdquo;. Try a different word or
            browse the{' '}
            <Link href="/store" className="text-primary underline underline-offset-4">
              store
            </Link>{' '}
            and{' '}
            <Link href="/blog" className="text-primary underline underline-offset-4">
              blog
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          {/* ── Products ── */}
          {products.total > 0 && (
            <section>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Products{' '}
                  <span className="text-base font-normal text-muted-foreground">
                    ({products.total})
                  </span>
                </h2>
                {products.hasMore && (
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    See all in store <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
              <div className="mt-6">
                <SearchProductGrid products={products.items} wishlistIds={wishlistIds} />
              </div>
            </section>
          )}

          {/* ── Articles ── */}
          {blog.total > 0 && (
            <section>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Articles{' '}
                  <span className="text-base font-normal text-muted-foreground">
                    ({blog.total})
                  </span>
                </h2>
                {blog.total > articles.length && (
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    See all articles <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <Image
                        src={post.image || '/placeholder.svg'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="size-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="mt-3 line-clamp-2 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
