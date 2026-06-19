import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser, isUserVerified } from "@/lib/session"
import { getOrdersByUser, getPurchasedProductIds } from "@/lib/orders"
import { getBookingsByUser } from "@/lib/bookings"
import { getWishlist } from "@/lib/wishlist"
import { getAllProgress } from "@/lib/reading-progress"
import { getProductsByIds } from "@/lib/products"
import { listNotifications } from "@/lib/notifications"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VerifyEmailBanner } from "@/components/account/verify-email-banner"
import {
  BookMarked,
  ShoppingBag,
  CalendarClock,
  TriangleAlert,
  ArrowRight,
  Heart,
  BookOpen,
  Clock,
} from "lucide-react"
import { formatPrice } from "@/lib/product-types"

export const metadata: Metadata = {
  title: "Account overview",
  robots: { index: false },
}

const statusStyles: Record<string, string> = {
  processing: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  fulfilled: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
}

export default async function AccountOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams])
  if (!user) return null

  // Claim can be stale right after verifying; confirm against the DB.
  const emailVerified = user.emailVerified || (await isUserVerified(user.id))

  const [orders, purchasedIds, bookings, wishlistIds, allProgress] = await Promise.all([
    getOrdersByUser(user.id),
    getPurchasedProductIds(user.id),
    getBookingsByUser(user.id),
    getWishlist(user.id),
    getAllProgress(user.id),
  ])

  const wishlistProducts = await getProductsByIds(wishlistIds.slice(0, 3))
  // Progress docs are keyed by the slug (the reader route param), not the Mongo ObjectId
  const progressMap = Object.fromEntries(allProgress.map((p) => [p.bookId, p]))
  const purchasedProducts = await getProductsByIds(purchasedIds.slice(0, 3))

  const upcomingBookings = bookings.filter(
    (b) => !["cancelled", "completed"].includes(b.status),
  ).slice(0, 3)

  const recentOrders = orders.slice(0, 3)

  const STATS = [
    { label: "Books in library", value: purchasedIds.length, icon: BookMarked, href: "/account/library" },
    { label: "Orders placed", value: orders.length, icon: ShoppingBag, href: "/account/orders" },
    { label: "Upcoming sessions", value: upcomingBookings.length, icon: CalendarClock, href: "/account/bookings" },
    { label: "Wishlist items", value: wishlistIds.length, icon: Heart, href: "/account/wishlist" },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          {user.name.split(" ")[0]}
          <Badge variant="secondary" className="ml-3 align-middle capitalize">
            {user.role}
          </Badge>
        </h1>
      </div>

      {/* Alerts */}
      {params.denied && (
        <Alert variant="destructive">
          <TriangleAlert className="size-4" />
          <AlertTitle>Access restricted</AlertTitle>
          <AlertDescription>You don&apos;t have permission to view that area.</AlertDescription>
        </Alert>
      )}
      {!emailVerified && <VerifyEmailBanner email={user.email} />}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-4 py-5">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-heading text-2xl font-semibold leading-none text-foreground">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reading progress */}
        {purchasedProducts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">Reading progress</CardTitle>
              <Link href="/account/library" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {purchasedProducts.map((product) => {
                const prog = progressMap[product.slug]
                const pct = prog?.percentComplete ?? 0
                return (
                  <Link key={product.id} href={`/reader/${product.slug}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={product.image || "/placeholder.svg"} alt={product.title} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="size-3" />
                      {pct}%
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">Recent orders</CardTitle>
              <Link href="/account/orders" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href="/account/orders" className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-semibold">{formatPrice(order.total, order.currency)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[order.status] ?? "bg-muted text-muted-foreground"}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upcoming consultations */}
        {upcomingBookings.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">Upcoming consultations</CardTitle>
              <Link href="/account/bookings" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-start gap-3 rounded-lg p-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <CalendarClock className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{booking.sessionType.charAt(0).toUpperCase() + booking.sessionType.slice(1)} session</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {booking.date} at {booking.slot}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Wishlist preview */}
        {wishlistProducts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">Wishlist</CardTitle>
              <Link href="/account/wishlist" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex gap-3">
              {wishlistProducts.map((product) => (
                <Link key={product.id} href={`/store/${product.slug}`} className="flex flex-col gap-1">
                  <div className="relative size-20 overflow-hidden rounded-lg bg-muted">
                    <Image src={product.image || "/placeholder.svg"} alt={product.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-[80px]">{product.title}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Browse the store", href: "/store", description: "Digital books, journals, and resources." },
            { label: "Book a consultation", href: "/account/bookings", description: "Private one-to-one guidance." },
            { label: "Open my library", href: "/account/library", description: "Read your purchased books." },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <span className="flex items-center justify-between text-sm font-medium text-foreground">
                {link.label}
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-sm text-muted-foreground">{link.description}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
