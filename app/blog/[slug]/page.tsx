import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ShareButtons } from '@/components/blog/share-buttons'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { getArticleBySlug, getPublishedArticles } from '@/lib/blog'
import { processArticleContent } from '@/lib/article-content'
import { Clock, ArrowLeft } from 'lucide-react'
import { SITE_URL } from '@/lib/site-config'

// Refresh published content hourly (ISR).
export const revalidate = 3600

// Make an absolute URL for JSON-LD/OG (cover images may be local paths or
// already-absolute Cloudinary URLs).
function absUrl(path: string): string {
  if (!path) return ''
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path}`
}

function formatDate(d?: Date | string | null): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateStaticParams() {
  const { articles } = await getPublishedArticles({ limit: 1000 })
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getArticleBySlug(slug)
  if (!post) return { title: 'Article not found' }

  const canonical = `/blog/${post.slug}`
  const images = post.coverImage ? [{ url: post.coverImage }] : undefined
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: canonical,
      images,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: [post.author],
      tags: post.tags,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getArticleBySlug(slug)
  if (!post) notFound()

  const { html, headings, wordCount } = processArticleContent(post.content)

  // Related (same category) + recent (any) articles, excluding the current one.
  const [{ articles: relatedAll }, { articles: recentAll }] = await Promise.all([
    getPublishedArticles({ category: post.category, limit: 4 }),
    getPublishedArticles({ limit: 4 }),
  ])
  const related = relatedAll.filter((p) => p.slug !== post.slug).slice(0, 2)
  const recent = recentAll
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      readTime: `${p.readingTime} min read`,
    }))

  const url = `${SITE_URL}/blog/${post.slug}`
  const published = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString()
  const modified = post.updatedAt ? new Date(post.updatedAt).toISOString() : published

  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [absUrl(post.coverImage)] : undefined,
    datePublished: published,
    dateModified: modified,
    author: { '@type': 'Person', name: post.author, url: `${SITE_URL}/about` },
    publisher: {
      '@type': 'Organization',
      name: 'Iqra Khan',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    wordCount,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            {/* Article - 2/3 */}
            <article className="lg:col-span-2">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="mr-1.5 size-4" />
                Back to Blog
              </Link>

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 font-medium text-primary">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5" />
                  {post.readingTime} min read
                </span>
                {post.publishedAt && (
                  <time
                    dateTime={published}
                    className="text-muted-foreground"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                )}
              </div>

              <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-b border-border pb-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  IK
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">Islamic Scholar & Educator</p>
                </div>
              </div>

              {/* Banner image */}
              {post.coverImage && (
                <div className="relative mb-8 mt-8 aspect-[2/1] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}

              {/* Content (sanitized admin HTML) */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-10 border-t border-border pt-6">
                <ShareButtons title={post.title} url={url} />
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    Related Articles
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-[var(--shadow-sm)]"
                      >
                        <span className="text-xs font-medium text-primary">{p.category}</span>
                        <h3 className="mt-1 line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                          {p.title}
                        </h3>
                        <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {p.readingTime} min read
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar - 1/3 */}
            <div className="space-y-6">
              <TableOfContents headings={headings} />
              <BlogSidebar currentSlug={slug} recentPosts={recent} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  )
}
