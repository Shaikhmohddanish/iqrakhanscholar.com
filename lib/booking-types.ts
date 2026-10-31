// Client-safe booking types and constants (no DB/server-only imports)

export type SessionType = "session-30" | "session-group" | "package-3x60"
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "rescheduled"
export type BookingPaymentStatus = "unpaid" | "paid" | "refunded"

export interface SessionTypeInfo {
  id: SessionType
  title: string
  description: string
  duration: number // minutes
  // base price in minor units of `currency`
  price: number
  currency: string
  // optional manually-entered per-currency amounts (currency code -> minor units)
  prices?: Record<string, number>
}

// All tiers are priced in INR only (no per-currency overrides), so every
// visitor sees and is charged the same ₹ amount regardless of the switcher.
export const SESSION_TYPES: SessionTypeInfo[] = [
  {
    id: "session-30",
    title: "30-Minute Session",
    description: "A focused half-hour one-to-one session for a specific question or concern.",
    duration: 30,
    price: 210000,
    currency: "INR",
  },
  {
    id: "session-group",
    title: "Group Islamic Guidance Session",
    description:
      "Interactive group sessions designed for couples, families, and sisters seeking Islamic guidance on marriage, relationships, family challenges, and personal development. These sessions provide Islamic guidance and support through the teachings of the Qur'an and Sunnah.",
    duration: 60,
    price: 410000,
    currency: "INR",
  },
  {
    id: "package-3x60",
    title: "3-Session Package",
    description:
      "Three 60-minute sessions over consecutive weeks. Book your first session now; the remaining two are scheduled with Iqra.",
    duration: 60,
    price: 1360000,
    currency: "INR",
  },
]

// Every start time Iqra can offer, in IST. The admin toggles from this list and
// the server rejects anything outside it.
export const BOOKING_SLOT_OPTIONS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
]

// Weekly hours used until Iqra saves her own in admin. Index = day of the week
// (0 = Sunday): Monday-Friday mornings and afternoons, weekends closed. Having
// a default means the calendar works with no setup - the old one-time seed
// opened 30 weekdays and then left the calendar empty for good.
const WEEKDAY_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
export const DEFAULT_WEEKLY_SCHEDULE: string[][] = [
  [],
  [...WEEKDAY_SLOTS],
  [...WEEKDAY_SLOTS],
  [...WEEKDAY_SLOTS],
  [...WEEKDAY_SLOTS],
  [...WEEKDAY_SLOTS],
  [],
]

// How many days ahead customers can book.
export const BOOKING_WINDOW_DAYS = 60

// Slots starting sooner than this are not offered. Iqra confirms each booking
// and sends the Google Meet link by hand, so a slot five minutes away can't
// actually happen.
export const BOOKING_LEAD_MINUTES = 120

// An unpaid booking reserves its slot only this long (from creation, renewed
// when payment starts), and its Razorpay link expires at the same moment.
// Abandoned payments used to block their slot forever.
export const BOOKING_HOLD_MINUTES = 30

// How long an expired hold keeps blocking the slot anyway, so a payment made
// just before the link expired can still arrive by webhook before anyone else
// is offered the time.
export const BOOKING_HOLD_GRACE_MS = 5 * 60 * 1000

// Whether a non-cancelled booking is blocking its slot right now. Paid bookings
// always do, as do unpaid ones from before holds existed. Must agree with the
// slot query in lib/bookings.ts.
export function holdsSlot(
  booking: { paymentStatus: BookingPaymentStatus; holdUntil?: Date },
  now: number = Date.now(),
): boolean {
  if (booking.paymentStatus !== "unpaid" || !booking.holdUntil) return true
  return new Date(booking.holdUntil).getTime() + BOOKING_HOLD_GRACE_MS > now
}

// An unpaid booking whose hold has ended. Its payment link expired with the
// hold, so the customer no longer has the time - it isn't "upcoming".
export function holdLapsed(
  booking: { paymentStatus: BookingPaymentStatus; holdUntil?: Date },
  now: number = Date.now(),
): boolean {
  return (
    booking.paymentStatus === "unpaid" &&
    !!booking.holdUntil &&
    new Date(booking.holdUntil).getTime() <= now
  )
}

// Titles for bookings created before the tier revamp, keyed by their old ids.
export const LEGACY_SESSION_TITLES: Record<string, string> = {
  "session-60": "60-Minute Session",
  discovery: "Discovery Call",
  guidance: "One-to-One Guidance",
  intensive: "Intensive Study Session",
  group: "Group Study Circle",
}

export interface PublicAvailability {
  id: string
  date: string
  slots: string[]
  createdAt: Date
}

export interface PublicBooking {
  id: string
  userId: string
  userEmail: string
  userName: string
  sessionType: SessionType
  date: string
  slot: string
  status: BookingStatus
  paymentStatus: BookingPaymentStatus
  notes: string
  topic: string
  price: number
  currency: string
  // Public payment reference (BK-...), used by the payment webhook.
  reference?: string
  // Google Meet joining link, added by Iqra when she confirms the session.
  meetingUrl?: string
  // When an unpaid booking stops reserving its slot (see holdsSlot).
  holdUntil?: Date
  createdAt: Date
  updatedAt: Date
}
