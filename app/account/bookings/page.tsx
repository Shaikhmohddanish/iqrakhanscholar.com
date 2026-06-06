import type { Metadata } from "next"
import { CalendarClock } from "lucide-react"
import { PageHeading, ComingSoon } from "@/components/account/coming-soon"

export const metadata: Metadata = {
  title: "Consultations",
  robots: { index: false },
}

export default function BookingsPage() {
  return (
    <div>
      <PageHeading
        title="Consultations"
        description="View your upcoming and past one-to-one consultation bookings with Iqra."
      />
      <ComingSoon
        icon={<CalendarClock className="size-6" />}
        message="You have no consultations scheduled. Once booking is enabled, your sessions will appear here with join links and reminders."
      />
    </div>
  )
}
