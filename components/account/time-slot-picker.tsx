"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TimeSlotPickerProps {
  date: string
  selected: string | null
  onSelect: (slot: string) => void
}

function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`
}

export function TimeSlotPicker({ date, selected, onSelect }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) return
    setLoading(true)
    setSlots([])
    fetch(`/api/bookings/availability?date=${date}`)
      .then((r) => r.json())
      .then((data: { slots: string[] }) => setSlots(data.slots))
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
