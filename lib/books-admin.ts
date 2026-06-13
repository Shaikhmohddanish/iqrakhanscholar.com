import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"

export interface BookDoc {
  _id?: ObjectId
  slug: string
  title: string
  author: string
  description: string
  coverImage: string
  category: string
  tags: string[]
  price: number
  currency: string
  pageCount: number
  rating: number
  reviews: number
  pdfPath?: string
  pdfPublicId?: string
  featured: boolean
  status: "draft" | "published"
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface PublicBookAdmin extends Omit<BookDoc, "_id"> {
  id: string
}

function toPublic(doc: WithId<BookDoc>): PublicBookAdmin {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

async function booksCol() {
  const db = await getDb()
  const col = db.collection<BookDoc>("books")
  await col.createIndex({ slug: 1 }, { unique: true })
  return col
}

export async function getAllBooksAdmin(options: {
  page?: number
  limit?: number
} = {}): Promise<{ books: PublicBookAdmin[]; total: number }> {
  const col = await booksCol()
  const { page = 1, limit = 20 } = options
  const [docs, total] = await Promise.all([
    col.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    col.countDocuments(),
  ])
  return { books: docs.map(toPublic), total }
}

export async function getBookAdminById(id: string): Promise<PublicBookAdmin | null> {
  if (!ObjectId.isValid(id)) return null
  const col = await booksCol()
  const doc = await col.findOne({ _id: new ObjectId(id) })
  return doc ? toPublic(doc) : null
}

export async function createBook(
  input: Omit<BookDoc, "_id" | "createdAt" | "updatedAt">,
): Promise<PublicBookAdmin> {
  const col = await booksCol()
  const now = new Date()
  const doc: BookDoc = { ...input, createdAt: now, updatedAt: now }
  const res = await col.insertOne(doc)
  return toPublic({ ...doc, _id: res.insertedId })
}

export async function updateBook(
  id: string,
  data: Partial<Omit<BookDoc, "_id" | "createdAt">>,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const col = await booksCol()
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

export async function deleteBook(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const col = await booksCol()
  const res = await col.deleteOne({ _id: new ObjectId(id) })
  return res.deletedCount > 0
}
