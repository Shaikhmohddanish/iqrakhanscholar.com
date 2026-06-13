import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import { getBookingsByUser, seedAvailability } from "@/lib/bookings"
import { BookingWizard } from "@/components/account/booking-wizard"
import { MyBookingsList } from "@/components/account/my-bookings-list"
import { PageHeading } from "@/components/account/coming-soon"

export const metadata: Metadata = {
  title: "Consultations",
  robots: { index: false },
}

export default async function BookingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  await seedAvailability()
  const bookings = await getBookingsByUser(user.id)

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Book a Consultation"
        description="Schedule a private one-to-one session with Iqra Khan. Choose your session type, pick a date and time, and we will confirm your booking."
      />

      <BookingWizard />

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">My Bookings</h2>
        <MyBookingsList bookings={bookings} />
      </section>
    </div>
  )
}
