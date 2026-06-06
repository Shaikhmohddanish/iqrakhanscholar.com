import "server-only"
import { cookies } from "next/headers"
import type { ProductType } from "./product-types"

export const CART_COOKIE = "ik_cart"

export interface CartItem {
  productId: string
  slug: string
  title: string
  image: string
  // unit price in integer cents
  price: number
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
    // basic shape validation
    const items = parsed.items.filter(
      (i) =>
        typeof i.productId === "string" &&
        typeof i.price === "number" &&
        typeof i.quantity === "number" &&
        i.quantity > 0,
    )
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

// Flat-rate shipping if the cart contains any physical item.
export function cartShipping(cart: Cart): number {
  const hasPhysical = cart.items.some((i) => i.type === "physical")
  return hasPhysical ? 599 : 0
}

export function cartTotal(cart: Cart): number {
  return cartSubtotal(cart) + cartShipping(cart)
}

export { EMPTY as EMPTY_CART }
