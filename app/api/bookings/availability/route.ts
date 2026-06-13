import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { getAvailableDates, getAvailableSlots } from "@/lib/bookings"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")

  if (date) {
    const slots = await getAvailableSlots(date)
    return NextResponse.json({ slots })
  }

  const dates = await getAvailableDates()
  return NextResponse.json({ dates })
}
