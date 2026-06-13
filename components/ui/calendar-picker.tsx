'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarPickerProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  disabledDates?: Date[]
  availableDates?: Date[]
  minDate?: Date
  maxDate?: Date
  className?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  disabledDates = [],
  availableDates,
  minDate,
  maxDate,
  className,
}: CalendarPickerProps) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth())
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear())

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1)
  const startDay = firstDayOfMonth.getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function isDisabled(date: Date) {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
    if (maxDate && date > maxDate) return true
    if (disabledDates.some((d) => isSameDay(d, date))) return true
    if (availableDates && !availableDates.some((d) => isSameDay(d, date))) return true
    return false
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const cells: (Date | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d))

  return (
    <div className={cn('w-full max-w-xs rounded-xl border border-border bg-card p-4', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="flex items-center justify-center py-1 text-[11px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}

        {/* Calendar cells */}
        {cells.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} />
          }
          const disabled = isDisabled(date)
          const selected = selectedDate && isSameDay(date, selectedDate)
          const isToday = isSameDay(date, today)

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onDateSelect(date)}
              className={cn(
                'flex size-9 items-center justify-center rounded-lg text-sm transition-colors',
                disabled && 'cursor-not-allowed text-muted-foreground/30',
                !disabled && !selected && 'text-foreground hover:bg-muted',
                selected && 'bg-primary text-primary-foreground font-semibold',
                isToday && !selected && 'font-semibold text-primary',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
