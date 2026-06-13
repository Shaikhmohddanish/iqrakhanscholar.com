// Client-safe booking types and constants (no DB/server-only imports)

export type SessionType = "discovery" | "guidance" | "intensive" | "group"
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "rescheduled"
export type BookingPaymentStatus = "unpaid" | "paid" | "refunded"

export interface SessionTypeInfo {
  id: SessionType
  title: string
  description: string
  duration: number // minutes
  price: number // cents
  currency: string
}

export const SESSION_TYPES: SessionTypeInfo[] = [
  {
    id: "discovery",
    title: "Discovery Call",
    description: "A 30-minute introductory call to discuss your goals and how Iqra can help you.",
    duration: 30,
    price: 0,
    currency: "USD",
  },
  {
    id: "guidance",
    title: "One-to-One Guidance",
    description: "A 60-minute private session for personalised Islamic guidance and advice.",
    duration: 60,
    price: 7500,
    currency: "USD",
  },
  {
    id: "intensive",
    title: "Intensive Study Session",
    description: "A 90-minute deep-dive into a specific topic — Quran, Fiqh, or personal development.",
    duration: 90,
    price: 12000,
    currency: "USD",
  },
  {
    id: "group",
    title: "Group Study Circle",
    description: "A 60-minute virtual halaqa with up to 10 participants.",
    duration: 60,
    price: 2500,
    currency: "USD",
  },
]

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
