import type { Metadata } from "next"
import { getDb } from "@/lib/mongodb"
import { KpiCard } from "@/components/admin/kpi-card"
import { RecentActivity } from "@/components/admin/recent-activity"
import type { PublicOrder } from "@/lib/order-types"
import { LayoutDashboard, ShoppingBag, BookOpen, CalendarClock, Users, TrendingUp } from "lucide-react"
import { formatPrice } from "@/lib/product-types"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false },
}

async function getDashboardStats() {
  const db = await getDb()

  const [
    totalOrders,
    totalUsers,
    totalBookings,
    totalProducts,
    recentOrderDocs,
  ] = await Promise.all([
    db.collection("orders").countDocuments(),
    db.collection("users").countDocuments(),
    db.collection("bookings").countDocuments(),
    db.collection("products").countDocuments(),
    db.collection("orders").find({}).sort({ createdAt: -1 }).limit(8).toArray(),
  ])

  const revDocs = await db.collection("orders").find({ paymentStatus: "paid" }, { projection: { total: 1 } }).toArray()
  const totalRevenue = revDocs.reduce((acc, d) => acc + ((d as { total: number }).total || 0), 0)

  const recentOrders: PublicOrder[] = recentOrderDocs.map((d) => ({
    ...(d as Omit<PublicOrder, "id">),
    id: d._id.toString(),
  }))

  return { totalOrders, totalUsers, totalBookings, totalProducts, totalRevenue, recentOrders }
}

export default async function AdminDashboardPage() {
  const { totalOrders, totalUsers, totalBookings, totalProducts, totalRevenue, recentOrders } =
    await getDashboardStats()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="sm:col-span-2 xl:col-span-2">
          <KpiCard title="Total Revenue" value={formatPrice(totalRevenue, "USD")} icon={TrendingUp} />
        </div>
        <KpiCard title="Orders" value={totalOrders} icon={ShoppingBag} />
        <KpiCard title="Bookings" value={totalBookings} icon={CalendarClock} />
        <KpiCard title="Users" value={totalUsers} icon={Users} />
        <KpiCard title="Products" value={totalProducts} icon={BookOpen} />
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">Recent orders</h2>
          <a href="/admin/orders" className="text-sm font-medium text-primary hover:underline">View all</a>
        </div>
        <div className="px-5">
          <RecentActivity orders={recentOrders} />
        </div>
      </div>
    </div>
  )
}
