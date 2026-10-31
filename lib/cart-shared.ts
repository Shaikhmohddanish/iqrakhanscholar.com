// Client-safe cart types and pure helpers (no server-only imports), so the
// cart cookie can be parsed on either side.
//
// This split exists for performance: reading the cart cookie in the root layout
// opted every route in the app out of static rendering. The provider now
// hydrates from the cookie in the browser instead, which needs the same parsing
// logic the server uses - hence one shared module rather than two copies that
// could drift.

import type { ProductType, PublicProduct } from "./product-types"
import {
  DEFAULT_CURRENCY,
  cartLineAmount,
  shippingForCurrency,
  resolveCartCurrency,
  amountToFreeShipping,
} from "./currency"

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

export interface CartTotals {
  count: number
  // currency all amounts below are expressed in
  currency: string
  subtotal: number
  shipping: number
  // minor units still needed to qualify for free shipping, or null
  freeShippingRemaining: number | null
  total: number
}

// Totals for a set of lines, priced in one currency. CartProvider and the Buy
// Now checkout both use this, and it mirrors the authoritative calculation in
// placeOrderAction - if those ever diverge, the total shown differs from the
// amount charged.
export function computeTotals(items: CartItem[], activeCurrency: string): CartTotals {
  const count = items.reduce((s, i) => s + i.quantity, 0)
  // Price every line in a single currency so lines never mix currencies.
  const currency = resolveCartCurrency(items, activeCurrency)
  const subtotal = items.reduce((s, i) => s + cartLineAmount(i, currency) * i.quantity, 0)
  const hasPhysical = items.some((i) => i.type === "physical")
  // Pass the subtotal so the free-shipping threshold applies exactly as it
  // does when the order is placed.
  const shipping = hasPhysical ? shippingForCurrency(currency, subtotal) : 0
  // How much more to spend to qualify (null when already free, no threshold
  // for this currency, or nothing to ship).
  const freeShippingRemaining = hasPhysical ? amountToFreeShipping(currency, subtotal) : null
  return { count, currency, subtotal, shipping, freeShippingRemaining, total: subtotal + shipping }
}

// Most of one product a line may hold when its stock isn't tracked - the same
// ceiling as the product page's quantity picker.
const MAX_LINE_QUANTITY = 99

// How many of a product an order line may hold: e-books are always 1, physical
// items a whole number clamped to stock. 0 means it can't be bought (sold out).
// The cart checkout and Buy Now share this so their rules can't drift; Buy Now
// passes the raw "qty" from the URL or form, so anything non-numeric becomes 1.
export function purchasableQuantity(
  product: { type: ProductType; stock?: number | null },
  requested: unknown,
): number {
  if (product.type === "digital") return 1
  const n = Math.floor(Number(requested))
  const wanted = Number.isFinite(n) && n >= 1 ? n : 1
  if (product.stock == null) return Math.min(wanted, MAX_LINE_QUANTITY)
  return Math.min(wanted, Math.max(0, product.stock))
}

// A product as a cart line. Its prices travel with it so totals can be shown
// in whichever currency the visitor has active.
export function toCartItem(product: PublicProduct, quantity: number): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    image: product.image,
    price: product.price,
    currency: product.currency,
    prices: product.prices,
    type: product.type,
    quantity,
  }
}

// Buy Now: checkout for just this product. The item travels in the URL, so it
// survives the login redirect and a refresh, and the cart is never touched.
export function buyNowHref(productId: string, quantity: number = 1): string {
  return `/checkout?${new URLSearchParams({ buy: productId, qty: String(quantity) })}`
}
