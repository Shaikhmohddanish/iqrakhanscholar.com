import type { Metadata } from "next"
import { getAllBookings, getAvailability } from "@/lib/bookings"
import { AdminBookingsClient } from "./admin-bookings-client"

export const metadata: Metadata = {
  title: "Bookings — Admin",
  robots: { index: false },
}

export default async function AdminBookingsPage() {
  const today = new Date().toISOString().slice(0, 10)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + 60)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  const [{ bookings, total }, availability] = await Promise.all([
    getAllBookings({ limit: 100 }),
    getAvailability(today, cutoffStr),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <AdminBookingsClient bookings={bookings} availability={availability} />
    </div>
  )
}
