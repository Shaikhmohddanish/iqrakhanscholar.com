import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { getCurrentUser } from "@/lib/session"
import { getOrdersByUser } from "@/lib/orders"
import { formatPrice } from "@/lib/product-types"
import { PageHeading, ComingSoon } from "@/components/account/coming-soon"

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false },
}

const statusStyles: Record<string, string> = {
  processing: "bg-accent/15 text-accent-foreground",
  fulfilled: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
}

export default async function OrdersPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const orders = await getOrdersByUser(user.id)

  return (
    <div>
      <PageHeading
        title="Orders"
        description="Track your purchases, download invoices, and review your order history."
      />

      {orders.length === 0 ? (
        <ComingSoon
          icon={<ShoppingBag className="size-6" />}
          message="No orders yet. When you complete a purchase, your order details and receipts will be listed here."
        />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/order/${order.id}`}
                className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-base font-semibold text-foreground">{order.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[order.status] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 4).map((item) => (
                      <div
                        key={item.productId}
                        className="relative size-12 overflow-hidden rounded-lg border-2 border-card bg-muted"
                      >
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" sizes="48px" />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex size-12 items-center justify-center rounded-lg border-2 border-card bg-secondary text-xs font-medium text-primary">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-base font-semibold text-foreground">
                      {formatPrice(order.total, order.currency)}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
