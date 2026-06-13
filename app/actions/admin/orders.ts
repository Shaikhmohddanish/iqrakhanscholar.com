"use server"

import { requireRole } from "@/lib/session"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { OrderStatus, PaymentStatus } from "@/lib/orders"
import { revalidatePath } from "next/cache"

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  if (!ObjectId.isValid(id)) return { error: "Invalid ID" }

  const db = await getDb()
  await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
  )
  revalidatePath("/admin/orders")
  return { ok: true }
}

export async function processRefundAction(id: string) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  if (!ObjectId.isValid(id)) return { error: "Invalid ID" }

  const db = await getDb()
  await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "cancelled", paymentStatus: "refunded" as PaymentStatus, updatedAt: new Date() } },
  )
  revalidatePath("/admin/orders")
  return { ok: true }
}

export async function getAllOrdersAction(options: { page?: number; limit?: number } = {}) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }

  const db = await getDb()
  const col = db.collection("orders")
  const { page = 1, limit = 20 } = options
  const [docs, total] = await Promise.all([
    col.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    col.countDocuments(),
  ])
  return {
    orders: docs.map((d) => ({ ...d, id: d._id.toString(), _id: undefined })),
    total,
  }
}
