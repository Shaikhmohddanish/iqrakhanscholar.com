import "server-only"
import { cookies } from "next/headers"
import { CART_COOKIE, parseCart, type Cart } from "./cart-shared"

// Types and pure helpers live in ./cart-shared so client components can use
// them too; this module is only the server-side cookie I/O.
export {
  CART_COOKIE,
  EMPTY_CART,
  parseCart,
  cartCount,
  cartSubtotal,
  cartShipping,
  cartTotal,
} from "./cart-shared"
export type { Cart, CartItem } from "./cart-shared"

// Read the cart from the cookie. Tolerant of malformed data.
export async function readCart(): Promise<Cart> {
  const store = await cookies()
  return parseCart(store.get(CART_COOKIE)?.value)
}

export async function writeCart(cart: Cart): Promise<void> {
  const store = await cookies()
  store.set(CART_COOKIE, JSON.stringify(cart), {
    // Readable by the browser so CartProvider can hydrate from it without the
    // root layout having to read cookies (which would force every route to
    // render dynamically). Contains no secrets - just product ids and prices,
    // all of which are re-derived server-side at checkout anyway.
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
