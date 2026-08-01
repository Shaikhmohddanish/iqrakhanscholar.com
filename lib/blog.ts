import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"
import type { BlogPostItem } from "./blog-list"

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

// Maps a full article to the lightweight shape the blog list/grid UI consumes.
export function toBlogListItem(a: PublicArticle): BlogPostItem {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    readTime: `${a.readingTime} min read`,
    excerpt: a.excerpt,
    image: a.coverImage || "/placeholder.svg",
  }
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
  q?: string
} = {}): Promise<{ articles: PublicArticle[]; total: number }> {
  const col = await articlesCol()
  const { category, limit = 12, page = 1, q } = options
  const filter: Record<string, unknown> = { status: "published" }
  if (category && category !== "All") filter.category = category
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    filter.$or = [{ title: re }, { excerpt: re }, { tags: re }]
  }
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
