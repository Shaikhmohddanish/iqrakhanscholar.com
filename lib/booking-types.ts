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
  createdAt: Date
  updatedAt: Date
}
