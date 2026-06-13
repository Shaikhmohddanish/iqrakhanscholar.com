import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import { getOrdersByUser } from "@/lib/orders"
import { OrdersClient } from "./orders-client"
import { PageHeading } from "@/components/account/coming-soon"

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false },
}

export default async function OrdersPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const orders = await getOrdersByUser(user.id)

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Orders"
        description="Track your purchases, view order details, and request refunds."
      />
      <OrdersClient orders={orders} />
    </div>
  )
}
