"use client"

import { useEffect, useRef } from "react"
import { useCart } from "./cart-provider"

/**
 * Empties the cart once an order is confirmed paid.
 *
 * Checkout used to clear the cart before redirecting to the gateway, which
 * stranded anyone whose card was declined with an empty cart to rebuild. The
 * cart now survives the handoff and is only cleared here, after payment has
 * actually succeeded.
 *
 * It has to happen client-side: cookies can only be modified from a Server
 * Action or Route Handler, never during a Server Component render, and this
 * runs on the order page. `clear()` calls the existing clearCartAction.
 */
export function ClearCartOnSuccess({ paid }: { paid: boolean }) {
  const { items, clear } = useCart()
  const done = useRef(false)

  useEffect(() => {
    if (!paid || done.current || items.length === 0) return
    done.current = true
    clear()
  }, [paid, items.length, clear])

  return null
}
