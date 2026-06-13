import type { PublicOrder } from "@/lib/order-types"
import { formatPrice } from "@/lib/product-types"

export function RecentActivity({ orders }: { orders: PublicOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-sm text-muted-foreground">
        No recent activity.
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {orders.slice(0, 8).map((order) => (
        <div key={order.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-foreground">{order.reference}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-heading text-sm font-semibold">{formatPrice(order.total, order.currency)}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
              order.status === "fulfilled" ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" :
              order.status === "processing" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" :
              "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300"
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
