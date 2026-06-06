import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"
import type { ProductType } from "./product-types"

export type OrderStatus = "processing" | "fulfilled" | "cancelled"
export type PaymentStatus = "paid" | "pending" | "failed"

export interface OrderItem {
  productId: string
  slug: string
  title: string
  image: string
  price: number // unit price in cents at time of purchase
  type: ProductType
  quantity: number
}

export interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface OrderDoc {
  _id?: ObjectId
  // human-friendly order number
  reference: string
  userId: string
  email: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  // present only when the order contains physical goods
  shippingAddress?: ShippingAddress | null
  hasDigital: boolean
  hasPhysical: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PublicOrder extends Omit<OrderDoc, "_id"> {
  id: string
}

function toPublicOrder(doc: WithId<OrderDoc>): PublicOrder {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

async function ordersCol() {
  const db = await getDb()
  return db.collection<OrderDoc>("orders")
}

function makeReference(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  const stamp = Date.now().toString(36).slice(-4).toUpperCase()
  return `IK-${stamp}${rand}`
}

export async function createOrder(
  input: Omit<OrderDoc, "_id" | "reference" | "createdAt" | "updatedAt">,
): Promise<PublicOrder> {
  const col = await ordersCol()
  await col.createIndex({ userId: 1, createdAt: -1 })
  const now = new Date()
  const doc: OrderDoc = {
    ...input,
    reference: makeReference(),
    createdAt: now,
    updatedAt: now,
  }
  const res = await col.insertOne(doc)
  return toPublicOrder({ ...doc, _id: res.insertedId })
}

export async function getOrdersByUser(userId: string): Promise<PublicOrder[]> {
  const col = await ordersCol()
  const docs = await col.find({ userId }).sort({ createdAt: -1 }).toArray()
  return docs.map(toPublicOrder)
}

export async function getOrderById(id: string, userId: string): Promise<PublicOrder | null> {
  if (!ObjectId.isValid(id)) return null
  const col = await ordersCol()
  const doc = await col.findOne({ _id: new ObjectId(id), userId })
  return doc ? toPublicOrder(doc) : null
}

// Returns the set of product ids the user has purchased (paid) — used by the digital library.
export async function getPurchasedProductIds(userId: string): Promise<string[]> {
  const col = await ordersCol()
  const docs = await col.find({ userId, paymentStatus: "paid" }).project({ items: 1 }).toArray()
  const ids = new Set<string>()
  for (const d of docs as unknown as { items: OrderItem[] }[]) {
    for (const item of d.items) {
      if (item.type === "digital") ids.add(item.productId)
    }
  }
  return [...ids]
}
