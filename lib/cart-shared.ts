// Client-safe cart types and pure helpers (no server-only imports), so the
// cart cookie can be parsed on either side.
//
// This split exists for performance: reading the cart cookie in the root layout
// opted every route in the app out of static rendering. The provider now
// hydrates from the cookie in the browser instead, which needs the same parsing
// logic the server uses - hence one shared module rather than two copies that
// could drift.

import type { ProductType } from "./product-types"
import { DEFAULT_CURRENCY, cartLineAmount, shippingForCurrency } from "./currency"

// Not httpOnly (see writeCart), so the browser can read it too.
export const CART_COOKIE = "ik_cart"

export interface CartItem {
  productId: string
  slug: string
  title: string
  image: string
  // base unit price in integer minor units of `currency`
  price: number
  // base currency code for `price` (the fallback)
  currency: string
  // optional manually-entered per-currency amounts (currency code -> minor units)
  prices?: Record<string, number>
  type: ProductType
  quantity: number
}

export interface Cart {
  items: CartItem[]
}

export const EMPTY_CART: Cart = { items: [] }

// Parse a raw cookie value into a cart. Tolerant of malformed data: a bad
// cookie yields an empty cart rather than throwing.
export function parseCart(raw: string | undefined | null): Cart {
  if (!raw) return { items: [] }
  try {
    const parsed = JSON.parse(raw) as Cart
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] }
    // basic shape validation; default currency for carts saved before
    // multi-currency support so resolution helpers always have a base.
    const items = parsed.items
      .filter(
        (i) =>
          typeof i.productId === "string" &&
          typeof i.price === "number" &&
          typeof i.quantity === "number" &&
          i.quantity > 0,
      )
      .map((i) => ({ ...i, currency: i.currency ?? DEFAULT_CURRENCY }))
    return { items }
  } catch {
    return { items: [] }
  }
}

// Read + parse the cart cookie in the browser. Returns an empty cart during
// SSR, where `document` does not exist.
export function readCartCookieClient(): Cart {
  if (typeof document === "undefined") return { items: [] }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CART_COOKIE}=`))
  if (!match) return { items: [] }
  return parseCart(decodeURIComponent(match.slice(CART_COOKIE.length + 1)))
}

export function cartCount(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartSubtotal(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

// Shipping (in the given currency) if the cart contains a physical item. The
// subtotal decides whether the free-shipping threshold applies, and it is
// computed in `currency` - not from the base prices - so the threshold is
// measured against the same amount the customer is actually charged.
export function cartShipping(
  cart: Cart,
  currency: string = DEFAULT_CURRENCY,
): number {
  const hasPhysical = cart.items.some((i) => i.type === "physical")
  if (!hasPhysical) return 0
  const subtotal = cart.items.reduce(
    (sum, i) => sum + cartLineAmount(i, currency) * i.quantity,
    0,
  )
  return shippingForCurrency(currency, subtotal)
}

export function cartTotal(cart: Cart, currency: string = DEFAULT_CURRENCY): number {
  return cartSubtotal(cart) + cartShipping(cart, currency)
}
