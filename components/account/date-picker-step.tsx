"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BOOKING_WINDOW_DAYS } from "@/lib/booking-types"
import { addDays, formatBookingDate, toDateKey, todayInIST, weekdayOf } from "@/lib/booking-time"

interface DatePickerStepProps {
  selected: string | null
  onSelect: (date: string) => void
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

// The visible month as plain numbers, never a Date: each cell's key is built
// from its year/month/day with toDateKey(). Cells used to be keyed with
// toISOString() on a local Date, which for every visitor in India gave the
// previous day - clicking the 6th booked the 5th.
type MonthView = { year: number; month: number }

function monthOf(date: string): MonthView {
  const [year, month] = date.split("-").map(Number)
  return { year, month: month - 1 }
}

function monthNumber(view: MonthView): number {
  return view.year * 12 + view.month
}

export function DatePickerStep({ selected, onSelect }: DatePickerStepProps) {
  const [availableDates, setAvailableDates] = useState<string[] | null>(null)
  const [failed, setFailed] = useState(false)
  // The bookable range is today..today+window in India, whatever the
  // visitor's own time zone.
  const [today] = useState(() => todayInIST())
  const firstMonth = monthOf(today)
  const lastMonth = monthOf(addDays(today, BOOKING_WINDOW_DAYS))
  const [view, setView] = useState<MonthView>(() => monthOf(selected ?? today))

  useEffect(() => {
    fetch("/api/bookings/availability")
      .then((r) => {
        // A 401 (session expired) or 500 used to fall through as "no dates",
        // silently greying out the whole calendar.
        if (!r.ok) throw new Error(`Availability request failed: ${r.status}`)
        return r.json() as Promise<{ dates?: string[] }>
      })
      .then((data) => {
        const dates = data.dates ?? []
        setAvailableDates(dates)
        // Open on a month that has something to book rather than one that may
        // be entirely greyed out - unless a date is already chosen.
        if (!selected && dates.length > 0) setView(monthOf(dates[0]))
      })
      .catch(() => setFailed(true))
    // Mount only: going back to this step remounts it with the chosen date.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        We couldn&apos;t load the available dates. Please refresh the page and try again.
      </div>
    )
  }

  if (!availableDates) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Loading availability…
      </div>
    )
  }

  if (availableDates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No dates are open for booking right now. Please check back soon, or{" "}
        <Link href="/contact" className="font-medium text-primary hover:underline">
          contact us
        </Link>{" "}
        to arrange a time.
      </div>
    )
  }

  const available = new Set(availableDates)
  const { year, month } = view
  const firstDay = weekdayOf(toDateKey(year, month, 1))
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const canGoBack = monthNumber(view) > monthNumber(firstMonth)
  const canGoForward = monthNumber(view) < monthNumber(lastMonth)

  function shiftMonth(delta: number) {
    const n = monthNumber(view) + delta
    setView({ year: Math.floor(n / 12), month: n % 12 })
  }

  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="font-heading text-base font-semibold text-foreground">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!canGoForward}
          aria-label="Next month"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {DAYS.map((d) => (
          <div key={d} className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const key = toDateKey(year, month, day)
          // The server only returns today-or-later dates inside the booking
          // window that still have an open slot, so this one check covers
          // past, closed and fully booked days.
          const isAvailable = available.has(key)
          const isSelected = selected === key

          return (
            <button
              key={key}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-label={`${formatBookingDate(key)}${isAvailable ? "" : " (unavailable)"}`}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isAvailable
                  ? "text-foreground hover:bg-secondary hover:text-primary"
                  : "cursor-default text-muted-foreground/40",
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-primary" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-secondary" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-muted" /> Unavailable
        </span>
      </div>
    </div>
  )
}
