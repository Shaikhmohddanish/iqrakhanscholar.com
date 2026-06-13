import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"

export interface WishlistDoc {
  _id?: ObjectId
  userId: string
  productIds: string[]
  updatedAt: Date
}

function toPublicWishlist(doc: WithId<WishlistDoc>): { userId: string; productIds: string[] } {
  return { userId: doc.userId, productIds: doc.productIds }
}

async function wishlistCol() {
  const db = await getDb()
  const col = db.collection<WishlistDoc>("wishlists")
  await col.createIndex({ userId: 1 }, { unique: true })
  return col
}

export async function getWishlist(userId: string): Promise<string[]> {
  const col = await wishlistCol()
  const doc = await col.findOne({ userId })
  return doc?.productIds ?? []
}

export async function toggleWishlist(userId: string, productId: string): Promise<{ added: boolean }> {
  const col = await wishlistCol()
  const doc = await col.findOne({ userId })
  const current = doc?.productIds ?? []
  const isInList = current.includes(productId)

  if (isInList) {
    await col.updateOne(
      { userId },
      { $pull: { productIds: productId }, $set: { updatedAt: new Date() } },
    )
    return { added: false }
  } else {
    await col.updateOne(
      { userId },
      {
        $addToSet: { productIds: productId },
        $set: { updatedAt: new Date() },
      },
      { upsert: true },
    )
    return { added: true }
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const col = await wishlistCol()
  await col.updateOne(
    { userId },
    { $pull: { productIds: productId }, $set: { updatedAt: new Date() } },
  )
}

export async function clearWishlist(userId: string): Promise<void> {
  const col = await wishlistCol()
  await col.updateOne({ userId }, { $set: { productIds: [], updatedAt: new Date() } })
}
