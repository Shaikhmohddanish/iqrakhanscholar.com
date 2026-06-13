"use server"

import { requireRole } from "@/lib/session"
import { updateBookingStatus, setAvailability, type BookingStatus } from "@/lib/bookings"
import { revalidatePath } from "next/cache"

export async function adminUpdateBookingStatusAction(id: string, status: BookingStatus) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const ok = await updateBookingStatus(id, status)
  revalidatePath("/admin/bookings")
  return { ok }
}

export async function setAvailabilityAction(date: string, slots: string[]) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  await setAvailability(date, slots)
  revalidatePath("/admin/bookings")
  return { ok: true }
}
