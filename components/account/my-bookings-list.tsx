"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { PublicBooking } from "@/lib/booking-types"
import { SESSION_TYPES, LEGACY_SESSION_TITLES, holdLapsed } from "@/lib/booking-types"
import { BOOKING_TZ_LABEL, formatBookingDate, formatSlot, istDateTimeKey } from "@/lib/booking-time"
import { cancelBookingAction, startBookingPaymentAction } from "@/app/actions/bookings"
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface MyBookingsListProps {
  bookings: PublicBooking[]
  // Computed on the server (IST date, epoch ms) so the upcoming/past split and
  // the payment-hold state match between the server HTML and the browser.
  today: string
  now: number
}

const statusConfig = {
  pending: { label: "Pending", icon: AlertCircle, color: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-500/15" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/15" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-primary bg-primary/10" },
  rescheduled: { label: "Rescheduled", icon: RefreshCw, color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/15" },
}

const awaitingPaymentChip = {
  label: "Awaiting payment",
  icon: CreditCard,
  color: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15",
}
const paymentNotCompletedChip = {
  label: "Payment not completed",
  icon: XCircle,
  color: "text-muted-foreground bg-muted",
}

export function MyBookingsList({ bookings, today, now }: MyBookingsListProps) {
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

  // Unpaid, and the slot hold has run out: the time is no longer reserved.
  const lapsed = (b: PublicBooking) => holdLapsed(b, now)

  // Past = finished or cancelled, already gone by (IST), or never paid for.
  // Going by status alone listed June sessions as "Upcoming" in November.
  const isPast = (b: PublicBooking) =>
    ["cancelled", "completed"].includes(optimistic[b.id] ?? b.status) ||
    b.date < today ||
    lapsed(b)

  // Soonest first; bookings arrive latest-date first, which suits Past.
  const upcoming = bookings
    .filter((b) => !isPast(b))
    .sort((a, b) => `${a.date} ${a.slot}`.localeCompare(`${b.date} ${b.slot}`))
  const past = bookings.filter(isPast)

  return (
    <div className="flex flex-col gap-6">
      {upcoming.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upcoming
          </p>
          <div className="flex flex-col gap-3">
            {upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={handleCancel} pending={pending} past={false} lapsed={false} />
            ))}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Past
          </p>
          <div className="flex flex-col gap-3">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={handleCancel} pending={pending} past lapsed={lapsed(b)} />
            ))}
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
  past,
  lapsed,
}: {
  booking: PublicBooking
  onCancel: (id: string) => void
  pending: boolean
  past: boolean
  lapsed: boolean
}) {
  const router = useRouter()
  const [paying, startPaying] = useTransition()
  const [payError, setPayError] = useState<string | null>(null)

  const session = SESSION_TYPES.find((s) => s.id === booking.sessionType)
  const unpaid = booking.paymentStatus === "unpaid" && booking.status !== "cancelled"
  const statusCfg = unpaid
    ? lapsed
      ? paymentNotCompletedChip
      : awaitingPaymentChip
    : statusConfig[booking.status] ?? statusConfig.pending
  const StatusIcon = statusCfg.icon
  const canCancel = !past && ["pending", "confirmed"].includes(booking.status)

  // Picks up a payment the customer abandoned at Razorpay while the slot is
  // still held for them. There was previously no way back to payment at all.
  function handlePay() {
    setPayError(null)
    startPaying(async () => {
      const result = await startBookingPaymentAction(booking.id)
      if (result.error) {
        setPayError(result.error)
        return
      }
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }
      // Already paid, or the simulated provider in local dev.
      router.refresh()
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-heading text-base font-semibold text-foreground">
            {session?.title ?? LEGACY_SESSION_TITLES[booking.sessionType] ?? booking.sessionType}
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
          {formatBookingDate(booking.date, "short")}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {formatSlot(booking.slot)} {BOOKING_TZ_LABEL}
        </span>
      </div>

      {unpaid ? (
        lapsed ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Payment wasn&apos;t completed, so this time is no longer reserved for you. You&apos;re
            welcome to book again.
          </p>
        ) : past ? null : (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-500/10">
            <p className="min-w-48 flex-1 text-xs text-foreground">
              {booking.holdUntil
                ? `This time is held for you until ${formatSlot(istDateTimeKey(new Date(booking.holdUntil)).slice(11))} ${BOOKING_TZ_LABEL}. Complete payment to confirm it.`
                : "Complete payment to confirm this time."}
            </p>
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              <CreditCard className="size-4" />
              {paying ? "Opening…" : "Complete payment"}
            </button>
            {payError && <p className="w-full text-xs text-destructive">{payError}</p>}
          </div>
        )
      ) : booking.meetingUrl && booking.status !== "cancelled" && !past ? (
        /* Joining link. Shown here as well as in the confirmation email so the
           customer isn't dependent on finding that email at session time. */
        <div className="mt-4 rounded-lg bg-primary/5 p-3">
          <p className="text-xs text-muted-foreground">
            Private audio call on Google Meet — your camera is not required.
          </p>
          <a
            href={booking.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Join the session
          </a>
        </div>
      ) : canCancel ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Iqra will email your Google Meet joining link before the session.
        </p>
      ) : null}

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
