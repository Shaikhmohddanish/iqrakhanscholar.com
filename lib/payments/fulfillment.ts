import "server-only"
import { getOrderByReference, markOrderPaidByReference } from "@/lib/orders"
import { decrementStock } from "@/lib/products"

// Idempotently mark an order paid and run post-payment side effects exactly
// once. Safe to call from both the success redirect and a (possibly duplicated)
// webhook delivery - the atomic paid transition guards against double work.
export async function confirmOrderPaid(reference: string): Promise<boolean> {
  const order = await getOrderByReference(reference)
  if (!order) return false

  const transitioned = await markOrderPaidByReference(reference)
  if (!transitioned) return order.paymentStatus === "paid"

  // Decrement stock for physical items now that payment is confirmed.
  await Promise.all(
    order.items
      .filter((i) => i.type === "physical")
      .map((i) => decrementStock(i.productId, i.quantity)),
  )
  return true
}
