import Image from 'next/image'
import { Star, ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/site-data'

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {product.category}
        </p>
        <h3 className="mt-1.5 font-heading text-lg font-semibold leading-snug text-foreground">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-accent">
            {Array.from({ length: product.rating }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-heading text-xl font-bold text-foreground">
            {product.price}
          </span>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-full bg-secondary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

type Props = {
  id: string
  eyebrow: string
  title: string
  description: string
  products: Product[]
  ctaLabel: string
  variant?: 'default' | 'muted'
}

export function ProductShowcase({
  id,
  eyebrow,
  title,
  description,
  products,
  ctaLabel,
  variant = 'default',
}: Props) {
  return (
    <section
      id={id}
      className={
        variant === 'muted'
          ? 'scroll-mt-20 border-y border-border bg-card'
          : 'scroll-mt-20'
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <a
            href="#"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {ctaLabel}
            <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
