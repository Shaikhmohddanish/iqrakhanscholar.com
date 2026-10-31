"use client"

import { useState, useTransition } from "react"
import type { PublicBooking, BookingStatus, PublicAvailability } from "@/lib/booking-types"
import {
  SESSION_TYPES,
  LEGACY_SESSION_TITLES,
  BOOKING_SLOT_OPTIONS,
  BOOKING_LEAD_MINUTES,
} from "@/lib/booking-types"
import { BOOKING_TZ_LABEL, formatBookingDate, formatSlot, weekdayOf } from "@/lib/booking-time"
import {
  adminUpdateBookingStatusAction,
  adminConfirmBookingAction,
  setAvailabilityAction,
  resetAvailabilityAction,
  saveWeeklyScheduleAction,
} from "@/app/actions/admin/bookings"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed", "rescheduled"]

// Monday first, the way a working week reads. `day` is the Date weekday number
// (0 = Sunday) that indexes the saved weekly schedule.
const WEEK = [
  { day: 1, label: "Monday" },
  { day: 2, label: "Tuesday" },
  { day: 3, label: "Wednesday" },
  { day: 4, label: "Thursday" },
  { day: 5, label: "Friday" },
  { day: 6, label: "Saturday" },
  { day: 0, label: "Sunday" },
]

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  confirmed: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  completed: "bg-primary/10 text-primary",
  rescheduled: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
}

const paymentColors: Record<string, string> = {
  paid: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  unpaid: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  refunded: "bg-muted text-muted-foreground",
}

function toggleSlot(list: string[], slot: string): string[] {
  return list.includes(slot) ? list.filter((s) => s !== slot) : [...list, slot].sort()
}

function SlotChips({
  selected,
  onToggle,
}: {
  selected: string[]
  onToggle: (slot: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {BOOKING_SLOT_OPTIONS.map((slot) => {
        const on = selected.includes(slot)
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onToggle(slot)}
            aria-pressed={on}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40",
            )}
          >
            {formatSlot(slot)}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Paste the Google Meet link for a session and send it to the customer.
 *
 * This is the only thing that emails a customer their joining link. Until it
 * existed, the app told people at booking time that they would "receive a
 * calendar invite shortly" and then sent nothing at all.
 */
function MeetingLinkCell({ booking }: { booking: PublicBooking }) {
  const [url, setUrl] = useState(booking.meetingUrl ?? "")
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const unchanged = url.trim() === (booking.meetingUrl ?? "")

  function handleSend() {
    setError(null)
    setSent(false)
    startTransition(async () => {
      const res = await adminConfirmBookingAction(booking.id, url)
      if (res?.error) setError(res.error)
      else setSent(true)
    })
  }

  return (
    <div className="flex min-w-56 flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            setSent(false)
          }}
          placeholder="https://meet.google.com/..."
          className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={pending || !url.trim() || (unchanged && sent)}
          title="Save the link, confirm the booking, and email it to the customer"
          className="shrink-0 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          {pending ? "Sending…" : sent ? "Sent" : booking.meetingUrl ? "Resend" : "Send"}
        </button>
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
      {sent && !error && (
        <p className="flex items-center gap-1 text-[11px] text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-3" /> Confirmation emailed to {booking.userEmail}
        </p>
      )}
      {!sent && !booking.meetingUrl && (
        <p className="text-[11px] text-muted-foreground">
          {/* Without the payment column, nothing here distinguished a paid
              session from an abandoned checkout. */}
          {booking.paymentStatus === "unpaid"
            ? "Not paid yet — wait for payment before sending a link."
            : "No link sent yet — the customer is waiting on this."}
        </p>
      )}
    </div>
  )
}

/**
 * Weekly hours plus per-date changes.
 *
 * Availability used to be opened one date at a time, and nothing ever opened
 * more than the 30 weekdays a one-time seed created - so once those passed,
 * every day on the customer calendar was disabled. Customers now see the weekly
 * hours for the next 60 days automatically; a date only needs touching to
 * close it or to offer different times.
 */
function AvailabilityPanel({
  weekly,
  overrides,
  today,
  maxDate,
}: {
  weekly: string[][]
  overrides: PublicAvailability[]
  today: string
  maxDate: string
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [week, setWeek] = useState(weekly)
  const [weekSaved, setWeekSaved] = useState(false)

  const [date, setDate] = useState("")
  const [dateSlots, setDateSlots] = useState<string[]>([])
  const [dateMessage, setDateMessage] = useState<string | null>(null)

  const override = date ? overrides.find((o) => o.date === date) : undefined

  function run(action: () => Promise<{ error?: string } | undefined>, onDone: () => void) {
    setError(null)
    startTransition(async () => {
      const res = await action()
      if (res?.error) setError(res.error)
      else onDone()
    })
  }

  function toggleWeekly(day: number, slot: string) {
    setWeek((prev) => prev.map((slots, i) => (i === day ? toggleSlot(slots, slot) : slots)))
    setWeekSaved(false)
  }

  function pickDate(value: string) {
    setDate(value)
    setDateMessage(null)
    setError(null)
    if (!value) return
    // Start from what customers currently see for that date.
    const existing = overrides.find((o) => o.date === value)
    setDateSlots(existing ? existing.slots : weekly[weekdayOf(value)] ?? [])
  }

  function saveDate(slots: string[]) {
    run(
      () => setAvailabilityAction(date, slots),
      () => {
        setDateSlots(slots)
        setDateMessage(
          slots.length === 0
            ? "Closed — customers can't book this date."
            : "Saved — customers see these times on this date.",
        )
      },
    )
  }

  function resetDate(value: string) {
    run(
      () => resetAvailabilityAction(value),
      () => {
        if (value !== date) return
        setDateSlots(weekly[weekdayOf(value)] ?? [])
        setDateMessage("Back on the weekly hours.")
      },
    )
  }

  const statusLine = !date
    ? null
    : !override
      ? `follows the weekly hours for ${WEEK.find((w) => w.day === weekdayOf(date))?.label}.`
      : override.slots.length === 0
        ? "closed."
        : "custom hours."

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        All times are India Standard Time ({BOOKING_TZ_LABEL}). Customers can book up to{" "}
        {formatBookingDate(maxDate, "short")}, and not within {BOOKING_LEAD_MINUTES / 60} hours
        of a session starting.
      </p>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-base font-semibold text-foreground">Weekly hours</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The times customers can book every week. Leave a day empty to close it.
        </p>
        <div className="mt-3 flex flex-col divide-y divide-border">
          {WEEK.map(({ day, label }) => (
            <div key={day} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-4">
              <span className="w-24 shrink-0 pt-1.5 text-sm font-medium text-foreground">{label}</span>
              <SlotChips selected={week[day] ?? []} onToggle={(slot) => toggleWeekly(day, slot)} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => run(() => saveWeeklyScheduleAction(week), () => setWeekSaved(true))}
          disabled={pending}
          className="mt-3 flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {weekSaved ? <><CheckCircle2 className="size-4" /> Saved</> : "Save weekly hours"}
        </button>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-base font-semibold text-foreground">Change a single date</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Close a day (a holiday, travel) or offer different times on it. Every other date keeps
          the weekly hours.
        </p>
        <input
          type="date"
          value={date}
          min={today}
          max={maxDate}
          onChange={(e) => pickDate(e.target.value)}
          className="mt-4 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {date && (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-foreground">
              <span className="font-medium">{formatBookingDate(date)}</span>{" "}
              <span className="text-muted-foreground">— {statusLine}</span>
            </p>
            <SlotChips
              selected={dateSlots}
              onToggle={(slot) => {
                setDateSlots((prev) => toggleSlot(prev, slot))
                setDateMessage(null)
              }}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => saveDate(dateSlots)}
                disabled={pending}
                className="h-9 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                Save for this date
              </button>
              <button
                type="button"
                onClick={() => saveDate([])}
                disabled={pending}
                className="h-9 rounded-full border border-border px-5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
              >
                Close this date
              </button>
              {override && (
                <button
                  type="button"
                  onClick={() => resetDate(date)}
                  disabled={pending}
                  className="h-9 rounded-full border border-border px-5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
                >
                  Reset to weekly hours
                </button>
              )}
            </div>
            {dateMessage && (
              <p className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                <CheckCircle2 className="size-3" /> {dateMessage}
              </p>
            )}
          </div>
        )}
      </section>

      {overrides.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-base font-semibold text-foreground">Upcoming date changes</h2>
          <ul className="mt-2 divide-y divide-border">
            {overrides.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 text-sm">
                <button
                  type="button"
                  onClick={() => pickDate(o.date)}
                  className="w-32 text-left font-medium text-foreground hover:text-primary"
                >
                  {formatBookingDate(o.date, "short")}
                </button>
                <span className="flex-1 text-muted-foreground">
                  {o.slots.length === 0 ? "Closed" : o.slots.map(formatSlot).join(", ")}
                </span>
                <button
                  type="button"
                  onClick={() => resetDate(o.date)}
                  disabled={pending}
                  className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                >
                  Reset
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function AdminBookingsClient({
  bookings,
  overrides,
  weekly,
  today,
  maxDate,
  initialTab,
}: {
  bookings: PublicBooking[]
  overrides: PublicAvailability[]
  weekly: string[][]
  today: string
  maxDate: string
  initialTab: "bookings" | "availability"
}) {
  const [tab, setTab] = useState<"bookings" | "availability">(initialTab)
  const [pending, startTransition] = useTransition()

  function handleStatusChange(id: string, status: BookingStatus) {
    startTransition(async () => {
      await adminUpdateBookingStatusAction(id, status)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-muted p-1 w-fit">
        {(["bookings", "availability"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded-lg px-4 py-1.5 text-sm font-medium transition-colors capitalize", tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Session</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date / Time ({BOOKING_TZ_LABEL})</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status / Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Google Meet link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No bookings yet.</td></tr>
              ) : (
                bookings.map((booking) => {
                  const session = SESSION_TYPES.find((s) => s.id === booking.sessionType)
                  return (
                    <tr key={booking.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{booking.userName}</p>
                        <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{session?.title ?? LEGACY_SESSION_TITLES[booking.sessionType] ?? booking.sessionType}</td>
                      <td className="px-4 py-3">
                        <p className="text-foreground">{formatBookingDate(booking.date, "short")}</p>
                        <p className="text-xs text-muted-foreground">{formatSlot(booking.slot)} {BOOKING_TZ_LABEL}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-1.5">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                            disabled={pending}
                            className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize border-0 cursor-pointer focus:outline-none", statusColors[booking.status] ?? "bg-muted text-muted-foreground")}
                          >
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", paymentColors[booking.paymentStatus] ?? "bg-muted text-muted-foreground")}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <MeetingLinkCell booking={booking} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "availability" && (
        <AvailabilityPanel weekly={weekly} overrides={overrides} today={today} maxDate={maxDate} />
      )}
    </div>
  )
}
