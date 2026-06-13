import type { Metadata } from "next"
import Link from "next/link"
import { getCurrentUser } from "@/lib/session"
import { listNotifications } from "@/lib/notifications"
import { NotificationItem } from "@/components/account/notification-item"
import { MarkAllReadButton } from "./mark-all-read-button"
import { PageHeading } from "@/components/account/coming-soon"
import { Bell } from "lucide-react"

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false },
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams])
  if (!user) return null

  const typeFilter = params.type as "order" | "booking" | "library" | "system" | undefined
  const notifications = await listNotifications(user.id, { type: typeFilter })
  const unread = notifications.filter((n) => !n.read).length

  const FILTERS = [
    { label: "All", value: undefined },
    { label: "Orders", value: "order" },
    { label: "Bookings", value: "booking" },
    { label: "Library", value: "library" },
    { label: "System", value: "system" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeading
          title="Notifications"
          description={unread > 0 ? `You have ${unread} unread notification${unread > 1 ? "s" : ""}.` : "All caught up!"}
        />
        {unread > 0 && <MarkAllReadButton />}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `?type=${f.value}` : "/account/notifications"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Bell className="size-10 text-muted-foreground/30" />
          <p className="font-heading text-lg font-semibold text-foreground">No notifications</p>
          <p className="text-sm text-muted-foreground">
            {typeFilter ? "No notifications in this category." : "You have no notifications yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  )
}
