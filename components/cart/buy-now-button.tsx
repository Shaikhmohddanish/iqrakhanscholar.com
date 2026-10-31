import Link from "next/link"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { buyNowHref } from "@/lib/cart-shared"
import type { PublicProduct } from "@/lib/product-types"

interface Props {
  product: PublicProduct
  quantity?: number
  className?: string
}

/**
 * Straight to checkout with just this product. Unlike Add to Cart it never
 * touches the cart, so whatever is already in it is still there afterwards.
 *
 * A plain link with no hooks, so it renders from server and client components
 * alike and keeps the prerendered store pages static. Not prefetched: checkout
 * is per-visitor, so there is nothing worth warming.
 */
export function BuyNowButton({ product, quantity = 1, className }: Props) {
  const soldOut = product.type === "physical" && product.stock != null && product.stock <= 0
  if (soldOut) return null

  return (
    <Link
      href={buyNowHref(product.id, quantity)}
      prefetch={false}
      aria-label={`Buy ${product.title} now`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
        className,
      )}
    >
      <Zap className="size-4" />
      Buy Now
    </Link>
  )
}
