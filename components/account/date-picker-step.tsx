"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerStepProps {
  selected: string | null
  onSelect: (date: string) => void
}

function formatDateStr(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function DatePickerStep({ selected, onSelect }: DatePickerStepProps) {
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(new Date(today))

  useEffect(() => {
    setLoading(true)
    fetch("/api/bookings/availability")
      .then((r) => r.json())
      .then((data: { dates: string[] }) => {
        setAvailableDates(new Set(data.dates))
      })
      .finally(() => setLoading(false))
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const cells: (Date | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d))
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Loading availability…
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="font-heading text-base font-semibold text-foreground">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />
          const str = formatDateStr(date)
          const isPast = date < today
          const isAvailable = availableDates.has(str)
          const isSelected = selected === str

          return (
            <button
              key={str}
              type="button"
              disabled={isPast || !isAvailable}
              onClick={() => onSelect(str)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isAvailable && !isPast
                  ? "text-foreground hover:bg-secondary hover:text-primary"
                  : "cursor-default text-muted-foreground/40",
              )}
            >
              {date.getDate()}
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
