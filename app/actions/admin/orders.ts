"use server"

import { requireRole } from "@/lib/session"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { OrderStatus, PaymentStatus } from "@/lib/orders"
import { refundPayment, getPaidPaymentIdForLink } from "@/lib/payments/razorpay"
import { setRefundRequestStatus } from "@/lib/refunds"
import { createNotification } from "@/lib/notifications"
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

/**
 * Refund an order through the payment gateway, then record it.
 *
 * This used to only flip `paymentStatus` to "refunded" in Mongo with no
 * gateway call at all: the order read as refunded while the money stayed in
 * the Razorpay account. The database is now updated ONLY after Razorpay
 * confirms the refund, so the two can't disagree in the direction that hurts
 * the customer.
 */
export async function processRefundAction(id: string) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  if (!ObjectId.isValid(id)) return { error: "Invalid ID" }

  const order = await getOrderByIdAdmin(id)
  if (!order) return { error: "Order not found." }
  if (order.paymentStatus === "refunded") {
    return { error: "This order has already been refunded." }
  }
  if (order.paymentStatus !== "paid") {
    return { error: "Only a paid order can be refunded." }
  }

  let refundRef: string | null = null

  if (order.paymentProvider === "razorpay" && order.providerRef) {
    try {
      const paymentId = await getPaidPaymentIdForLink(order.providerRef)
      if (!paymentId) {
        return {
          error:
            "Couldn't find the captured payment at Razorpay. Refund it from the Razorpay dashboard, then mark this order refunded there.",
        }
      }
      const refund = await refundPayment({
        paymentId,
        amount: order.total,
        notes: { reference: order.reference },
      })
      refundRef = refund.id
    } catch (err) {
      console.error("Razorpay refund failed", err)
      return {
        error:
          "Razorpay rejected the refund. Nothing has been changed — check the Razorpay dashboard and try again.",
      }
    }
  } else if (order.paymentProvider && order.paymentProvider !== "simulated") {
    return {
      error: `Automatic refunds aren't wired up for ${order.paymentProvider}. Refund it in that dashboard first.`,
    }
  }

  const db = await getDb()
  await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "cancelled",
        paymentStatus: "refunded" as PaymentStatus, // now a real member of the union
        ...(refundRef ? { refundRef } : {}),
        updatedAt: new Date(),
      },
    },
  )

  // Close any open customer request against this order, and tell them.
  await setRefundRequestStatus(id, "refunded")
  try {
    await createNotification({
      userId: order.userId,
      type: "order",
      title: "Refund issued",
      body: `Your refund for order ${order.reference} has been issued. It can take 5-7 working days to appear on your statement.`,
      link: `/order/${id}`,
    })
  } catch (err) {
    console.error("Refund notification failed", err)
  }

  revalidatePath("/admin/orders")
  revalidatePath("/account/orders")
  return { ok: true }
}

// Admin lookup: no userId scoping, unlike getOrderById.
async function getOrderByIdAdmin(id: string) {
  const db = await getDb()
  const doc = await db.collection("orders").findOne({ _id: new ObjectId(id) })
  if (!doc) return null
  return {
    userId: doc.userId as string,
    reference: doc.reference as string,
    total: doc.total as number,
    currency: doc.currency as string,
    paymentStatus: doc.paymentStatus as PaymentStatus,
    paymentProvider: doc.paymentProvider as string | undefined,
    providerRef: doc.providerRef as string | undefined,
  }
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
