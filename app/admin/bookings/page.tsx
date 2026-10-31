import type { Metadata } from "next"
import { getAllBookings, getAvailability, getWeeklySchedule } from "@/lib/bookings"
import { BOOKING_WINDOW_DAYS } from "@/lib/booking-types"
import { addDays, todayInIST } from "@/lib/booking-time"
import { AdminBookingsClient } from "./admin-bookings-client"

export const metadata: Metadata = {
  title: "Bookings - Admin",
  robots: { index: false },
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  // IST like every booking date. This used toISOString(), which gives the UTC
  // date - a day behind India for the first five and a half hours of each day.
  const today = todayInIST()
  const maxDate = addDays(today, BOOKING_WINDOW_DAYS)

  const [{ bookings, total }, overrides, weekly, { tab }] = await Promise.all([
    getAllBookings({ limit: 100 }),
    getAvailability(today, maxDate),
    getWeeklySchedule(),
    searchParams,
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <AdminBookingsClient
        bookings={bookings}
        overrides={overrides}
        weekly={weekly}
        today={today}
        maxDate={maxDate}
        initialTab={tab === "availability" ? "availability" : "bookings"}
      />
    </div>
  )
}
