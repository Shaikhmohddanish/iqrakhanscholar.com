"use client"

import Image from "next/image"
import type { PublicOrder } from "@/lib/order-types"
import { formatPrice } from "@/lib/product-types"
import { X, Package, MapPin, CreditCard } from "lucide-react"

interface OrderDetailDrawerProps {
  order: PublicOrder | null
  onClose: () => void
}

const statusStyles: Record<string, string> = {
  processing: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  fulfilled: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30",
  cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
}

export function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
  if (!order) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-border bg-background shadow-2xl"
        role="dialog"
        aria-label={`Order ${order.reference}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">{order.reference}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Status */}
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[order.status] ?? "bg-muted text-muted-foreground border-border"}`}>
            {order.status}
          </span>

          {/* Items */}
          <section className="mt-5">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Package className="size-3.5" /> Items
            </p>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{formatPrice(item.price, order.currency)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping address */}
          {order.shippingAddress && (
            <section className="mt-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin className="size-3.5" /> Shipping to
              </p>
              <div className="text-sm text-foreground">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
                <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </section>
          )}

          {/* Payment summary */}
          <section className="mt-5">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <CreditCard className="size-3.5" /> Payment
            </p>
            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal, order.currency)}</span>
              </div>
              {order.shipping > 0 && (
                <div className="flex justify-between text-muted-foreground mt-1.5">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping, order.currency)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-foreground">
                <span>Total</span>
                <span>{formatPrice(order.total, order.currency)}</span>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}
