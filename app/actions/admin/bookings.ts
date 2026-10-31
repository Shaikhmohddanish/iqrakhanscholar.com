"use server"

import { requireRole } from "@/lib/session"
import {
  updateBookingStatus,
  confirmBookingWithMeeting,
  setAvailability,
  deleteAvailability,
  setWeeklySchedule,
  SESSION_TYPES,
  type BookingStatus,
} from "@/lib/bookings"
import { BOOKING_SLOT_OPTIONS } from "@/lib/booking-types"
import { formatBookingWhen, isDateKey } from "@/lib/booking-time"
import { createNotification } from "@/lib/notifications"
import { sendBookingConfirmationEmail } from "@/lib/email"
import { SITE_URL } from "@/lib/site-config"
import { revalidatePath } from "next/cache"

export async function adminUpdateBookingStatusAction(id: string, status: BookingStatus) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const ok = await updateBookingStatus(id, status)
  revalidatePath("/admin/bookings")
  return { ok }
}

/**
 * Confirm a booking with its Google Meet link and email the customer.
 *
 * This is the step that was entirely missing. The customer was told at booking
 * time that they "will receive a calendar invite shortly", and nothing in the
 * system was capable of sending one - there was no meeting-link field, and no
 * booking email of any kind. Iqra had to spot the booking in the admin list and
 * email a link by hand.
 */
export async function adminConfirmBookingAction(id: string, meetingUrl: string) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }

  const url = meetingUrl.trim()
  if (!url) return { error: "Please paste the Google Meet link." }
  // Only accept a real https link - a typo here means the customer gets an
  // email with a broken joining link and no way to attend.
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { error: "That doesn't look like a valid link." }
  }
  if (parsed.protocol !== "https:") {
    return { error: "The meeting link must start with https://" }
  }

  const booking = await confirmBookingWithMeeting(id, url)
  if (!booking) return { error: "Booking not found." }

  const session = SESSION_TYPES.find((s) => s.id === booking.sessionType)

  try {
    await sendBookingConfirmationEmail({
      to: booking.userEmail,
      name: booking.userName,
      sessionTitle: session?.title ?? "Your session",
      date: booking.date,
      slot: booking.slot,
      durationMinutes: session?.duration ?? 60,
      meetingUrl: booking.meetingUrl,
      bookingsUrl: `${SITE_URL}/account/bookings`,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[booking] confirmation email failed for ${id}:`, err)
  }

  await createNotification({
    userId: booking.userId,
    type: "booking",
    title: "Session confirmed",
    body: `Your ${session?.title ?? "session"} on ${formatBookingWhen(booking.date, booking.slot)} is confirmed. The joining link is in your email and on this page.`,
    link: "/account/bookings",
  })

  revalidatePath("/admin/bookings")
  revalidatePath("/account/bookings")
  return { ok: true }
}

// Keep only start times the admin grid offers, once each and in order.
// Anything else in the payload is dropped rather than trusted.
function cleanSlots(slots: unknown): string[] {
  if (!Array.isArray(slots)) return []
  return BOOKING_SLOT_OPTIONS.filter((s) => slots.includes(s))
}

// Save Iqra's recurring weekly hours. Index = day of the week (0 = Sunday).
export async function saveWeeklyScheduleAction(weekly: string[][]) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  if (!Array.isArray(weekly) || weekly.length !== 7) return { error: "Invalid schedule." }
  await setWeeklySchedule(weekly.map(cleanSlots))
  revalidatePath("/admin/bookings")
  return { ok: true }
}

// Give one date its own slots instead of the weekly hours ([] closes the day).
export async function setAvailabilityAction(date: string, slots: string[]) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  if (!isDateKey(date)) return { error: "Invalid date." }
  await setAvailability(date, cleanSlots(slots))
  revalidatePath("/admin/bookings")
  return { ok: true }
}

// Put a date back on the weekly hours.
export async function resetAvailabilityAction(date: string) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  if (!isDateKey(date)) return { error: "Invalid date." }
  await deleteAvailability(date)
  revalidatePath("/admin/bookings")
  return { ok: true }
}
