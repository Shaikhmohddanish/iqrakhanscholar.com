"use server"

import { requireUser } from "@/lib/session"
import { getOrderById } from "@/lib/orders"
import { createRefundRequest } from "@/lib/refunds"
import { sendContactEmail } from "@/lib/email"
import { formatPrice } from "@/lib/product-types"
import { revalidatePath } from "next/cache"

/**
 * Record a customer's refund request and tell Iqra about it.
 *
 * The modal that called this used to be `await new Promise(r =>
 * setTimeout(r, 800))` followed by a success message. The reason the customer
 * typed was discarded, nothing was written anywhere, and nobody was notified -
 * while /refund-policy instructs customers to "submit a refund request through
 * your Orders page". Every request made this way was silently lost.
 */
export async function requestRefundAction(orderId: string, reason: string) {
  const user = await requireUser()
  if (!user) return { error: "Please sign in to request a refund." }

  const trimmed = reason.trim().slice(0, 2000)
  if (!trimmed) return { error: "Please tell us why you'd like a refund." }

  // Scoped to this user, so one customer can't open a request against
  // another's order.
  const order = await getOrderById(orderId, user.id)
  if (!order) return { error: "Order not found." }

  // Covers pending, failed and already-refunded in one check: only a paid
  // order has anything to give back.
  if (order.paymentStatus === "refunded") {
    return { error: "This order has already been refunded." }
  }
  if (order.paymentStatus !== "paid") {
    return { error: "This order hasn't been paid, so there's nothing to refund." }
  }

  const existing = await createRefundRequest({
    orderId: order.id,
    orderReference: order.reference,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    amount: order.total,
    currency: order.currency,
    reason: trimmed,
  })
  if (!existing.created) {
    return { error: "You've already requested a refund for this order. We'll be in touch." }
  }

  // Reuses the contact-email path, which already delivers to the site owner.
  try {
    await sendContactEmail({
      name: user.name,
      email: user.email,
      subject: `Refund request — order ${order.reference} (${formatPrice(order.total, order.currency)})`,
      message: `${user.name} <${user.email}> has requested a refund.

Order:  ${order.reference}
Amount: ${formatPrice(order.total, order.currency)}
Items:  ${order.items.map((i) => `${i.title} x${i.quantity}`).join(", ")}

Reason given:
${trimmed}

Process it in the admin orders page.`,
    })
  } catch (err) {
    // The request is already persisted, so a mail failure must not lose it or
    // show the customer an error.
    // eslint-disable-next-line no-console
    console.error(`[refund] notification email failed for ${order.reference}:`, err)
  }

  revalidatePath("/account/orders")
  return { ok: true }
}
