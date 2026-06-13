import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ShareButtons } from '@/components/blog/share-buttons'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { blogPosts } from '@/lib/site-data'
import { Clock, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find(
    (p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug,
  )
  const title = post?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${title} — Iqra Khan Blog`,
    description: post?.excerpt ?? `Read "${title}" on the Iqra Khan Knowledge Hub.`,
  }
}

const tocHeadings = [
  { id: 'foundation', text: 'Understanding the Foundation', level: 2 as const },
  { id: 'practical-steps', text: 'Practical Steps', level: 2 as const },
  { id: 'community', text: 'The Role of Community', level: 2 as const },
  { id: 'final-thoughts', text: 'Final Thoughts', level: 2 as const },
]

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post =
    blogPosts.find((p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) ??
    blogPosts[0]

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
            {/* Article — 2/3 */}
            <article className="lg:col-span-2">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="mr-1.5 size-4" />
                Back to Blog
              </Link>

              {/* Meta */}
              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 font-medium text-primary">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5" />
                  {post.readTime}
                </span>
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
                  <p className="text-sm font-medium text-foreground">Iqra Khan</p>
                  <p className="text-xs text-muted-foreground">Islamic Scholar & Educator</p>
                </div>
              </div>

              {/* Banner image */}
              <div className="mb-8 mt-8 aspect-[2/1] overflow-hidden rounded-2xl bg-muted" />

              {/* Content */}
              <div className="prose max-w-none">
                <p>
                  In the name of Allah, the Most Gracious, the Most Merciful. This article explores
                  the topic of <strong>{post.title.toLowerCase()}</strong> from a perspective rooted
                  in the Quran and authentic Sunnah.
                </p>

                <h2 id="foundation">Understanding the Foundation</h2>
                <p>
                  Before we delve into practical advice, it&apos;s important to understand the
                  spiritual foundation that underpins this topic. The Prophet Muhammad ﷺ said,
                  &ldquo;The most beloved deeds to Allah are those done consistently, even if
                  small.&rdquo; This hadith teaches us that consistency in our practice is more
                  valuable than occasional bursts of effort.
                </p>

                <h2 id="practical-steps">Practical Steps</h2>
                <p>
                  Here are some practical, Sunnah-rooted steps you can implement in your daily life:
                </p>
                <ol>
                  <li>Begin with sincere intention (niyyah) — purify your heart before every action.</li>
                  <li>Start small and build gradually — the Sunnah emphasises consistency over quantity.</li>
                  <li>Create a supportive environment — surround yourself with reminders of Allah.</li>
                  <li>Seek knowledge actively — understanding deepens practice.</li>
                  <li>Make dua regularly — ask Allah for steadfastness and guidance.</li>
                </ol>

                <h2 id="community">The Role of Community</h2>
                <p>
                  Islam places tremendous importance on community (ummah). The Prophet ﷺ said,
                  &ldquo;The believer to the believer is like a building, each part supporting the
                  other.&rdquo; Finding a community of like-minded sisters can make a profound
                  difference in your journey.
                </p>

                <blockquote>
                  &ldquo;Verily, in the remembrance of Allah do hearts find rest.&rdquo; — Quran 13:28
                </blockquote>

                <h2 id="final-thoughts">Final Thoughts</h2>
                <p>
                  Remember that your journey is unique and Allah sees every effort you make. Be
                  patient with yourself, trust in His plan, and know that every small step counts.
                  May Allah make your path easy and fill your heart with contentment.
                </p>
              </div>

              {/* Share */}
              <div className="mt-10 border-t border-border pt-6">
                <ShareButtons title={post.title} />
              </div>

              {/* Related articles */}
              <div className="mt-12">
                <h2 className="font-heading text-xl font-bold text-foreground">Related Articles</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {blogPosts
                    .filter((p) => p.title !== post.title)
                    .slice(0, 2)
                    .map((p) => (
                      <Link
                        key={p.title}
                        href={`/blog/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-[var(--shadow-sm)]"
                      >
                        <span className="text-xs font-medium text-primary">{p.category}</span>
                        <h3 className="mt-1 line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                          {p.title}
                        </h3>
                        <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {p.readTime}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </article>

            {/* Sidebar — 1/3 */}
            <div className="space-y-6">
              <TableOfContents headings={tocHeadings} />
              <BlogSidebar currentSlug={slug} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Person', name: 'Iqra Khan', url: 'https://iqrakhan.com/about' },
            publisher: {
              '@type': 'Organization',
              name: 'Iqra Khan',
              url: 'https://iqrakhan.com',
            },
            datePublished: new Date().toISOString(),
            articleSection: post.category,
          }),
        }}
      />
    </>
  )
}
