'use client'

import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface TimeSlot {
  time: string // e.g., "09:00"
  label: string // e.g., "9:00 AM"
  available: boolean
}

interface TimePickerProps {
  slots: TimeSlot[]
  selectedTime: string | null
  onTimeSelect: (time: string) => void
  className?: string
}

export function TimePicker({ slots, selectedTime, onTimeSelect, className }: TimePickerProps) {
  const available = slots.filter((s) => s.available)
  const unavailable = slots.filter((s) => !s.available)

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="size-4" />
        <span>{available.length} slot{available.length !== 1 ? 's' : ''} available</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onTimeSelect(slot.time)}
            className={cn(
              'rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
              !slot.available && 'cursor-not-allowed border-border bg-muted/50 text-muted-foreground/40 line-through',
              slot.available && selectedTime !== slot.time && 'border-border bg-card text-foreground hover:border-primary hover:bg-primary/5',
              selectedTime === slot.time && 'border-primary bg-primary text-primary-foreground',
            )}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  )
}
