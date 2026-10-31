// Consultations run on India Standard Time. Booking dates ("YYYY-MM-DD") and
// slots ("HH:MM") are stored as plain IST wall-clock labels, so every "today"
// and "now" comparison is made in IST here.
//
// Never derive a date key with toISOString() on a local Date: that converts to
// UTC first, and for anyone east of Greenwich - all of India - local midnight
// is still the previous day in UTC. The booking calendar did exactly that, so a
// visitor who clicked the 6th was booked on the 5th.
//
// Client-safe and import-free on purpose: the booking wizard, the server, the
// emails and the admin all share these, and Node can run the file directly to
// test it.

export const BOOKING_TZ_LABEL = "IST"

// India has not observed daylight saving since 1945, so a fixed +05:30 offset
// is exact - and unlike Intl time-zone data it gives the same answer on the
// server (UTC on Vercel) and in every browser, whatever the visitor's own zone.
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/
const SLOT = /^([01]\d|2[0-3]):[0-5]\d$/

// The instant shifted so that its UTC fields read as the wall clock in India.
function inIST(at: Date): Date {
  return new Date(at.getTime() + IST_OFFSET_MS)
}

// UTC midnight of a date key. Date arithmetic is done in UTC so that no time
// zone can shift it.
function utcDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Today's date in India, as "YYYY-MM-DD". */
export function todayInIST(at: Date = new Date()): string {
  return inIST(at).toISOString().slice(0, 10)
}

/**
 * The wall-clock moment in India as "YYYY-MM-DD HH:MM". It compares correctly
 * as a plain string against `${date} ${slot}`, which makes "has this slot
 * already started?" a single comparison, across midnight included.
 */
export function istDateTimeKey(at: Date = new Date()): string {
  return inIST(at).toISOString().slice(0, 16).replace("T", " ")
}

/** "YYYY-MM-DD" from calendar parts. `monthIndex` is 0-based, as in Date. */
export function toDateKey(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** A real calendar date in "YYYY-MM-DD" form (rejects e.g. 2026-02-30). */
export function isDateKey(value: unknown): value is string {
  return (
    typeof value === "string" &&
    DATE_KEY.test(value) &&
    utcDate(value).toISOString().slice(0, 10) === value
  )
}

/** A 24-hour "HH:MM" start time. */
export function isSlot(value: unknown): value is string {
  return typeof value === "string" && SLOT.test(value)
}

export function addDays(date: string, days: number): string {
  const d = utcDate(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Day of the week for a date key: 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(date: string): number {
  return utcDate(date).getUTCDay()
}

/** "14:00" -> "2:00 PM" */
export function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`
}

/** "Thursday, November 5, 2026" (long) or "Thu, Nov 5, 2026" (short). */
export function formatBookingDate(date: string, style: "long" | "short" = "long"): string {
  return utcDate(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: style,
    year: "numeric",
    month: style,
    day: "numeric",
  })
}

/** "Thu, Nov 5, 2026 at 2:00 PM IST" - for notifications, emails and receipts. */
export function formatBookingWhen(date: string, slot: string): string {
  return `${formatBookingDate(date, "short")} at ${formatSlot(slot)} ${BOOKING_TZ_LABEL}`
}
