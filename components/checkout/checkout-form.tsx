"use client"

import { useActionState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Loader2, Lock, ShieldCheck } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/product-types"
import { placeOrderAction, type CheckoutState } from "@/app/actions/checkout"

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1 text-xs text-destructive">{msg}</p>
}

function PayButton({ total }: { total: number }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <Lock className="size-4" />
          Pay {formatPrice(total, "USD")}
        </>
      )}
    </button>
  )
}

export function CheckoutForm({ userEmail }: { userEmail: string }) {
  const { items, subtotal, shipping, total } = useCart()
  const hasPhysical = items.some((i) => i.type === "physical")
  const [state, formAction] = useActionState<CheckoutState, FormData>(placeOrderAction, {})

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Nothing to check out</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
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
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Checkout</h1>

        <section className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">Contact</h2>
          <div className="mt-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
            {userEmail}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Order confirmation and digital downloads are sent here and saved to your account.
          </p>
        </section>

        {hasPhysical && (
          <section className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-foreground">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <input id="fullName" name="fullName" autoComplete="name" className="mt-1.5 input-base" />
                <FieldError msg={state.fieldErrors?.fullName} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="line1" className="text-sm font-medium text-foreground">
                  Address
                </label>
                <input id="line1" name="line1" autoComplete="address-line1" className="mt-1.5 input-base" />
                <FieldError msg={state.fieldErrors?.line1} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="line2" className="text-sm font-medium text-foreground">
                  Apartment, suite, etc. <span className="text-muted-foreground">(optional)</span>
                </label>
                <input id="line2" name="line2" autoComplete="address-line2" className="mt-1.5 input-base" />
              </div>
              <div>
                <label htmlFor="city" className="text-sm font-medium text-foreground">
                  City
                </label>
                <input id="city" name="city" autoComplete="address-level2" className="mt-1.5 input-base" />
                <FieldError msg={state.fieldErrors?.city} />
              </div>
              <div>
                <label htmlFor="state" className="text-sm font-medium text-foreground">
                  State / Region
                </label>
                <input id="state" name="state" autoComplete="address-level1" className="mt-1.5 input-base" />
              </div>
              <div>
                <label htmlFor="postalCode" className="text-sm font-medium text-foreground">
                  Postal code
                </label>
                <input id="postalCode" name="postalCode" autoComplete="postal-code" className="mt-1.5 input-base" />
                <FieldError msg={state.fieldErrors?.postalCode} />
              </div>
              <div>
                <label htmlFor="country" className="text-sm font-medium text-foreground">
                  Country
                </label>
                <input id="country" name="country" autoComplete="country-name" className="mt-1.5 input-base" />
                <FieldError msg={state.fieldErrors?.country} />
              </div>
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">Payment</h2>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-dashed border-primary/40 bg-secondary/50 px-4 py-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              This is a secure simulated checkout for demonstration. No real card is charged. Connect
              Stripe or Razorpay to accept live payments.
            </p>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-heading text-lg font-semibold text-foreground">Order Summary</h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatPrice(item.price * item.quantity, "USD")}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium text-foreground">{formatPrice(subtotal, "USD")}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping, "USD")}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <dt className="font-heading text-base font-semibold text-foreground">Total</dt>
            <dd className="font-heading text-base font-semibold text-foreground">{formatPrice(total, "USD")}</dd>
          </div>
        </dl>

        {state.error && (
          <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
        )}

        <PayButton total={total} />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          By placing this order you agree to our Terms &amp; Refund Policy.
        </p>
      </aside>
    </form>
  )
}
