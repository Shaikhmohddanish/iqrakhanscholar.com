import "server-only"
import crypto from "crypto"
import type { PaymentProvider } from "./types"

const STRIPE_API = "https://api.stripe.com/v1"

function secretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured")
  return key
}

// Stripe Checkout via the REST API (form-encoded), so no SDK dependency is
// required. We charge a single line item for the order total in the order's
// currency and carry our reference through metadata for the webhook.
export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createPayment(input) {
    const body = new URLSearchParams({
      mode: "payment",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.email,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": input.currency.toLowerCase(),
      "line_items[0][price_data][product_data][name]": input.description,
      "line_items[0][price_data][unit_amount]": String(input.amount),
      "metadata[reference]": input.reference,
      client_reference_id: input.reference,
    })

    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })

    if (!res.ok) {
      const detail = await res.text()
      throw new Error(`Stripe checkout session failed: ${res.status} ${detail}`)
    }

    const session = (await res.json()) as { id: string; url: string }
    return { redirectUrl: session.url, providerRef: session.id }
  },

  async verifyWebhook(rawBody, headers) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    const sigHeader = headers.get("stripe-signature")
    if (!secret || !sigHeader) return null

    // Header format: "t=timestamp,v1=signature[,v1=...]"
    const parts = Object.fromEntries(
      sigHeader.split(",").map((kv) => kv.split("=") as [string, string]),
    )
    const timestamp = parts["t"]
    const signature = parts["v1"]
    if (!timestamp || !signature) return null

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex")

    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

    const event = JSON.parse(rawBody) as {
      type: string
      data: { object: { payment_status?: string; metadata?: { reference?: string } } }
    }

    const paidEvents = ["checkout.session.completed", "checkout.session.async_payment_succeeded"]
    if (!paidEvents.includes(event.type)) return null

    const obj = event.data.object
    const reference = obj.metadata?.reference
    if (!reference) return null
    return { reference, paid: obj.payment_status === "paid" }
  },
}
