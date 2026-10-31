import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser, isUserVerified } from "@/lib/session"
import { getProductsByIds } from "@/lib/products"
import { getPurchasedProductIds } from "@/lib/orders"
import { buyNowHref, purchasableQuantity, toCartItem, type CartItem } from "@/lib/cart-shared"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { VerifyEmailBanner } from "@/components/account/verify-email-banner"

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
}

type Search = Promise<{ buy?: string | string[]; qty?: string | string[] }>

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function CheckoutPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams
  // A Buy Now checkout carries its one product in the URL (see buyNowHref).
  // Without it, this is the normal cart checkout.
  const buy = firstParam(sp.buy) || null
  const qty = firstParam(sp.qty)

  const user = await getCurrentUser()
  // Come back to this exact checkout after signing in - for Buy Now the item
  // exists only in the URL.
  if (!user) {
    const here = buy ? buyNowHref(buy, Number(qty) || 1) : "/checkout"
    redirect(`/login?next=${encodeURIComponent(here)}`)
  }

  // Purchases require a verified email; warn up front (the order action enforces it too).
  const emailVerified = user.emailVerified || (await isUserVerified(user.id))

  let buyNow: CartItem | null = null
  if (buy) {
    const [product] = await getProductsByIds([buy])
    const quantity = product ? purchasableQuantity(product, qty) : 0
    if (!product || quantity === 0) {
      return (
        <CheckoutNotice
          title="This item is no longer available"
          body="It may have sold out or been removed from the store."
          href="/store"
          cta="Browse the Store"
        />
      )
    }
    // An e-book is bought once. The store page and Quick View don't know who
    // owns what, so a second purchase is caught here (and again on submit).
    if (
      product.type === "digital" &&
      (await getPurchasedProductIds(user.id)).includes(product.id)
    ) {
      return (
        <CheckoutNotice
          title="You already own this e-book"
          body={`"${product.title}" is in your library, ready to read.`}
          href={`/reader/${product.slug}`}
          cta="Read now"
        />
      )
    }
    buyNow = toCartItem(product, quantity)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {!emailVerified && (
        <div className="mb-6">
          <VerifyEmailBanner email={user.email} />
        </div>
      )}
      <CheckoutForm userEmail={user.email} buyNow={buyNow} />
    </div>
  )
}

function CheckoutNotice({
  title,
  body,
  href,
  cta,
}: {
  title: string
  body: string
  href: string
  cta: string
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {cta}
      </Link>
    </div>
  )
}
