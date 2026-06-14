import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"
import type { SessionType, BookingStatus, BookingPaymentStatus, PublicBooking, PublicAvailability } from "./booking-types"

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
  createdAt: Date
  updatedAt: Date
}

export interface AvailabilityDoc {
  _id?: ObjectId
  date: string // YYYY-MM-DD
  slots: string[] // HH:MM
  createdAt: Date
}

function toPublicBooking(doc: WithId<BookingDoc>): PublicBooking {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

function toPublicAvailability(doc: WithId<AvailabilityDoc>): PublicAvailability {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

async function bookingsCol() {
  const db = await getDb()
  const col = db.collection<BookingDoc>("bookings")
  await col.createIndex({ userId: 1, date: -1 })
  await col.createIndex({ date: 1, slot: 1 })
  return col
}

async function availabilityCol() {
  const db = await getDb()
  const col = db.collection<AvailabilityDoc>("availability")
  await col.createIndex({ date: 1 }, { unique: true })
  return col
}

// Returns dates (YYYY-MM-DD) that have at least one open slot in the next 60 days
export async function getAvailableDates(): Promise<string[]> {
  const col = await availabilityCol()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() + 60)

  const todayStr = today.toISOString().slice(0, 10)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  const docs = await col
    .find({ date: { $gte: todayStr, $lte: cutoffStr } })
    .sort({ date: 1 })
    .toArray()

  // Filter out dates that are fully booked
  const bookingsDb = await bookingsCol()
  const bookedMap: Record<string, Set<string>> = {}
  const confirmedBookings = await bookingsDb
    .find({
      date: { $gte: todayStr, $lte: cutoffStr },
      status: { $nin: ["cancelled"] },
    })
    .project({ date: 1, slot: 1 })
    .toArray()

  for (const b of confirmedBookings as unknown as { date: string; slot: string }[]) {
    if (!bookedMap[b.date]) bookedMap[b.date] = new Set()
    bookedMap[b.date].add(b.slot)
  }

  return docs
    .filter((d) => {
      const booked = bookedMap[d.date]
      const available = d.slots.filter((s) => !booked?.has(s))
      return available.length > 0
    })
    .map((d) => d.date)
}

// Returns available time slots for a given date
export async function getAvailableSlots(date: string): Promise<string[]> {
  const col = await availabilityCol()
  const avail = await col.findOne({ date })
  if (!avail) return []

  const bookingsDb = await bookingsCol()
  const booked = await bookingsDb
    .find({ date, status: { $nin: ["cancelled"] } })
    .project({ slot: 1 })
    .toArray()
  const bookedSlots = new Set((booked as unknown as { slot: string }[]).map((b) => b.slot))

  return avail.slots.filter((s) => !bookedSlots.has(s))
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
    { _id: new ObjectId(id), userId, status: { $in: ["pending", "confirmed"] } },
    { $set: { status: "cancelled", updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
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

// Admin: get/set availability
export async function setAvailability(date: string, slots: string[]): Promise<void> {
  const col = await availabilityCol()
  await col.updateOne(
    { date },
    { $set: { date, slots, createdAt: new Date() } },
    { upsert: true },
  )
}

export async function getAvailability(
  fromDate: string,
  toDate: string,
): Promise<PublicAvailability[]> {
  const col = await availabilityCol()
  const docs = await col.find({ date: { $gte: fromDate, $lte: toDate } }).sort({ date: 1 }).toArray()
  return docs.map(toPublicAvailability)
}

// Seed default availability (next 30 weekdays, 9am–5pm slots)
export async function seedAvailability(): Promise<{ seeded: number }> {
  const col = await availabilityCol()
  const count = await col.countDocuments()
  if (count > 0) return { seeded: 0 }

  const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  const records: Omit<AvailabilityDoc, "_id">[] = []
  const today = new Date()

  let added = 0
  let cursor = new Date(today)
  cursor.setDate(cursor.getDate() + 1)

  while (added < 30) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) {
      records.push({ date: cursor.toISOString().slice(0, 10), slots, createdAt: new Date() })
      added++
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  if (records.length > 0) await col.insertMany(records)
  return { seeded: records.length }
}
