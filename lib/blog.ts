import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"

export type ArticleStatus = "draft" | "published"

export interface ArticleDoc {
  _id?: ObjectId
  title: string
  slug: string
  excerpt: string
  content: string // HTML/markdown
  coverImage: string
  category: string
  tags: string[]
  author: string
  authorId: string
  status: ArticleStatus
  publishedAt?: Date | null
  readingTime: number // minutes
  createdAt: Date
  updatedAt: Date
}

export interface PublicArticle extends Omit<ArticleDoc, "_id"> {
  id: string
}

function toPublic(doc: WithId<ArticleDoc>): PublicArticle {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

async function articlesCol() {
  const db = await getDb()
  const col = db.collection<ArticleDoc>("articles")
  await col.createIndex({ slug: 1 }, { unique: true })
  await col.createIndex({ status: 1, publishedAt: -1 })
  return col
}

export async function getPublishedArticles(options: {
  category?: string
  limit?: number
  page?: number
} = {}): Promise<{ articles: PublicArticle[]; total: number }> {
  const col = await articlesCol()
  const { category, limit = 12, page = 1 } = options
  const filter: Record<string, unknown> = { status: "published" }
  if (category) filter.category = category
  const [docs, total] = await Promise.all([
    col.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    col.countDocuments(filter),
  ])
  return { articles: docs.map(toPublic), total }
}

export async function getArticleBySlug(slug: string): Promise<PublicArticle | null> {
  const col = await articlesCol()
  const doc = await col.findOne({ slug, status: "published" })
  return doc ? toPublic(doc) : null
}

export async function getAllArticles(options: {
  page?: number
  limit?: number
  status?: ArticleStatus
} = {}): Promise<{ articles: PublicArticle[]; total: number }> {
  const col = await articlesCol()
  const { page = 1, limit = 20, status } = options
  const filter = status ? { status } : {}
  const [docs, total] = await Promise.all([
    col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    col.countDocuments(filter),
  ])
  return { articles: docs.map(toPublic), total }
}

export async function getArticleById(id: string): Promise<PublicArticle | null> {
  if (!ObjectId.isValid(id)) return null
  const col = await articlesCol()
  const doc = await col.findOne({ _id: new ObjectId(id) })
  return doc ? toPublic(doc) : null
}

export async function createArticle(
  input: Omit<ArticleDoc, "_id" | "createdAt" | "updatedAt">,
): Promise<PublicArticle> {
  const col = await articlesCol()
  const now = new Date()
  const doc: ArticleDoc = { ...input, createdAt: now, updatedAt: now }
  const res = await col.insertOne(doc)
  return toPublic({ ...doc, _id: res.insertedId })
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<ArticleDoc, "_id" | "createdAt">>,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const col = await articlesCol()
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const col = await articlesCol()
  const res = await col.deleteOne({ _id: new ObjectId(id) })
  return res.deletedCount > 0
}

export async function getArticleCategories(): Promise<string[]> {
  const col = await articlesCol()
  const cats = await col.distinct("category")
  return cats.filter(Boolean) as string[]
}

// Seed sample articles if empty
export async function seedArticles(): Promise<{ seeded: number }> {
  const col = await articlesCol()
  const count = await col.countDocuments()
  if (count > 0) return { seeded: 0 }
  const now = new Date()
  const articles: Omit<ArticleDoc, "_id">[] = [
    {
      title: "The Power of Istighfar: How Seeking Forgiveness Transforms Your Heart",
      slug: "power-of-istighfar",
      excerpt: "Discover how the simple act of seeking Allah's forgiveness can transform your heart and open doors you never imagined.",
      content: "<p>Istighfar - seeking forgiveness from Allah - is one of the most powerful acts of worship a Muslim can engage in...</p>",
      coverImage: "/placeholder.svg",
      category: "Spirituality",
      tags: ["istighfar", "tawbah", "heart", "worship"],
      author: "Iqra Khan",
      authorId: "admin",
      status: "published",
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      readingTime: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "5 Morning Adhkar That Will Change Your Day",
      slug: "morning-adhkar-change-your-day",
      excerpt: "Start your day with these five powerful morning remembrances and experience the difference in your life.",
      content: "<p>The Prophet ﷺ taught us specific adhkar to recite in the morning...</p>",
      coverImage: "/placeholder.svg",
      category: "Dua & Dhikr",
      tags: ["adhkar", "morning", "dhikr", "sunnah"],
      author: "Iqra Khan",
      authorId: "admin",
      status: "published",
      publishedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      readingTime: 4,
      createdAt: now,
      updatedAt: now,
    },
  ]
  await col.insertMany(articles as ArticleDoc[])
  return { seeded: articles.length }
}
