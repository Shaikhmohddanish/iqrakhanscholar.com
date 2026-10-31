"use server"

import { headers } from "next/headers"
import { requireUser } from "@/lib/session"
import {
  createBooking,
  cancelBooking,
  rescheduleBooking,
  getAvailableSlots,
  getBookingById,
  setBookingReference,
  makeBookingReference,
  extendBookingHold,
  SESSION_TYPES,
  type SessionType,
} from "@/lib/bookings"
import { BOOKING_HOLD_MINUTES, holdsSlot } from "@/lib/booking-types"
import { formatBookingWhen } from "@/lib/booking-time"
import { selectProvider } from "@/lib/payments"
import { confirmBookingPaid } from "@/lib/payments/fulfillment"
import { getActiveCurrency } from "@/lib/currency-server"
import { resolveProductPrice } from "@/lib/currency"
import { createNotification } from "@/lib/notifications"
import { revalidatePath } from "next/cache"

export async function bookSessionAction(data: {
  sessionType: SessionType
  date: string
  slot: string
  topic: string
}) {
  const user = await requireUser()
  if (!user) return { error: "Please sign in to book a session." }

  const sessionInfo = SESSION_TYPES.find((s) => s.id === data.sessionType)
  if (!sessionInfo) return { error: "Invalid session type." }

  const topic = data.topic?.trim().slice(0, 2000)
  if (!topic) return { error: "Please share the questions you'd like to discuss." }

  // Re-check the slot server-side. The wizard picked from a list fetched
  // earlier, so by now someone else may have taken it - or this may be a
  // resubmitted/stale form. Without this a second booking is silently inserted
  // and Iqra is double-booked.
  const stillFree = await getAvailableSlots(data.date)
  if (!stillFree.includes(data.slot)) {
    return {
      error:
        "Sorry, that time has just been taken. Please pick another slot.",
    }
  }

  // Record the price in the visitor's active currency (falls back to base).
  const activeCurrency = await getActiveCurrency()
  const priced = resolveProductPrice(sessionInfo, activeCurrency)

  const isFree = sessionInfo.price === 0
  const booking = await createBooking({
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    sessionType: data.sessionType,
    date: data.date,
    slot: data.slot,
    status: "pending",
    paymentStatus: isFree ? "paid" : "unpaid",
    notes: "",
    topic,
    // Priced from SESSION_TYPES on the server, never from the client.
    price: priced.amount,
    currency: priced.currency,
    reference: makeBookingReference(),
    // An unpaid booking holds the slot only while payment is under way, so an
    // abandoned checkout doesn't take the time away from everyone else.
    ...(isFree ? {} : { holdUntil: new Date(Date.now() + BOOKING_HOLD_MINUTES * 60 * 1000) }),
  })

  await createNotification({
    userId: user.id,
    type: "booking",
    title: "Booking request received",
    body: `Your ${sessionInfo.title} on ${formatBookingWhen(data.date, data.slot)} has been submitted and is pending confirmation.`,
    link: "/account/bookings",
  })

  revalidatePath("/account/bookings")
  return { booking }
}

/**
 * Start payment for a booking and return the gateway URL to redirect to.
 *
 * This replaces a mock: the old confirmPaymentAction simply set
 * paymentStatus:"paid" and status:"confirmed" with no gateway involved, behind
 * a fake card form pre-filled with 4242 4242 4242 4242. Consultations were
 * therefore free - anyone could book any tier without paying, while the store
 * was taking real money through Razorpay.
 *
 * The amount comes from SESSION_TYPES on the server; nothing about the price
 * is accepted from the client.
 */
export async function startBookingPaymentAction(bookingId: string) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  const booking = await getBookingById(bookingId)
  if (!booking || booking.userId !== user.id) return { error: "Booking not found." }
  if (booking.paymentStatus === "paid") return { ok: true, alreadyPaid: true }
  if (booking.status === "cancelled") return { error: "This booking was cancelled." }

  const sessionInfo = SESSION_TYPES.find((s) => s.id === booking.sessionType)
  if (!sessionInfo) return { error: "Invalid session type." }

  // An unpaid booking reserves its slot for BOOKING_HOLD_MINUTES only. If that
  // ran out, someone else may have booked the time since - check before taking
  // money for it. Either way the hold restarts now and lasts exactly as long as
  // the payment link created below.
  if (!holdsSlot(booking)) {
    const stillFree = await getAvailableSlots(booking.date)
    if (!stillFree.includes(booking.slot)) {
      return { error: "Sorry, this time is no longer available. Please book another slot." }
    }
  }
  const holdUntil = await extendBookingHold(bookingId)

  // Re-derive the amount from SESSION_TYPES rather than trusting the stored
  // figure, so a tampered booking document still can't change what is charged.
  const activeCurrency = await getActiveCurrency()
  const priced = resolveProductPrice(sessionInfo, activeCurrency)

  let reference = booking.reference
  if (!reference) {
    // Booking created before references existed.
    reference = makeBookingReference()
    await setBookingReference(bookingId, reference)
  }

  const provider = selectProvider(priced.currency)

  // No gateway configured (local dev): confirm directly, as checkout does.
  if (provider.name === "simulated") {
    await confirmBookingPaid(reference)
    revalidatePath("/account/bookings")
    return { ok: true, simulated: true }
  }

  const hdrs = await headers()
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host")
  const proto = hdrs.get("x-forwarded-proto") ?? "https"
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`

  try {
    const payment = await provider.createPayment({
      orderId: bookingId,
      reference,
      amount: priced.amount,
      currency: priced.currency,
      email: user.email,
      description: `${sessionInfo.title} — ${formatBookingWhen(booking.date, booking.slot)}`,
      successUrl: `${origin}/account/bookings?booked=1`,
      cancelUrl: `${origin}/account/bookings?cancelled=1`,
      // The link dies with the hold, so nobody can pay for a time that has
      // since been released to someone else.
      expiresAt: holdUntil,
    })
    return { ok: true, redirectUrl: payment.redirectUrl }
  } catch (err) {
    console.error("Booking payment initialization failed", err)
    return { error: "We couldn't start the payment. Please try again." }
  }
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
