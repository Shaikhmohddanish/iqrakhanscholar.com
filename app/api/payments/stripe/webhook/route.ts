import { type NextRequest, NextResponse } from "next/server"
import { stripeProvider } from "@/lib/payments/stripe"
import { confirmOrderPaid } from "@/lib/payments/fulfillment"

// Stripe sends the signed event here. We verify the signature against the raw
// body and only fulfill the order on a verified paid event.
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  try {
    const result = await stripeProvider.verifyWebhook(rawBody, req.headers)
    if (result?.paid) {
      await confirmOrderPaid(result.reference)
    }
  } catch (err) {
    console.error("Stripe webhook error", err)
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 400 })
  }
  return NextResponse.json({ received: true })
}
