"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { formatSlot } from "@/lib/booking-time"

interface TimeSlotPickerProps {
  date: string
  selected: string | null
  onSelect: (slot: string) => void
}

export function TimeSlotPicker({ date, selected, onSelect }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!date) return
    setLoading(true)
    setFailed(false)
    setSlots([])
    fetch(`/api/bookings/availability?date=${date}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Slots request failed: ${r.status}`)
        return r.json() as Promise<{ slots?: string[] }>
      })
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [date])

  if (!date) {
    return (
      <p className="text-sm text-muted-foreground">Please select a date first.</p>
    )
  }

  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        Loading slots…
      </div>
    )
  }

  if (failed) {
    return (
      <p className="text-sm text-destructive">
        We couldn&apos;t load the times for this date. Please go back and try again.
      </p>
    )
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No available slots for this date.</p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelect(slot)}
          aria-pressed={selected === slot}
          className={cn(
            "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
            selected === slot
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary",
          )}
        >
          {formatSlot(slot)}
        </button>
      ))}
    </div>
  )
}
