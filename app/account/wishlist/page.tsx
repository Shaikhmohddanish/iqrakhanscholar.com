import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getCurrentUser } from "@/lib/session"
import { getWishlist } from "@/lib/wishlist"
import { getProductsByIds } from "@/lib/products"
import { formatPrice } from "@/lib/product-types"
import { PageHeading } from "@/components/account/coming-soon"
import { WishlistRemoveButton } from "./wishlist-remove-button"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Heart, ShoppingBag } from "lucide-react"
import type { PublicProduct } from "@/lib/product-types"

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
}

export default async function WishlistPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const productIds = await getWishlist(user.id)
  const products = await getProductsByIds(productIds)

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Wishlist"
        description="Products you have saved for later."
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
          <Heart className="size-10 text-muted-foreground/30" />
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Save products you love by tapping the heart icon in the store.</p>
          </div>
          <Link href="/store" className="mt-2 flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <ShoppingBag className="size-4" />
            Browse the store
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card">
              <Link href={`/store/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    {product.badge}
                  </span>
                )}
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.category}</p>
                  <Link href={`/store/${product.slug}`}>
                    <h3 className="mt-1 font-heading text-base font-semibold leading-snug text-foreground hover:text-primary">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>

                <div className="mt-auto flex gap-2">
                  <AddToCartButton
                    product={product as PublicProduct}
                    label="Add to Cart"
                    className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                  />
                  <WishlistRemoveButton productId={product.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
