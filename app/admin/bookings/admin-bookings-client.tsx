"use client"

import { useState, useTransition } from "react"
import type { PublicBooking, BookingStatus, PublicAvailability } from "@/lib/booking-types"
import { SESSION_TYPES, LEGACY_SESSION_TITLES } from "@/lib/booking-types"
import {
  adminUpdateBookingStatusAction,
  adminConfirmBookingAction,
  setAvailabilityAction,
} from "@/app/actions/admin/bookings"
import { Calendar, CheckCircle2, XCircle, Clock, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed", "rescheduled"]
const ALL_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  confirmed: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  completed: "bg-primary/10 text-primary",
  rescheduled: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
}

function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${dh}:${String(m).padStart(2, "0")} ${period}`
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
          No link sent yet — the customer is waiting on this.
        </p>
      )}
    </div>
  )
}

export function AdminBookingsClient({
  bookings,
  availability,
}: {
  bookings: PublicBooking[]
  availability: PublicAvailability[]
}) {
  const [tab, setTab] = useState<"bookings" | "availability">("bookings")
  const [pending, startTransition] = useTransition()
  const [avDate, setAvDate] = useState("")
  const [avSlots, setAvSlots] = useState<string[]>([])
  const [avSaved, setAvSaved] = useState(false)

  function handleStatusChange(id: string, status: BookingStatus) {
    startTransition(() => adminUpdateBookingStatusAction(id, status))
  }

  function toggleSlot(slot: string) {
    setAvSlots((prev) => prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort())
  }

  function loadAvailability(date: string) {
    const existing = availability.find((a) => a.date === date)
    setAvSlots(existing?.slots ?? [])
    setAvDate(date)
    setAvSaved(false)
  }

  function handleSaveAvailability() {
    if (!avDate) return
    startTransition(async () => {
      await setAvailabilityAction(avDate, avSlots)
      setAvSaved(true)
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date / Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
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
                        <p className="text-foreground">{booking.date}</p>
                        <p className="text-xs text-muted-foreground">{formatSlot(booking.slot)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          disabled={pending}
                          className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize border-0 cursor-pointer focus:outline-none", statusColors[booking.status] ?? "bg-muted text-muted-foreground")}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
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
        <div className="flex flex-col gap-5 max-w-md">
          <p className="text-sm text-muted-foreground">Select a date and toggle which time slots are available for booking.</p>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <input
              type="date"
              value={avDate}
              onChange={(e) => loadAvailability(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {avDate && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {ALL_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={cn("rounded-lg border px-3 py-2 text-sm font-medium transition-colors", avSlots.includes(slot) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40")}
                  >
                    {formatSlot(slot)}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={pending}
                className="flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {avSaved ? <><CheckCircle2 className="size-4" /> Saved!</> : "Save availability"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
