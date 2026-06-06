"use client"

import { createContext, useContext, useOptimistic, useTransition, useCallback } from "react"
import type { CartItem } from "@/lib/cart"
import type { PublicProduct } from "@/lib/product-types"
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
  subtotal: number
  shipping: number
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
  initialItems: CartItem[]
  children: React.ReactNode
}) {
  const [optimisticItems, applyOptimistic] = useOptimistic(initialItems, reducer)
  const [isPending, startTransition] = useTransition()

  const addItem = useCallback((product: PublicProduct, quantity = 1) => {
    startTransition(async () => {
      applyOptimistic({ kind: "add", product, quantity })
      await addToCartAction(product.id, quantity)
    })
  }, [applyOptimistic])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    startTransition(async () => {
      applyOptimistic({ kind: "set", productId, quantity })
      await updateQuantityAction(productId, quantity)
    })
  }, [applyOptimistic])

  const removeItem = useCallback((productId: string) => {
    startTransition(async () => {
      applyOptimistic({ kind: "remove", productId })
      await removeFromCartAction(productId)
    })
  }, [applyOptimistic])

  const clear = useCallback(() => {
    startTransition(async () => {
      applyOptimistic({ kind: "clear" })
      await clearCartAction()
    })
  }, [applyOptimistic])

  const count = optimisticItems.reduce((s, i) => s + i.quantity, 0)
  const subtotal = optimisticItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = optimisticItems.some((i) => i.type === "physical") ? 599 : 0
  const total = subtotal + shipping

  return (
    <CartContext.Provider
      value={{
        items: optimisticItems,
        count,
        subtotal,
        shipping,
        total,
        isPending,
        addItem,
        setQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
