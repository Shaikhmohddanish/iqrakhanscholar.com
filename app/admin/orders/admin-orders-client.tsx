"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import type { PublicOrder, OrderStatus } from "@/lib/order-types"
import { formatPrice } from "@/lib/product-types"
import { updateOrderStatusAction, processRefundAction } from "@/app/actions/admin/orders"
import { OrderDetailDrawer } from "@/components/account/order-detail-drawer"
import { Eye, RefreshCw, Search } from "lucide-react"

const STATUS_OPTIONS: OrderStatus[] = ["processing", "fulfilled", "cancelled"]

const statusStyles: Record<string, string> = {
  processing: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  fulfilled: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
}

export function AdminOrdersClient({ orders }: { orders: PublicOrder[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<PublicOrder | null>(null)
  const [pending, startTransition] = useTransition()

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.reference.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  function handleStatusChange(id: string, status: OrderStatus) {
    startTransition(() => updateOrderStatusAction(id, status))
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by reference or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No orders found.</td></tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{order.reference}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{order.email}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.total, order.currency)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      disabled={pending}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize border-0 focus:outline-none cursor-pointer ${statusStyles[order.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(order)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
    </>
  )
}
