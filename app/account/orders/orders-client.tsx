"use client"

import { useState } from "react"
import Image from "next/image"
import type { PublicOrder } from "@/lib/order-types"
import { formatPrice } from "@/lib/product-types"
import { OrderDetailDrawer } from "@/components/account/order-detail-drawer"
import { RefundRequestModal } from "@/components/account/refund-request-modal"
import { Eye, RefreshCw, ChevronRight } from "lucide-react"

const statusStyles: Record<string, string> = {
  processing: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  fulfilled: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
}

export function OrdersClient({ orders }: { orders: PublicOrder[] }) {
  const [selected, setSelected] = useState<PublicOrder | null>(null)
  const [refundOrder, setRefundOrder] = useState<PublicOrder | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = orders.filter((o) => {
    const matchesSearch = search === "" || o.reference.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="font-heading text-lg font-semibold text-foreground">No orders yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          When you complete a purchase, your order details will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search by reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 flex-1 min-w-40 rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All statuses</option>
          <option value="processing">Processing</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Items</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No orders match your search.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{order.reference}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.productId} className="relative size-8 overflow-hidden rounded-md border-2 border-background bg-muted">
                          <Image src={item.image || "/placeholder.svg"} alt={item.title} fill sizes="32px" className="object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex size-8 items-center justify-center rounded-md border-2 border-background bg-secondary text-[10px] font-medium text-primary">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[order.status] ?? "bg-muted text-muted-foreground"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelected(order)}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="View details"
                      >
                        <Eye className="size-4" />
                      </button>
                      {order.status === "fulfilled" && (
                        <button
                          type="button"
                          onClick={() => setRefundOrder(order)}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Request refund"
                        >
                          <RefreshCw className="size-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
      <RefundRequestModal order={refundOrder} onClose={() => setRefundOrder(null)} />
    </>
  )
}
