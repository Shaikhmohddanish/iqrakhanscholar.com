import "server-only"
import type { ObjectId } from "mongodb"
import { getDb } from "./mongodb"
import { type ProductType, type PublicProduct, formatPrice } from "./product-types"

export { type ProductType, type PublicProduct, formatPrice }

export interface ProductDoc {
  _id?: ObjectId
  slug: string
  title: string
  category: string
  type: ProductType
  // price stored in integer cents to avoid floating point errors
  price: number
  currency: string
  image: string
  images?: string[]
  badge?: string
  rating: number
  reviews: number
  shortDescription: string
  description: string
  // digital-only: what the buyer receives
  highlights: string[]
  // physical-only stock count; null for digital (unlimited)
  stock: number | null
  featured: boolean
  // digital book fields
  author?: string
  pageCount?: number
  pdfPublicId?: string  // Cloudinary authenticated public_id — server-only, never sent to client
  createdAt: Date
  updatedAt: Date
}

export function toPublicProduct(doc: ProductDoc): PublicProduct {
  return {
    id: doc._id!.toString(),
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    type: doc.type,
    price: doc.price,
    currency: doc.currency,
    image: doc.image,
    images: doc.images ?? (doc.image ? [doc.image] : []),
    badge: doc.badge,
    rating: doc.rating,
    reviews: doc.reviews,
    shortDescription: doc.shortDescription,
    description: doc.description,
    highlights: doc.highlights,
    stock: doc.stock,
    featured: doc.featured,
    author: doc.author,
    pageCount: doc.pageCount,
    hasPdf: !!doc.pdfPublicId,  // pdfPublicId itself is never exposed to the client
  }
}

async function productsCol() {
  const db = await getDb()
  return db.collection<ProductDoc>("products")
}

export async function getAllProducts(): Promise<PublicProduct[]> {
  const col = await productsCol()
  const docs = await col.find({}).sort({ featured: -1, createdAt: 1 }).toArray()
  return docs.map(toPublicProduct)
}

export async function getProductsByType(type: ProductType): Promise<PublicProduct[]> {
  const col = await productsCol()
  const docs = await col.find({ type }).sort({ featured: -1, createdAt: 1 }).toArray()
  return docs.map(toPublicProduct)
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  const col = await productsCol()
  const doc = await col.findOne({ slug })
  return doc ? toPublicProduct(doc) : null
}

export async function getProductsByIds(ids: string[]): Promise<PublicProduct[]> {
  if (ids.length === 0) return []
  const col = await productsCol()
  const { ObjectId } = await import("mongodb")
  const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id))
  const docs = await col.find({ _id: { $in: objectIds } }).toArray()
  return docs.map(toPublicProduct)
}

export interface ProductQuery {
  page?: number
  limit?: number
  type?: string
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  sort?: string
  q?: string
}

export async function queryProducts(opts: ProductQuery = {}): Promise<{
  items: PublicProduct[]
  total: number
  hasMore: boolean
  page: number
}> {
  const { page = 1, limit = 8, type, categories, minPrice, maxPrice, sort = 'featured', q } = opts
  const col = await productsCol()

  const filter: Record<string, unknown> = {}
  if (type) filter.type = type
  if (categories && categories.length > 0) filter.category = { $in: categories }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {}
    if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice
    if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice
  }
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ title: re }, { category: re }, { shortDescription: re }]
  }

  const sortMap: Record<string, Record<string, number>> = {
    featured: { featured: -1, createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1, reviews: -1 },
    newest: { createdAt: -1 },
  }
  const mongoSort = sortMap[sort] ?? sortMap.featured

  const skip = (page - 1) * limit
  const [docs, total] = await Promise.all([
    col.find(filter).sort(mongoSort).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
  ])

  return {
    items: docs.map(toPublicProduct),
    total,
    hasMore: skip + docs.length < total,
    page,
  }
}

export async function getProductFacets(): Promise<{
  categories: string[]
  minPrice: number
  maxPrice: number
}> {
  const col = await productsCol()
  const [cats, priceAgg] = await Promise.all([
    col.distinct('category'),
    col.aggregate<{ min: number; max: number }>([
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]).toArray(),
  ])
  const min = priceAgg[0]?.min ?? 0
  const max = priceAgg[0]?.max ?? 10000
  return { categories: (cats as string[]).sort(), minPrice: min, maxPrice: max }
}

// Atomically decrement stock for a physical product, never below zero.
export async function decrementStock(productId: string, quantity: number): Promise<void> {
  const { ObjectId } = await import("mongodb")
  if (!ObjectId.isValid(productId)) return
  const col = await productsCol()
  await col.updateOne(
    { _id: new ObjectId(productId), type: "physical", stock: { $gte: quantity } },
    { $inc: { stock: -quantity }, $set: { updatedAt: new Date() } },
  )
}

const SEED_PRODUCTS: Omit<ProductDoc, "_id" | "createdAt" | "updatedAt">[] = [
  {
    slug: "the-art-of-khushu-in-salah",
    title: "The Art of Khushu in Salah",
    category: "Ebook",
    type: "digital",
    price: 1400,
    currency: "USD",
    image: "/product-ebook-salah.png",
    badge: "Bestseller",
    rating: 5,
    reviews: 218,
    shortDescription: "A practical guide to attaining presence and serenity in your prayer.",
    description:
      "Discover the lost art of khushuʿ — the deep stillness and presence that transforms salah from routine into a living conversation with Allah. Rooted in Quran and Sunnah, this ebook offers gentle, actionable practices to quiet the restless heart and pray with meaning.",
    highlights: [
      "120-page beautifully designed PDF",
      "Instant download to any device",
      "Daily practice framework & checklists",
      "Lifetime access and free updates",
    ],
    stock: null,
    featured: true,
  },
  {
    slug: "30-day-quran-reflection-journey",
    title: "30 Day Quran Reflection Journey",
    category: "Study Guide",
    type: "digital",
    price: 1900,
    currency: "USD",
    image: "/product-ebook-quran.png",
    rating: 5,
    reviews: 164,
    shortDescription: "A guided month of tadabbur to reconnect with the Book of Allah.",
    description:
      "A structured 30-day journey through selected passages of the Quran, with reflections, journaling prompts, and practical takeaways for each day. Designed to rebuild a consistent, heart-centred relationship with revelation.",
    highlights: [
      "30 daily reflection lessons",
      "Printable journaling worksheets",
      "Audio recitation companions",
      "Instant digital delivery",
    ],
    stock: null,
    featured: true,
  },
  {
    slug: "daily-duas-for-the-modern-muslim-woman",
    title: "Daily Duas for the Modern Muslim Woman",
    category: "Resource Pack",
    type: "digital",
    price: 900,
    currency: "USD",
    image: "/product-ebook-dua.png",
    badge: "New",
    rating: 5,
    reviews: 312,
    shortDescription: "A curated collection of authentic supplications for every day.",
    description:
      "A beautifully formatted resource pack of authentic duʿas drawn from the Quran and Sunnah, organised around the rhythms of a modern woman's day — from morning intentions to evening gratitude.",
    highlights: [
      "60+ authentic supplications",
      "Arabic, transliteration & translation",
      "Mobile & print-friendly layouts",
      "Instant digital delivery",
    ],
    stock: null,
    featured: false,
  },
  {
    slug: "becoming-her-faith-and-identity",
    title: "Becoming Her: Faith & Identity",
    category: "Hardcover Book",
    type: "physical",
    price: 2800,
    currency: "USD",
    image: "/product-book.png",
    badge: "Signed Edition",
    rating: 5,
    reviews: 96,
    shortDescription: "A signed hardcover on reclaiming faith, dignity, and purpose.",
    description:
      "A heartfelt hardcover exploring what it means to grow into your fullest self as a Muslim woman — anchored in faith, free of comparison, and rooted in purpose. This signed edition includes a personal handwritten note.",
    highlights: [
      "Premium hardcover, 240 pages",
      "Personally signed by Iqra Khan",
      "Ships worldwide",
      "Includes a keepsake bookmark",
    ],
    stock: 120,
    featured: true,
  },
  {
    slug: "gratitude-and-dhikr-journal",
    title: "Gratitude & Dhikr Journal",
    category: "Islamic Journal",
    type: "physical",
    price: 3200,
    currency: "USD",
    image: "/product-journal.png",
    rating: 5,
    reviews: 141,
    shortDescription: "A linen-bound journal to anchor daily gratitude and remembrance.",
    description:
      "A luxurious linen-bound journal with guided prompts for daily gratitude, dhikr tracking, and reflection. Designed to make remembrance of Allah a beautiful, lasting habit.",
    highlights: [
      "Hardback linen cover with gold foil",
      "180 guided pages",
      "Ribbon marker & elastic band",
      "Ships worldwide",
    ],
    stock: 200,
    featured: false,
  },
  {
    slug: "salah-and-intentions-planner",
    title: "Salah & Intentions Planner",
    category: "Daily Planner",
    type: "physical",
    price: 3600,
    currency: "USD",
    image: "/product-planner.png",
    badge: "Limited",
    rating: 5,
    reviews: 88,
    shortDescription: "A daily planner that places salah and intentions at the centre.",
    description:
      "A thoughtfully designed daily planner that organises your day around your five prayers and spiritual intentions — helping you stay productive without losing sight of what matters most.",
    highlights: [
      "Undated 12-month layout",
      "Prayer & habit trackers",
      "Gold spiral binding",
      "Limited first-print run",
    ],
    stock: 75,
    featured: false,
  },
]

// Idempotent seed: inserts catalog only if the collection is empty.
export async function seedProducts(): Promise<{ seeded: number }> {
  const col = await productsCol()
  await col.createIndex({ slug: 1 }, { unique: true })
  await col.createIndex({ type: 1 })
  const count = await col.countDocuments()
  if (count > 0) return { seeded: 0 }
  const now = new Date()
  const docs = SEED_PRODUCTS.map((p) => ({ ...p, createdAt: now, updatedAt: now }))
  await col.insertMany(docs as ProductDoc[])
  return { seeded: docs.length }
}
