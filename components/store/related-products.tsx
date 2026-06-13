import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { formatPrice, type PublicProduct } from '@/lib/product-types'

interface RelatedProductsProps {
  products: PublicProduct[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="font-heading text-2xl font-semibold text-foreground">You may also like</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/store/${product.slug}`}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
          >
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
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">{product.category}</p>
              <h3 className="mt-1 font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {product.title}
              </h3>
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <Star key={i} className="size-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <p className="mt-2 font-heading text-lg font-bold text-foreground">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
