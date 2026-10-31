import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"
import type { SessionType, BookingStatus, BookingPaymentStatus, PublicBooking, PublicAvailability } from "./booking-types"
import {
  DEFAULT_WEEKLY_SCHEDULE,
  BOOKING_WINDOW_DAYS,
  BOOKING_LEAD_MINUTES,
  BOOKING_HOLD_MINUTES,
  BOOKING_HOLD_GRACE_MS,
} from "./booking-types"
import { todayInIST, istDateTimeKey, addDays, weekdayOf, isDateKey, isSlot } from "./booking-time"

export type { SessionType, BookingStatus, BookingPaymentStatus, PublicBooking, PublicAvailability }
export { SESSION_TYPES } from "./booking-types"

export interface BookingDoc {
  _id?: ObjectId
  userId: string
  userEmail: string
  userName: string
  sessionType: SessionType
  date: string // YYYY-MM-DD
  slot: string // HH:MM (24-hour)
  status: BookingStatus
  paymentStatus: BookingPaymentStatus
  notes: string
  topic: string
  price: number
  currency: string
  // Public payment reference, e.g. "BK-M4X2QKT9". Travels in the Razorpay
  // payment link's `notes` so the webhook can find this booking without a
  // user session. The BK- prefix is what distinguishes a booking payment from
  // an order payment (IK-) in the shared webhook handler.
  reference?: string
  // Google Meet joining link, pasted by Iqra in /admin/bookings when she
  // confirms the session. Optional because it doesn't exist until then - and
  // the confirmation email only promises a link when one is actually present.
  meetingUrl?: string
  // When an unpaid booking stops reserving its slot - see holdsSlot(). Absent
  // on paid/free bookings and on bookings made before holds existed.
  holdUntil?: Date
  createdAt: Date
  updatedAt: Date
}

// One date's slots, overriding the weekly schedule for that date. An empty
// list closes the day; deleting the doc returns it to the weekly hours.
export interface AvailabilityDoc {
  _id?: ObjectId
  date: string // YYYY-MM-DD
  slots: string[] // HH:MM
  createdAt: Date
}

// Iqra's recurring weekly hours: a single document in "settings". Index = day
// of the week (0 = Sunday), values are IST "HH:MM" start times.
interface BookingScheduleDoc {
  _id: string
  weekly: string[][]
  updatedAt: Date
}

const SCHEDULE_ID = "booking-schedule"

function toPublicBooking(doc: WithId<BookingDoc>): PublicBooking {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

function toPublicAvailability(doc: WithId<AvailabilityDoc>): PublicAvailability {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

// Guarded so index creation happens once per server instance, not on every
// read - see the note in lib/blog.ts. getAvailableSlots hits this collection
// on every date the booking wizard shows.
let bookingIndexesEnsured = false
let availabilityIndexesEnsured = false

async function bookingsCol() {
  const db = await getDb()
  const col = db.collection<BookingDoc>("bookings")
  if (bookingIndexesEnsured) return col
  await col.createIndex({ userId: 1, date: -1 })
  // Deliberately NOT unique: a cancelled booking leaves its date+slot behind,
  // and that slot must be bookable again. A plain unique index would block the
  // re-booking; a partial one would depend on operator support that varies by
  // server version, and a failed createIndex here would break every booking
  // page. Double-booking is prevented in bookSessionAction, which re-checks
  // availability immediately before insert. That leaves a millisecond-wide
  // race on simultaneous submits - acceptable for this volume, and visible to
  // Iqra in the admin bookings list if it ever happens.
  await col.createIndex({ date: 1, slot: 1 })
  bookingIndexesEnsured = true
  return col
}

async function availabilityCol() {
  const db = await getDb()
  const col = db.collection<AvailabilityDoc>("availability")
  if (!availabilityIndexesEnsured) {
    await col.createIndex({ date: 1 }, { unique: true })
    availabilityIndexesEnsured = true
  }
  return col
}

async function settingsCol() {
  const db = await getDb()
  return db.collection<BookingScheduleDoc>("settings")
}

// The weekly hours customers can book, falling back to the built-in default
// until Iqra saves her own - so the calendar works with no setup at all.
export async function getWeeklySchedule(): Promise<string[][]> {
  const col = await settingsCol()
  const doc = await col.findOne({ _id: SCHEDULE_ID })
  if (!doc || !Array.isArray(doc.weekly) || doc.weekly.length !== 7) {
    return DEFAULT_WEEKLY_SCHEDULE.map((day) => [...day])
  }
  return doc.weekly.map((day) => (Array.isArray(day) ? day.filter(isSlot) : []))
}

export async function setWeeklySchedule(weekly: string[][]): Promise<void> {
  const col = await settingsCol()
  await col.updateOne(
    { _id: SCHEDULE_ID },
    { $set: { weekly, updatedAt: new Date() } },
    { upsert: true },
  )
}

// Open start times per date in [from, to], once the weekly hours, per-date
// overrides, existing bookings and the lead time are all applied. Dates with
// nothing left are omitted; the map iterates in date order.
async function openSlotsByDate(from: string, to: string): Promise<Map<string, string[]>> {
  const now = Date.now()
  const [weekly, overrides, booked] = await Promise.all([
    getWeeklySchedule(),
    availabilityCol().then((col) => col.find({ date: { $gte: from, $lte: to } }).toArray()),
    bookingsCol().then((col) =>
      col
        .find({
          date: { $gte: from, $lte: to },
          status: { $nin: ["cancelled"] },
          // Mirrors holdsSlot(): an unpaid booking stops blocking its slot
          // once its hold (plus grace) has run out.
          $or: [
            { paymentStatus: { $ne: "unpaid" } },
            { holdUntil: { $exists: false } },
            { holdUntil: { $gt: new Date(now - BOOKING_HOLD_GRACE_MS) } },
          ],
        })
        .project<{ date: string; slot: string }>({ date: 1, slot: 1 })
        .toArray(),
    ),
  ])

  const overrideByDate = new Map<string, string[]>(overrides.map((o) => [o.date, o.slots]))
  const taken = new Set(booked.map((b) => `${b.date} ${b.slot}`))
  // Anything starting before this moment (IST) is too soon to arrange - or
  // already over. One string comparison covers both, across midnight too.
  const cutoff = istDateTimeKey(new Date(now + BOOKING_LEAD_MINUTES * 60 * 1000))

  const open = new Map<string, string[]>()
  for (let date = from; date <= to; date = addDays(date, 1)) {
    // An override replaces that weekday's hours for the one date; [] closes it.
    const slots = (overrideByDate.get(date) ?? weekly[weekdayOf(date)])
      .filter((slot) => {
        const key = `${date} ${slot}`
        return key > cutoff && !taken.has(key)
      })
      .sort()
    if (slots.length > 0) open.set(date, slots)
  }
  return open
}

// Dates (YYYY-MM-DD, IST) with at least one open slot, from today through the
// booking window.
export async function getAvailableDates(): Promise<string[]> {
  const today = todayInIST()
  const open = await openSlotsByDate(today, addDays(today, BOOKING_WINDOW_DAYS))
  return [...open.keys()]
}

// Open start times for one date. Empty for a malformed date or one outside the
// booking window, so bookSessionAction's re-check rejects past, closed and
// too-distant dates - not only taken slots.
export async function getAvailableSlots(date: string): Promise<string[]> {
  const today = todayInIST()
  if (!isDateKey(date) || date < today || date > addDays(today, BOOKING_WINDOW_DAYS)) return []
  const open = await openSlotsByDate(date, date)
  return open.get(date) ?? []
}

export async function createBooking(
  input: Omit<BookingDoc, "_id" | "createdAt" | "updatedAt">,
): Promise<PublicBooking> {
  const col = await bookingsCol()
  const now = new Date()
  const doc: BookingDoc = { ...input, createdAt: now, updatedAt: now }
  const res = await col.insertOne(doc)
  return toPublicBooking({ ...doc, _id: res.insertedId })
}

export async function getBookingsByUser(userId: string): Promise<PublicBooking[]> {
  const col = await bookingsCol()
  const docs = await col.find({ userId }).sort({ date: -1 }).toArray()
  return docs.map(toPublicBooking)
}

export async function getBookingById(id: string): Promise<PublicBooking | null> {
  if (!ObjectId.isValid(id)) return null
  const col = await bookingsCol()
  const doc = await col.findOne({ _id: new ObjectId(id) })
  return doc ? toPublicBooking(doc) : null
}

export async function cancelBooking(id: string, userId: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const col = await bookingsCol()
  const res = await col.updateOne(
    // Only a session that hasn't happened yet (IST) can be cancelled.
    {
      _id: new ObjectId(id),
      userId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: todayInIST() },
    },
    { $set: { status: "cancelled", updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

// Reserve an unpaid booking's slot for a fresh hold period - called when
// payment starts, so the hold lasts exactly as long as the payment link.
// Returns when the new hold ends.
export async function extendBookingHold(id: string): Promise<Date> {
  const holdUntil = new Date(Date.now() + BOOKING_HOLD_MINUTES * 60 * 1000)
  if (ObjectId.isValid(id)) {
    const col = await bookingsCol()
    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { holdUntil, updatedAt: new Date() } },
    )
  }
  return holdUntil
}

export async function rescheduleBooking(
  id: string,
  userId: string,
  newDate: string,
  newSlot: string,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const col = await bookingsCol()
  const res = await col.updateOne(
    { _id: new ObjectId(id), userId, status: { $in: ["pending", "confirmed"] } },
    { $set: { date: newDate, slot: newSlot, status: "rescheduled", updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

// Admin: list all bookings
export async function getAllBookings(
  options: { page?: number; limit?: number; status?: BookingStatus } = {},
): Promise<{ bookings: PublicBooking[]; total: number }> {
  const col = await bookingsCol()
  const { page = 1, limit = 20, status } = options
  const filter = status ? { status } : {}
  const [docs, total] = await Promise.all([
    col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    col.countDocuments(filter),
  ])
  return { bookings: docs.map(toPublicBooking), total }
}

// Public payment reference for a booking. The BK- prefix lets the shared
// payment webhook tell bookings apart from orders (IK-).
export function makeBookingReference(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  const stamp = Date.now().toString(36).slice(-4).toUpperCase()
  return `BK-${stamp}${rand}`
}

// Look up a booking by its payment reference (used by the payment webhook,
// which carries no user session).
export async function getBookingByReference(
  reference: string,
): Promise<PublicBooking | null> {
  const col = await bookingsCol()
  const doc = await col.findOne({ reference })
  return doc ? toPublicBooking(doc) : null
}

// Backfill a payment reference on a booking created before references existed.
export async function setBookingReference(id: string, reference: string): Promise<void> {
  if (!ObjectId.isValid(id)) return
  const col = await bookingsCol()
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { reference, updatedAt: new Date() } },
  )
}

// Atomically mark a booking paid. Returns true only if THIS call made the
// transition, so a duplicated webhook delivery can't fire side effects twice.
export async function markBookingPaidByReference(reference: string): Promise<boolean> {
  const col = await bookingsCol()
  const res = await col.updateOne(
    { reference, paymentStatus: { $ne: "paid" } },
    { $set: { paymentStatus: "paid", updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

// Admin: update booking status
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const col = await bookingsCol()
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

// Admin: attach the Google Meet link for a session and mark it confirmed.
// Returns the updated booking so the caller can email the link to the customer.
export async function confirmBookingWithMeeting(
  id: string,
  meetingUrl: string,
): Promise<PublicBooking | null> {
  if (!ObjectId.isValid(id)) return null
  const col = await bookingsCol()
  const doc = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        meetingUrl,
        status: "confirmed",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )
  return doc ? toPublicBooking(doc) : null
}

// Admin: set one date's slots, overriding the weekly hours for that date (an
// empty list closes the day).
export async function setAvailability(date: string, slots: string[]): Promise<void> {
  const col = await availabilityCol()
  await col.updateOne(
    { date },
    { $set: { date, slots, createdAt: new Date() } },
    { upsert: true },
  )
}

// Admin: drop a date's override so it follows the weekly hours again.
export async function deleteAvailability(date: string): Promise<void> {
  const col = await availabilityCol()
  await col.deleteOne({ date })
}

// Admin: the per-date overrides within a range.
export async function getAvailability(
  fromDate: string,
  toDate: string,
): Promise<PublicAvailability[]> {
  const col = await availabilityCol()
  const docs = await col.find({ date: { $gte: fromDate, $lte: toDate } }).sort({ date: 1 }).toArray()
  return docs.map(toPublicAvailability)
}
