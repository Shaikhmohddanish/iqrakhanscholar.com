"use client"

import { useState, useTransition } from "react"
import type { PublicBooking } from "@/lib/booking-types"
import { SESSION_TYPES } from "@/lib/booking-types"
import { cancelBookingAction } from "@/app/actions/bookings"
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface MyBookingsListProps {
  bookings: PublicBooking[]
}

const statusConfig = {
  pending: { label: "Pending", icon: AlertCircle, color: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-500/15" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/15" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-primary bg-primary/10" },
  rescheduled: { label: "Rescheduled", icon: RefreshCw, color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/15" },
}

function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
}

export function MyBookingsList({ bookings }: MyBookingsListProps) {
  const [optimistic, setOptimistic] = useState<Record<string, string>>({})
  const [pending, startTransition] = useTransition()

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center">
        <Calendar className="mx-auto mb-3 size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No bookings yet.</p>
      </div>
    )
  }

  function handleCancel(id: string) {
    startTransition(async () => {
      setOptimistic((s) => ({ ...s, [id]: "cancelled" }))
      await cancelBookingAction(id)
    })
  }

  const upcoming = bookings.filter(
    (b) => !["cancelled", "completed"].includes(optimistic[b.id] ?? b.status),
  )
  const past = bookings.filter((b) =>
    ["cancelled", "completed"].includes(optimistic[b.id] ?? b.status),
  )

  return (
    <div className="flex flex-col gap-6">
      {upcoming.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upcoming
          </p>
          <div className="flex flex-col gap-3">
            {upcoming.map((b) => <BookingCard key={b.id} booking={b} onCancel={handleCancel} pending={pending} />)}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Past
          </p>
          <div className="flex flex-col gap-3">
            {past.map((b) => <BookingCard key={b.id} booking={b} onCancel={handleCancel} pending={pending} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function BookingCard({
  booking,
  onCancel,
  pending,
}: {
  booking: PublicBooking
  onCancel: (id: string) => void
  pending: boolean
}) {
  const session = SESSION_TYPES.find((s) => s.id === booking.sessionType)
  const statusCfg = statusConfig[booking.status] ?? statusConfig.pending
  const StatusIcon = statusCfg.icon
  const canCancel = ["pending", "confirmed"].includes(booking.status)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-heading text-base font-semibold text-foreground">
            {session?.title ?? booking.sessionType}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{booking.topic}</p>
        </div>
        <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", statusCfg.color)}>
          <StatusIcon className="size-3.5" />
          {statusCfg.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {formatDateLong(booking.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {formatSlot(booking.slot)}
        </span>
      </div>

      {canCancel && (
        <div className="mt-4 border-t border-border pt-4">
          <button
            type="button"
            disabled={pending}
            onClick={() => onCancel(booking.id)}
            className="text-sm font-medium text-destructive transition-colors hover:text-destructive/80 disabled:opacity-50"
          >
            Cancel booking
          </button>
        </div>
      )}
    </div>
  )
}
