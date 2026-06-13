"use client"

import { useTransition } from "react"
import type { PublicNotification } from "@/lib/notification-types"
import { markNotificationReadAction, deleteNotificationAction } from "@/app/actions/notifications"
import { ShoppingBag, BookOpen, Calendar, Bell, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const typeIcons = {
  order: ShoppingBag,
  library: BookOpen,
  booking: Calendar,
  system: Bell,
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationItem({ notification }: { notification: PublicNotification }) {
  const [pending, startTransition] = useTransition()
  const Icon = typeIcons[notification.type] ?? Bell

  function handleRead() {
    if (notification.read) return
    startTransition(() => markNotificationReadAction(notification.id))
  }

  function handleDelete() {
    startTransition(() => deleteNotificationAction(notification.id))
  }

  const content = (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
        notification.read
          ? "border-border bg-card"
          : "border-primary/20 bg-primary/5",
      )}
    >
      <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", notification.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", notification.read ? "text-foreground" : "text-foreground font-semibold")}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{notification.body}</p>
        <p className="mt-1 text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</p>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.read && (
          <button
            type="button"
            onClick={handleRead}
            disabled={pending}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            title="Mark as read"
          >
            Mark read
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="rounded-md p-1 text-muted-foreground hover:text-destructive"
          aria-label="Delete notification"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={handleRead} className="block">
        {content}
      </Link>
    )
  }

  return <div onClick={handleRead}>{content}</div>
}
