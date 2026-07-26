import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Clock } from 'lucide-react'
import { getPublishedArticles, getArticleCategories, toBlogListItem } from '@/lib/blog'
import { BlogListClient } from '@/components/blog/blog-list-client'

// Refresh published content hourly (ISR) without a redeploy.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog - Knowledge Hub',
  description:
    'Explore Islamic articles, guides, and reflections on worship, parenting, faith, and more by Iqra Khan.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Blog - Knowledge Hub | Iqra Khan',
    description:
      'Islamic articles, guides, and reflections on worship, parenting, and faith by Iqra Khan.',
    url: '/blog',
    images: [{ url: '/blog-women.webp' }],
  },
}

export default async function BlogPage() {
  const [{ articles, total }, cats] = await Promise.all([
    getPublishedArticles({ page: 1, limit: 9 }),
    getArticleCategories(),
  ])

  const categories = ['All', ...cats]
  const items = articles.map(toBlogListItem)
  const featured = items[0]
  const initialHasMore = items.length < total

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Blog' }]} />

          <div className="mt-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Knowledge Hub
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Articles, reflections, and guides to deepen your faith
            </p>
          </div>

          {/* Featured article - server-rendered */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-10 block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="relative aspect-[16/9] bg-arabesque lg:aspect-auto">
                  {featured.image && (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center p-8">
                  <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                    Featured
                  </span>
                  <h2 className="mt-3 font-heading text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium">
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {featured.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Client-side infinite grid with filters */}
          <BlogListClient
            categories={categories}
            initialItems={items}
            initialHasMore={initialHasMore}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
