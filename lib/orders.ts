import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"
import type { OrderStatus, PaymentStatus, PaymentProviderName, OrderItem, ShippingAddress, PublicOrder } from "./order-types"

export type { OrderStatus, PaymentStatus, PaymentProviderName, OrderItem, ShippingAddress, PublicOrder }

export interface OrderDoc {
  _id?: ObjectId
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
  paymentProvider?: PaymentProviderName
  providerRef?: string
  shippingAddress?: ShippingAddress | null
  hasDigital: boolean
  hasPhysical: boolean
  createdAt: Date
  updatedAt: Date
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

// Look up an order by its public reference (used by payment webhooks, which
// don't carry a user session).
export async function getOrderByReference(reference: string): Promise<PublicOrder | null> {
  const col = await ordersCol()
  const doc = await col.findOne({ reference })
  return doc ? toPublicOrder(doc) : null
}

// Record which provider is handling payment and its provider-side reference.
export async function setOrderProvider(
  reference: string,
  provider: PaymentProviderName,
  providerRef?: string,
): Promise<void> {
  const col = await ordersCol()
  await col.updateOne(
    { reference },
    { $set: { paymentProvider: provider, providerRef, updatedAt: new Date() } },
  )
}

// Atomically transition an order to "paid". Returns true only if THIS call made
// the transition, so callers can run fulfillment side effects exactly once even
// if a webhook is delivered more than once.
export async function markOrderPaidByReference(reference: string): Promise<boolean> {
  const col = await ordersCol()
  const res = await col.updateOne(
    { reference, paymentStatus: { $ne: "paid" } },
    { $set: { paymentStatus: "paid", updatedAt: new Date() } },
  )
  return res.modifiedCount > 0
}

// Returns the set of product ids the user has purchased (paid) - used by the digital library.
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

// Returns the set of product slugs the user has purchased - used by the PDF reader.
export async function getPurchasedProductSlugs(userId: string): Promise<string[]> {
  const col = await ordersCol()
  const docs = await col.find({ userId, paymentStatus: "paid" }).project({ items: 1 }).toArray()
  const slugs = new Set<string>()
  for (const d of docs as unknown as { items: OrderItem[] }[]) {
    for (const item of d.items) {
      if (item.type === "digital") slugs.add(item.slug)
    }
  }
  return [...slugs]
}
