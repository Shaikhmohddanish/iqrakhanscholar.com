import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { blogPosts } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

export function BlogHub() {
  return (
    <section id="blog" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Knowledge Hub
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              Articles to grow your faith
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              In-depth, sincere writing on worship, family, and living
              beautifully as a Muslim woman.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View all articles
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.title} delay={i * 80}>
            <article
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <Link href="/blog" className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image || '/placeholder.svg'}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                  {post.category}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
                  <Link href="/blog" className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {post.readTime}
                  </span>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    Read
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
