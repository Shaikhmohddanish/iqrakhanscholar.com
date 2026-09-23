"use client"

import {
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  useCallback,
  useMemo,
} from "react"
import { type CartItem, readCartCookieClient } from "@/lib/cart-shared"
import type { PublicProduct } from "@/lib/product-types"
import {
  resolveCartCurrency,
  cartLineAmount,
  shippingForCurrency,
  amountToFreeShipping,
} from "@/lib/currency"
import { useCurrency } from "@/components/currency/currency-provider"
import {
  addToCartAction,
  updateQuantityAction,
  removeFromCartAction,
  clearCartAction,
} from "@/app/actions/cart"

type Action =
  | { kind: "add"; product: PublicProduct; quantity: number }
  | { kind: "set"; productId: string; quantity: number }
  | { kind: "remove"; productId: string }
  | { kind: "clear" }

function reducer(items: CartItem[], action: Action): CartItem[] {
  switch (action.kind) {
    case "add": {
      const { product, quantity } = action
      const existing = items.find((i) => i.productId === product.id)
      if (existing) {
        return items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: product.type === "digital" ? 1 : i.quantity + quantity }
            : i,
        )
      }
      return [
        ...items,
        {
          productId: product.id,
          slug: product.slug,
          title: product.title,
          image: product.image,
          price: product.price,
          currency: product.currency,
          prices: product.prices,
          type: product.type,
          quantity: product.type === "digital" ? 1 : quantity,
        },
      ]
    }
    case "set":
      return items
        .map((i) => (i.productId === action.productId ? { ...i, quantity: action.quantity } : i))
        .filter((i) => i.quantity > 0)
    case "remove":
      return items.filter((i) => i.productId !== action.productId)
    case "clear":
      return []
    default:
      return items
  }
}

interface CartContextValue {
  items: CartItem[]
  count: number
  // currency all amounts below are expressed in
  currency: string
  subtotal: number
  shipping: number
  // minor units still needed to qualify for free shipping, or null
  freeShippingRemaining: number | null
  total: number
  isPending: boolean
  addItem: (product: PublicProduct, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  initialItems,
  children,
}: {
  // Optional: the root layout deliberately does NOT pass this. Reading the cart
  // cookie there opted every route in the app out of static rendering, so the
  // cart hydrates in the browser instead. Pages that already render dynamically
  // may still pass a server-read cart to avoid the one-frame empty state.
  initialItems?: CartItem[]
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>(initialItems ?? [])
  const [optimisticItems, applyOptimistic] = useOptimistic(items, reducer)
  const [isPending, startTransition] = useTransition()
  const { currency: activeCurrency } = useCurrency()

  // Hydrate from the cookie once on mount when the server didn't supply a cart.
  // Server HTML is rendered with an empty cart (it has to be - the page is
  // static and shared by every visitor), so the badge briefly shows nothing
  // before this runs. That is the trade for serving pages from the CDN.
  const hydrated = useRef(initialItems != null)
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const fromCookie = readCartCookieClient().items
    if (fromCookie.length > 0) setItems(fromCookie)
  }, [])

  const addItem = useCallback((product: PublicProduct, quantity = 1) => {
    startTransition(async () => {
      applyOptimistic({ kind: "add", product, quantity })
      // The action returns the reconciled cart so state comes from the server's
      // own reconcile() rather than re-reading the cookie, which would race the
      // Set-Cookie header.
      const res = await addToCartAction(product.id, quantity)
      if (res?.items) setItems(res.items)
    })
  }, [applyOptimistic])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    startTransition(async () => {
      applyOptimistic({ kind: "set", productId, quantity })
      const res = await updateQuantityAction(productId, quantity)
      if (res?.items) setItems(res.items)
    })
  }, [applyOptimistic])

  const removeItem = useCallback((productId: string) => {
    startTransition(async () => {
      applyOptimistic({ kind: "remove", productId })
      const res = await removeFromCartAction(productId)
      if (res?.items) setItems(res.items)
    })
  }, [applyOptimistic])

  const clear = useCallback(() => {
    startTransition(async () => {
      applyOptimistic({ kind: "clear" })
      await clearCartAction()
      setItems([])
    })
  }, [applyOptimistic])

  // Derive cart totals once per items/currency change, not on every render.
  const totals = useMemo(() => {
    const count = optimisticItems.reduce((s, i) => s + i.quantity, 0)
    // Price the whole cart in a single currency so lines never mix currencies.
    const currency = resolveCartCurrency(optimisticItems, activeCurrency)
    const subtotal = optimisticItems.reduce(
      (s, i) => s + cartLineAmount(i, currency) * i.quantity,
      0,
    )
    const hasPhysical = optimisticItems.some((i) => i.type === "physical")
    // Mirrors the authoritative server calculation in placeOrderAction. Both
    // pass the subtotal so the free-shipping threshold is applied identically -
    // if these two ever diverge, the total shown differs from the amount
    // charged.
    const shipping = hasPhysical ? shippingForCurrency(currency, subtotal) : 0
    // How much more to spend to qualify (null when already free, no threshold
    // for this currency, or the cart has nothing to ship).
    const freeShippingRemaining = hasPhysical
      ? amountToFreeShipping(currency, subtotal)
      : null
    return {
      count,
      currency,
      subtotal,
      shipping,
      freeShippingRemaining,
      total: subtotal + shipping,
    }
  }, [optimisticItems, activeCurrency])

  const value = useMemo(
    () => ({
      items: optimisticItems,
      ...totals,
      isPending,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [optimisticItems, totals, isPending, addItem, setQuantity, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
