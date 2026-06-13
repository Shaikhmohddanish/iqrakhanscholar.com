import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'

type Post = {
  title: string
  category: string
  readTime: string
  excerpt: string
  image: string
}

interface ArticleCardProps {
  post: Post
  featured?: boolean
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${toSlug(post.title)}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-md)]"
      >
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="aspect-[16/9] bg-arabesque lg:aspect-auto" />
          <div className="flex flex-col justify-center p-8">
            <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              Featured
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${toSlug(post.title)}`}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-md)]"
    >
      <div className="aspect-[16/10] bg-muted" />
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
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
          Read more <ArrowRight className="ml-1 size-3.5" />
        </span>
      </div>
    </Link>
  )
}
