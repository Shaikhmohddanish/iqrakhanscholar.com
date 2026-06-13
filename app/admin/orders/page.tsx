import type { Metadata } from "next"
import { getDb } from "@/lib/mongodb"
import type { PublicOrder } from "@/lib/order-types"
import { AdminOrdersClient } from "./admin-orders-client"

export const metadata: Metadata = {
  title: "Orders — Admin",
  robots: { index: false },
}

export default async function AdminOrdersPage() {
  const db = await getDb()
  const docs = await db.collection("orders").find({}).sort({ createdAt: -1 }).limit(100).toArray()
  const orders: PublicOrder[] = docs.map((d) => ({
    ...(d as Omit<PublicOrder, "id">),
    id: d._id.toString(),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} orders total</p>
      </div>
      <AdminOrdersClient orders={orders} />
    </div>
  )
}
