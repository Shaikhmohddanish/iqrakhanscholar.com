import "server-only"
import { ObjectId } from "mongodb"
import { getDb } from "./mongodb"
import type { ProductDoc } from "./products"
import { toPublicProduct } from "./products"
import type { PublicProduct } from "./product-types"

export async function getAllProductsAdmin(options: {
  page?: number
  limit?: number
} = {}): Promise<{ products: PublicProduct[]; total: number }> {
  const db = await getDb()
  const col = db.collection<ProductDoc>("products")
  const { page = 1, limit = 20 } = options
  const [docs, total] = await Promise.all([
    col.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    col.countDocuments(),
  ])
  return { products: docs.map(toPublicProduct), total }
}

export async function createProduct(
  input: Omit<ProductDoc, "_id" | "createdAt" | "updatedAt">,
): Promise<PublicProduct> {
  const db = await getDb()
  const col = db.collection<ProductDoc>("products")
  const now = new Date()
  const doc = { ...input, createdAt: now, updatedAt: now }
  const res = await col.insertOne(doc as ProductDoc)
  return toPublicProduct({ ...doc, _id: res.insertedId } as ProductDoc & { _id: ObjectId })
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<ProductDoc, "_id" | "createdAt">>,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const col = db.collection<ProductDoc>("products")
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const col = db.collection<ProductDoc>("products")
  const res = await col.deleteOne({ _id: new ObjectId(id) })
  return res.deletedCount > 0
}

export async function getProductAdminById(id: string): Promise<PublicProduct | null> {
  if (!ObjectId.isValid(id)) return null
  const db = await getDb()
  const col = db.collection<ProductDoc>("products")
  const doc = await col.findOne({ _id: new ObjectId(id) })
  return doc ? toPublicProduct(doc) : null
}

// Dashboard aggregates
export async function getProductStats(): Promise<{
  total: number
  digital: number
  physical: number
  outOfStock: number
}> {
  const db = await getDb()
  const col = db.collection<ProductDoc>("products")
  const [total, digital, physical, outOfStock] = await Promise.all([
    col.countDocuments(),
    col.countDocuments({ type: "digital" }),
    col.countDocuments({ type: "physical" }),
    col.countDocuments({ type: "physical", stock: { $lte: 0 } }),
  ])
  return { total, digital, physical, outOfStock }
}
