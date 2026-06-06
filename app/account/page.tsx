import type { Metadata } from "next"
import Link from "next/link"
import { getCurrentUser } from "@/lib/session"
import { getOrdersByUser, getPurchasedProductIds } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BookMarked,
  ShoppingBag,
  CalendarClock,
  MailWarning,
  TriangleAlert,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Account overview",
  robots: { index: false },
}

const QUICK_LINKS = [
  { label: "Browse the store", href: "/", description: "Digital books, journals, and resources." },
  { label: "Book a consultation", href: "/account/bookings", description: "Private one-to-one guidance." },
  { label: "Open my library", href: "/account/library", description: "Read your purchased books." },
]

export default async function AccountOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams])
  if (!user) return null

  const [orders, purchasedIds] = await Promise.all([
    getOrdersByUser(user.id),
    getPurchasedProductIds(user.id),
  ])

  const STATS = [
    { label: "Books in library", value: String(purchasedIds.length), icon: BookMarked, href: "/account/library" },
    { label: "Orders placed", value: String(orders.length), icon: ShoppingBag, href: "/account/orders" },
    { label: "Upcoming sessions", value: "0", icon: CalendarClock, href: "/account/bookings" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          {user.name.split(" ")[0]}
          <Badge variant="secondary" className="ml-3 align-middle capitalize">
            {user.role}
          </Badge>
        </h1>
      </div>

      {params.denied ? (
        <Alert variant="destructive">
          <TriangleAlert className="size-4" />
          <AlertTitle>Access restricted</AlertTitle>
          <AlertDescription>
            You don&apos;t have permission to view that area.
          </AlertDescription>
        </Alert>
      ) : null}

      {!user.emailVerified ? (
        <Alert className="border-accent/40 bg-accent/10">
          <MailWarning className="size-4" />
          <AlertTitle>Verify your email address</AlertTitle>
          <AlertDescription>
            We sent a verification link to {user.email}. Please confirm to unlock all features.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
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
                    <p className="font-heading text-2xl font-semibold leading-none text-foreground">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => (
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
