"use client"

import Link from "next/link"
import { CheckCircle2, Calendar, Clock, ArrowRight } from "lucide-react"
import { SESSION_TYPES, type SessionType } from "@/lib/booking-types"

interface BookingConfirmationProps {
  sessionType: SessionType
  date: string
  slot: string
  onBookAgain: () => void
}

function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

export function BookingConfirmation({ sessionType, date, slot, onBookAgain }: BookingConfirmationProps) {
  const session = SESSION_TYPES.find((s) => s.id === sessionType)!

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="size-10 text-primary" />
      </div>

      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Booking Confirmed!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your {session.title} has been confirmed. Check your email for details.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Booking details
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="size-4 shrink-0 text-primary" />
            <span className="text-foreground">{formatDateLong(date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 shrink-0 text-primary" />
            <span className="text-foreground">{formatSlot(slot)} — {session.duration} minutes</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/account/bookings"
          className="flex h-11 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          View my bookings
          <ArrowRight className="size-4" />
        </Link>
        <button
          type="button"
          onClick={onBookAgain}
          className="h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Book another session
        </button>
      </div>
    </div>
  )
}
