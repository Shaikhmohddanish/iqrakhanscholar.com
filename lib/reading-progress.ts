import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"

export interface ProgressDoc {
  _id?: ObjectId
  userId: string
  bookId: string
  currentPage: number
  totalPages: number
  bookmarks: number[]
  updatedAt: Date
}

export interface PublicProgress {
  bookId: string
  currentPage: number
  totalPages: number
  bookmarks: number[]
  percentComplete: number
  updatedAt: Date
}

function toPublic(doc: WithId<ProgressDoc>): PublicProgress {
  const pct = doc.totalPages > 0 ? Math.round((doc.currentPage / doc.totalPages) * 100) : 0
  return {
    bookId: doc.bookId,
    currentPage: doc.currentPage,
    totalPages: doc.totalPages,
    bookmarks: doc.bookmarks,
    percentComplete: pct,
    updatedAt: doc.updatedAt,
  }
}

async function progressCol() {
  const db = await getDb()
  const col = db.collection<ProgressDoc>("reading_progress")
  await col.createIndex({ userId: 1, bookId: 1 }, { unique: true })
  return col
}

export async function getProgress(userId: string, bookId: string): Promise<PublicProgress | null> {
  const col = await progressCol()
  const doc = await col.findOne({ userId, bookId })
  return doc ? toPublic(doc) : null
}

export async function getAllProgress(userId: string): Promise<PublicProgress[]> {
  const col = await progressCol()
  const docs = await col.find({ userId }).toArray()
  return docs.map(toPublic)
}

export async function saveProgress(
  userId: string,
  bookId: string,
  currentPage: number,
  totalPages: number,
): Promise<void> {
  const col = await progressCol()
  await col.updateOne(
    { userId, bookId },
    {
      $set: { currentPage, totalPages, updatedAt: new Date() },
      $setOnInsert: { bookmarks: [] } as Partial<ProgressDoc>,
    },
    { upsert: true },
  )
}

export async function toggleBookmarkDb(
  userId: string,
  bookId: string,
  page: number,
): Promise<{ bookmarks: number[] }> {
  const col = await progressCol()
  const doc = await col.findOne({ userId, bookId })
  const current = doc?.bookmarks ?? []
  const has = current.includes(page)

  const newBookmarks = has
    ? current.filter((p) => p !== page)
    : [...current, page].sort((a, b) => a - b)

  await col.updateOne(
    { userId, bookId },
    {
      $set: { bookmarks: newBookmarks, updatedAt: new Date() },
      $setOnInsert: {
        currentPage: page,
        totalPages: 0,
      } as Partial<ProgressDoc>,
    },
    { upsert: true },
  )

  return { bookmarks: newBookmarks }
}
