"use server"

import { requireUser } from "@/lib/session"
import {
  createBooking,
  cancelBooking,
  rescheduleBooking,
  SESSION_TYPES,
  type SessionType,
} from "@/lib/bookings"
import { createNotification } from "@/lib/notifications"
import { revalidatePath } from "next/cache"

export async function bookSessionAction(data: {
  sessionType: SessionType
  date: string
  slot: string
  topic: string
  notes: string
}) {
  const user = await requireUser()
  if (!user) return { error: "Please sign in to book a session." }

  const sessionInfo = SESSION_TYPES.find((s) => s.id === data.sessionType)
  if (!sessionInfo) return { error: "Invalid session type." }

  const booking = await createBooking({
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    sessionType: data.sessionType,
    date: data.date,
    slot: data.slot,
    status: "pending",
    paymentStatus: sessionInfo.price === 0 ? "paid" : "unpaid",
    notes: data.notes,
    topic: data.topic,
    price: sessionInfo.price,
    currency: sessionInfo.currency,
  })

  await createNotification({
    userId: user.id,
    type: "booking",
    title: "Booking request received",
    body: `Your ${sessionInfo.title} on ${data.date} at ${data.slot} has been submitted and is pending confirmation.`,
    link: "/account/bookings",
  })

  revalidatePath("/account/bookings")
  return { booking }
}

export async function confirmPaymentAction(bookingId: string) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  // Mock payment — mark as paid and confirmed
  const { updateBookingStatus } = await import("@/lib/bookings")
  const { getDb } = await import("@/lib/mongodb")
  const { ObjectId } = await import("mongodb")

  const db = await getDb()
  const col = db.collection("bookings")
  await col.updateOne(
    { _id: new ObjectId(bookingId), userId: user.id },
    { $set: { paymentStatus: "paid", status: "confirmed", updatedAt: new Date() } },
  )

  await createNotification({
    userId: user.id,
    type: "booking",
    title: "Booking confirmed",
    body: "Your session has been confirmed. You will receive a calendar invite shortly.",
    link: "/account/bookings",
  })

  revalidatePath("/account/bookings")
  return { ok: true }
}

export async function cancelBookingAction(bookingId: string) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  const ok = await cancelBooking(bookingId, user.id)
  if (!ok) return { error: "Could not cancel booking." }

  revalidatePath("/account/bookings")
  return { ok: true }
}

export async function rescheduleBookingAction(
  bookingId: string,
  newDate: string,
  newSlot: string,
) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  const ok = await rescheduleBooking(bookingId, user.id, newDate, newSlot)
  if (!ok) return { error: "Could not reschedule booking." }

  revalidatePath("/account/bookings")
  return { ok: true }
}
