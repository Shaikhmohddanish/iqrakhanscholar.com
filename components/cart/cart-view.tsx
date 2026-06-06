"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "./cart-provider"
import { formatPrice } from "@/lib/product-types"

export function CartView() {
  const { items, subtotal, shipping, total, setQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <ShoppingBag className="size-7" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Explore the store to find books, journals, and digital resources to enrich your journey.
        </p>
        <Link
          href="/store"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse the Store
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Your Cart</h1>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-5">
              <Link
                href={`/store/${item.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted"
              >
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/store/${item.slug}`}
                      className="font-heading text-base font-semibold text-foreground hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                      {item.type === "digital" ? "Digital download" : "Physical item"}
                    </p>
                  </div>
                  <span className="font-heading text-base font-semibold text-foreground">
                    {formatPrice(item.price * item.quantity, "USD")}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  {item.type === "digital" ? (
                    <span className="text-sm text-muted-foreground">Qty 1</span>
                  ) : (
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/store" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          Continue shopping
        </Link>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-heading text-lg font-semibold text-foreground">Order Summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium text-foreground">{formatPrice(subtotal, "USD")}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium text-foreground">
              {shipping === 0 ? "Free" : formatPrice(shipping, "USD")}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <dt className="font-heading text-base font-semibold text-foreground">Total</dt>
            <dd className="font-heading text-base font-semibold text-foreground">{formatPrice(total, "USD")}</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Proceed to Checkout
          <ArrowRight className="size-4" />
        </Link>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Secure checkout · Digital items delivered instantly
        </p>
      </aside>
    </div>
  )
}
