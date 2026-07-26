import "server-only"
import { cookies } from "next/headers"
import type { ProductType } from "./product-types"
import { DEFAULT_CURRENCY, shippingForCurrency } from "./currency"

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

const EMPTY: Cart = { items: [] }

// Read the cart from the cookie. Tolerant of malformed data.
export async function readCart(): Promise<Cart> {
  const store = await cookies()
  const raw = store.get(CART_COOKIE)?.value
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

export async function writeCart(cart: Cart): Promise<void> {
  const store = await cookies()
  store.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearCartCookie(): Promise<void> {
  const store = await cookies()
  store.delete(CART_COOKIE)
}

export function cartCount(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartSubtotal(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

// Flat-rate shipping (in the given currency) if the cart contains a physical item.
export function cartShipping(cart: Cart, currency: string = DEFAULT_CURRENCY): number {
  const hasPhysical = cart.items.some((i) => i.type === "physical")
  return hasPhysical ? shippingForCurrency(currency) : 0
}

export function cartTotal(cart: Cart, currency: string = DEFAULT_CURRENCY): number {
  return cartSubtotal(cart) + cartShipping(cart, currency)
}

export { EMPTY as EMPTY_CART }
