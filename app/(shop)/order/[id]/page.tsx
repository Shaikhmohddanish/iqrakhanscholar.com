import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { CheckCircle2, Clock, XCircle, Download, Package, ArrowRight } from "lucide-react"
import { getCurrentUser } from "@/lib/session"
import { getOrderById } from "@/lib/orders"
import { formatPrice } from "@/lib/product-types"

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false },
}

type Params = Promise<{ id: string }>
type Search = Promise<{ cancelled?: string }>

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Search
}) {
  const { id } = await params
  const { cancelled } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const order = await getOrderById(id, user.id)
  if (!order) notFound()

  // Reflect the real payment state: paid (confirmed), pending (awaiting the
  // gateway webhook), or cancelled/failed.
  const isPaid = order.paymentStatus === "paid"
  const isCancelled = !isPaid && (cancelled === "1" || order.paymentStatus === "failed")
  const statusUi = isPaid
    ? {
        icon: CheckCircle2,
        tone: "bg-primary/10 text-primary",
        heading: `Thank you, ${user.name.split(" ")[0]}`,
        body: `Your order has been confirmed. A receipt has been sent to ${order.email}.`,
      }
    : isCancelled
      ? {
          icon: XCircle,
          tone: "bg-destructive/10 text-destructive",
          heading: "Payment not completed",
          body: "Your payment was cancelled or didn't go through. You can retry checkout any time - nothing was charged.",
        }
      : {
          icon: Clock,
          tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          heading: "Payment processing",
          body: `We're waiting for your payment to be confirmed. This page will update once it's complete, and a receipt will be sent to ${order.email}.`,
        }
  const StatusIcon = statusUi.icon

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className={`flex size-16 items-center justify-center rounded-full ${statusUi.tone}`}>
          <StatusIcon className="size-8" />
        </div>
        <h1 className="mt-6 text-balance font-heading text-3xl font-semibold text-foreground">
          {statusUi.heading}
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground">{statusUi.body}</p>
        <p className="mt-1 text-sm font-medium text-primary">Order {order.reference}</p>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{item.title}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.type === "digital" ? "Digital download" : `Physical · Qty ${item.quantity}`}
                </p>
              </div>
              {item.type === "digital" && isPaid ? (
                <Link
                  href="/account/library"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Download className="size-4" /> Access
                </Link>
              ) : (
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(item.price * item.quantity, order.currency)}
                </span>
              )}
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">{formatPrice(order.subtotal, order.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-foreground">{order.shipping === 0 ? "Free" : formatPrice(order.shipping, order.currency)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <dt className="font-heading text-base font-semibold text-foreground">{isPaid ? "Total paid" : "Total"}</dt>
            <dd className="font-heading text-base font-semibold text-foreground">
              {formatPrice(order.total, order.currency)}
            </dd>
          </div>
        </dl>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-6">
          <Package className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Shipping to</p>
            <p className="mt-1 text-muted-foreground">
              {order.shippingAddress.fullName}, {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}, {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/account/orders"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View my orders <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/store"
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
