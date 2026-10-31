"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getCurrentUser, isUserVerified } from "@/lib/session"
import { readCart, clearCartCookie } from "@/lib/cart"
import { buyNowHref, purchasableQuantity } from "@/lib/cart-shared"
import { getActiveCurrency } from "@/lib/currency-server"
import { resolveCartCurrency, cartLineAmount, shippingForCurrency } from "@/lib/currency"
import { getProductsByIds } from "@/lib/products"
import {
  createOrder,
  setOrderProvider,
  getPurchasedProductIds,
  type OrderItem,
  type ShippingAddress,
} from "@/lib/orders"
import { selectProvider } from "@/lib/payments"
import { confirmOrderPaid } from "@/lib/payments/fulfillment"

const shippingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  line1: z.string().min(3, "Please enter your address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().optional(),
  postalCode: z.string().min(2, "Please enter your postal code"),
  country: z.string().min(2, "Please enter your country"),
})

export type CheckoutState = { error?: string; fieldErrors?: Record<string, string> }

export async function placeOrderAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  // Buy Now posts its one product and quantity; otherwise the order is the cart.
  const buyNowId = formData.get("buyNow")
  const buyNow =
    typeof buyNowId === "string" && buyNowId
      ? { productId: buyNowId, quantity: formData.get("qty") as unknown }
      : null

  const user = await getCurrentUser()
  if (!user) {
    const here = buyNow ? buyNowHref(buyNow.productId, Number(buyNow.quantity) || 1) : "/checkout"
    redirect(`/login?next=${encodeURIComponent(here)}`)
  }

  // Require a verified email before any purchase (checked against the DB so a
  // just-verified user isn't blocked by a stale token claim).
  if (!user.emailVerified && !(await isUserVerified(user.id))) {
    return {
      error:
        "Please verify your email address before checking out. Check your inbox, or resend the verification link from your account settings.",
    }
  }

  // What's being bought: the single Buy Now product, or everything in the cart.
  let lines: { productId: string; quantity: unknown }[]
  if (buyNow) {
    lines = [buyNow]
  } else {
    const cart = await readCart()
    if (cart.items.length === 0) {
      return { error: "Your cart is empty." }
    }
    lines = cart.items
  }

  // Re-price against the DB - never trust client-supplied prices.
  const products = await getProductsByIds(lines.map((i) => i.productId))
  const byId = new Map(products.map((p) => [p.id, p]))

  // Derive one currency for the whole order from the visitor's active currency
  // and the products actually being bought (authoritative, ignores client input).
  const activeCurrency = await getActiveCurrency()
  const lineProducts = lines
    .map((i) => byId.get(i.productId))
    .filter((p): p is NonNullable<typeof p> => p != null)
  const currency = resolveCartCurrency(lineProducts, activeCurrency)

  // E-books are bought once. Product pages and Quick View don't know what the
  // visitor owns, so a repeat purchase is stopped here rather than charged.
  const owned = lineProducts.some((p) => p.type === "digital")
    ? new Set(await getPurchasedProductIds(user.id))
    : new Set<string>()

  const items: OrderItem[] = []
  for (const line of lines) {
    const p = byId.get(line.productId)
    if (!p) continue
    if (p.type === "digital" && owned.has(p.id)) {
      return {
        error: `You already own "${p.title}" - it's in your library.${buyNow ? "" : " Please remove it from your cart to continue."}`,
      }
    }
    // The same rules the Buy Now summary used: e-books are always 1, physical
    // items a whole number clamped to stock, and 0 means sold out.
    const quantity = purchasableQuantity(p, line.quantity)
    if (quantity === 0) return { error: `"${p.title}" is now out of stock.` }
    items.push({
      productId: p.id,
      slug: p.slug,
      title: p.title,
      image: p.image,
      price: cartLineAmount(p, currency),
      type: p.type,
      quantity,
    })
  }

  if (items.length === 0) {
    return {
      error: buyNow ? "This item is no longer available." : "None of your cart items are available.",
    }
  }

  const hasPhysical = items.some((i) => i.type === "physical")
  const hasDigital = items.some((i) => i.type === "digital")

  let shippingAddress: ShippingAddress | null = null
  if (hasPhysical) {
    const parsed = shippingSchema.safeParse({
      fullName: formData.get("fullName"),
      line1: formData.get("line1"),
      line2: formData.get("line2") || undefined,
      city: formData.get("city"),
      state: formData.get("state") || undefined,
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
    })
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      return { error: "Please correct the highlighted fields.", fieldErrors }
    }
    shippingAddress = parsed.data
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  // Charge shipping off the re-priced subtotal, not the cart cookie's. The
  // free-shipping threshold has to be judged against the amount we are actually
  // billing - a stale cookie price could otherwise tip an order over the
  // threshold (or under it) and disagree with the total we charge.
  const shipping = hasPhysical ? shippingForCurrency(currency, subtotal) : 0
  const total = subtotal + shipping

  // --- Payment ---
  // Create the order as "pending", hand off to the selected gateway, and only
  // mark it "paid" on a verified webhook (or directly for the simulated path).
  const provider = selectProvider(currency)

  const order = await createOrder({
    userId: user.id,
    email: user.email,
    items,
    subtotal,
    shipping,
    total,
    currency,
    status: "processing",
    paymentStatus: "pending",
    paymentProvider: provider.name,
    shippingAddress,
    hasDigital,
    hasPhysical,
    checkoutSource: buyNow ? "buy-now" : "cart",
  })

  const hdrs = await headers()
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host")
  const proto = hdrs.get("x-forwarded-proto") ?? "https"
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`
  const successUrl = `${origin}/order/${order.id}?placed=1`
  const cancelUrl = `${origin}/order/${order.id}?cancelled=1`

  // No real gateway configured: confirm immediately and land on the order page.
  if (provider.name === "simulated") {
    await confirmOrderPaid(order.reference)
    // A Buy Now order never used the cart, so it mustn't empty it.
    if (!buyNow) await clearCartCookie()
    redirect(`/order/${order.id}?placed=1`)
  }

  let payment
  try {
    payment = await provider.createPayment({
      orderId: order.id,
      reference: order.reference,
      amount: total,
      currency,
      email: user.email,
      description: `Iqra Khan order ${order.reference}`,
      successUrl,
      cancelUrl,
    })
  } catch (err) {
    console.error("Payment initialization failed", err)
    return { error: "We couldn't start the payment. Please try again." }
  }

  await setOrderProvider(order.reference, provider.name, payment.providerRef)
  // The cart is deliberately NOT cleared here. It used to be, which meant a
  // customer whose card was declined at the gateway came back to an empty cart
  // and had to rebuild the whole order - a pure, self-inflicted conversion
  // loss. The cart is cleared once payment actually succeeds, in
  // confirmOrderPaid's callers.
  redirect(payment.redirectUrl)
}
