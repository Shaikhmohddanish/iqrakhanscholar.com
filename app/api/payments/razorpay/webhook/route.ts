import { type NextRequest, NextResponse } from "next/server"
import { razorpayProvider } from "@/lib/payments/razorpay"
import { confirmOrderPaid } from "@/lib/payments/fulfillment"
import { markOrderFailedByReference } from "@/lib/orders"

// Razorpay posts payment events here. We verify the X-Razorpay-Signature against
// the raw body and only act on a verified event.
//
// Note `req.text()` rather than `req.json()`: the HMAC is computed over the
// exact bytes Razorpay sent, so the body must not be re-serialised first.
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  try {
    const result = await razorpayProvider.verifyWebhook(rawBody, req.headers)
    if (result?.paid) {
      // Idempotent: a duplicate delivery won't re-decrement stock or re-send
      // the confirmation email.
      await confirmOrderPaid(result.reference)
    } else if (result && !result.paid) {
      // A declined, cancelled or expired payment. Without this the order sat
      // as "pending" forever.
      await markOrderFailedByReference(result.reference)
    }
  } catch (err) {
    console.error("Razorpay webhook error", err)
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 400 })
  }
  // 200 for unrecognised or unverified events too: Razorpay retries on
  // non-2xx, and retrying an event we will never act on just generates noise.
  return NextResponse.json({ received: true })
}
