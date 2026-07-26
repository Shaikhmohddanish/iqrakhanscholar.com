"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getCurrentUser, isUserVerified } from "@/lib/session"
import { readCart, clearCartCookie, cartShipping } from "@/lib/cart"
import { getActiveCurrency } from "@/lib/currency-server"
import { resolveCartCurrency, cartLineAmount } from "@/lib/currency"
import { getProductsByIds } from "@/lib/products"
import { createOrder, setOrderProvider, type OrderItem, type ShippingAddress } from "@/lib/orders"
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
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login?next=/checkout")
  }

  // Require a verified email before any purchase (checked against the DB so a
  // just-verified user isn't blocked by a stale token claim).
  if (!user.emailVerified && !(await isUserVerified(user.id))) {
    return {
      error:
        "Please verify your email address before checking out. Check your inbox, or resend the verification link from your account settings.",
    }
  }

  const cart = await readCart()
  if (cart.items.length === 0) {
    return { error: "Your cart is empty." }
  }

  // Re-price against the DB - never trust client-supplied prices.
  const products = await getProductsByIds(cart.items.map((i) => i.productId))
  const byId = new Map(products.map((p) => [p.id, p]))

  // Derive one currency for the whole order from the visitor's active currency
  // and the products actually in the cart (authoritative, ignores client input).
  const activeCurrency = await getActiveCurrency()
  const cartProducts = cart.items
    .map((i) => byId.get(i.productId))
    .filter((p): p is NonNullable<typeof p> => p != null)
  const currency = resolveCartCurrency(cartProducts, activeCurrency)

  const items: OrderItem[] = []
  for (const item of cart.items) {
    const p = byId.get(item.productId)
    if (!p) continue
    let quantity = p.type === "digital" ? 1 : item.quantity
    if (p.type === "physical" && p.stock != null) {
      if (p.stock <= 0) return { error: `"${p.title}" is now out of stock.` }
      quantity = Math.min(quantity, p.stock)
    }
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

  if (items.length === 0) return { error: "None of your cart items are available." }

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
  const shipping = cartShipping(cart, currency)
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
    await clearCartCookie()
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
  await clearCartCookie()
  redirect(payment.redirectUrl)
}
