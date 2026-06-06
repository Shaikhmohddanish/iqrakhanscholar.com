import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { formatPrice, type PublicProduct } from "@/lib/products"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

export function StoreProductCard({ product }: { product: PublicProduct }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <Link
        href={`/store/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.image || "/placeholder.svg"}
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
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-primary backdrop-blur">
          {product.type === "digital" ? "Digital" : "Physical"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{product.category}</p>
        <h3 className="mt-1.5 font-heading text-lg font-semibold leading-snug text-foreground">
          <Link href={`/store/${product.slug}`} className="hover:underline underline-offset-4">
            {product.title}
          </Link>
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-accent">
            {Array.from({ length: product.rating }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-heading text-xl font-bold text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  )
}
