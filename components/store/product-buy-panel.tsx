"use client"

import { useState } from "react"
import { Minus, Plus, Check, ShoppingBag, Truck, Download } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice, type PublicProduct } from "@/lib/product-types"

export function ProductBuyPanel({ product }: { product: PublicProduct }) {
  const { addItem, isPending } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const isDigital = product.type === "digital"
  const soldOut = product.type === "physical" && product.stock != null && product.stock <= 0
  const maxQty = product.type === "physical" && product.stock != null ? product.stock : 99

  function add() {
    if (soldOut) return
    addItem(product, isDigital ? 1 : qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline gap-3">
        <span className="font-heading text-3xl font-bold text-foreground">
          {formatPrice(product.price, product.currency)}
        </span>
        <span className="text-sm text-muted-foreground">
          {isDigital ? "Instant digital download" : "Physical item · ships worldwide"}
        </span>
      </div>

      {!isDigital && product.stock != null && (
        <p className="mt-2 text-sm font-medium text-primary">
          {soldOut ? "Out of stock" : `${product.stock} in stock`}
        </p>
      )}

      {!isDigital && !soldOut && (
        <div className="mt-5 flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Quantity</span>
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex size-10 items-center justify-center rounded-full text-foreground hover:bg-secondary"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              aria-label="Increase quantity"
              className="flex size-10 items-center justify-center rounded-full text-foreground hover:bg-secondary"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={add}
        disabled={soldOut}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        {soldOut ? (
          "Sold Out"
        ) : isPending && !added ? (
          <BarLoader size="md" />
        ) : added ? (
          <>
            <Check className="size-4" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" /> Add to Cart
          </>
        )}
      </button>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        {isDigital ? <Download className="size-4 text-primary" /> : <Truck className="size-4 text-primary" />}
        <span>
          {isDigital
            ? "Delivered to your account & inbox immediately after purchase."
            : "Free returns within 14 days. Tracked worldwide shipping."}
        </span>
      </div>
    </div>
  )
}
