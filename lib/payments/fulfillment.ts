import "server-only"
import { getOrderByReference, markOrderPaidByReference } from "@/lib/orders"
import { decrementStock } from "@/lib/products"
import { createNotification } from "@/lib/notifications"
import { sendOrderConfirmationEmail } from "@/lib/email"
import { formatPrice } from "@/lib/product-types"
import { SITE_URL } from "@/lib/site-config"

// Idempotently mark an order paid and run post-payment side effects exactly
// once. Safe to call from both the success redirect and a (possibly duplicated)
// webhook delivery - the atomic paid transition guards against double work.
export async function confirmOrderPaid(reference: string): Promise<boolean> {
  const order = await getOrderByReference(reference)
  if (!order) return false

  const transitioned = await markOrderPaidByReference(reference)
  // Already paid: a duplicate webhook delivery or a second browser return.
  // Returning early is what keeps stock from being decremented twice and the
  // customer from being emailed twice.
  if (!transitioned) return order.paymentStatus === "paid"

  // Decrement stock for physical items now that payment is confirmed.
  await Promise.all(
    order.items
      .filter((i) => i.type === "physical")
      .map((i) => decrementStock(i.productId, i.quantity)),
  )

  // Confirmation email. Before this, a customer who bought an e-book received
  // nothing at all - no receipt and no access link - so their only route to
  // what they'd paid for was to find the library themselves.
  //
  // Deliberately not awaited in a way that can fail the transition: the order
  // is already paid and fulfilled by this point, so a mail outage must not
  // make the webhook return an error and invite endless retries.
  try {
    await sendOrderConfirmationEmail({
      to: order.email,
      reference: order.reference,
      items: order.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        type: i.type,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      currency: order.currency,
      hasDigital: order.hasDigital,
      hasPhysical: order.hasPhysical,
      shippingAddress: order.shippingAddress ?? null,
      orderUrl: `${SITE_URL}/order/${order.id}`,
      libraryUrl: `${SITE_URL}/account/library`,
      format: (minor: number) => formatPrice(minor, order.currency),
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[fulfillment] order email failed for ${reference}:`, err)
  }

  // In-app notification, so the confirmation is visible even if the email is
  // filtered or the address is wrong.
  try {
    await createNotification({
      userId: order.userId,
      type: "order",
      title: "Order confirmed",
      body: order.hasDigital
        ? `Order ${order.reference} is confirmed. Your digital items are unlocked in your library.`
        : `Order ${order.reference} is confirmed. We'll let you know when it ships.`,
      link: `/order/${order.id}`,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[fulfillment] notification failed for ${reference}:`, err)
  }

  return true
}
