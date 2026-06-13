import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, BookOpen } from 'lucide-react'

interface LibraryHeroProps {
  book: {
    slug: string
    title: string
    author: string
    coverImage: string
    description: string
    rating: number
    reviews: number
    category: string
  }
}

export function LibraryHero({ book }: LibraryHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border">
      <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-10">
        {/* Book cover */}
        <Link
          href={`/library/${book.slug}`}
          className="group mx-auto w-40 shrink-0 sm:mx-0 sm:w-48"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-[var(--shadow-lg)]">
            <Image
              src={book.coverImage || '/placeholder.svg'}
              alt={book.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="200px"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex flex-col justify-center text-center sm:text-left">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:mx-0 mx-auto">
            <Star className="size-3 fill-current" />
            Featured Book
          </span>

          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {book.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>

          <div className="mt-2 flex items-center gap-1.5 sm:justify-start justify-center">
            <div className="flex items-center gap-0.5 text-accent">
              {Array.from({ length: Math.round(book.rating) }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({book.reviews} reviews)</span>
          </div>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {book.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:justify-start justify-center">
            <Link
              href={`/library/${book.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <BookOpen className="size-4" />
              Read More
            </Link>
            <Link
              href="/library"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Browse All
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
