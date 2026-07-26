import { type NextRequest, NextResponse } from "next/server"
import { razorpayProvider } from "@/lib/payments/razorpay"
import { confirmOrderPaid } from "@/lib/payments/fulfillment"

// Razorpay posts payment events here. We verify the X-Razorpay-Signature against
// the raw body and only fulfill the order on a verified paid event.
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  try {
    const result = await razorpayProvider.verifyWebhook(rawBody, req.headers)
    if (result?.paid) {
      await confirmOrderPaid(result.reference)
    }
  } catch (err) {
    console.error("Razorpay webhook error", err)
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 400 })
  }
  return NextResponse.json({ received: true })
}
