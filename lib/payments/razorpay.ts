import "server-only"
import crypto from "crypto"
import type { PaymentProvider } from "./types"

const RAZORPAY_API = "https://api.razorpay.com/v1"

function authHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!id || !secret) throw new Error("Razorpay keys are not configured")
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`
}

// Razorpay via the hosted Payment Links API, which returns a short_url we can
// redirect to (no client-side SDK needed). Our reference travels in `notes`.
export const razorpayProvider: PaymentProvider = {
  name: "razorpay",

  async createPayment(input) {
    const res = await fetch(`${RAZORPAY_API}/payment_links`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        customer: { email: input.email },
        notify: { email: false, sms: false },
        notes: { reference: input.reference },
        callback_url: input.successUrl,
        callback_method: "get",
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      throw new Error(`Razorpay payment link failed: ${res.status} ${detail}`)
    }

    const link = (await res.json()) as { id: string; short_url: string }
    return { redirectUrl: link.short_url, providerRef: link.id }
  },

  async verifyWebhook(rawBody, headers) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    const signature = headers.get("x-razorpay-signature")
    if (!secret || !signature) return null

    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

    const event = JSON.parse(rawBody) as {
      event: string
      payload?: { payment_link?: { entity?: { notes?: { reference?: string } } } }
    }

    if (event.event !== "payment_link.paid") return null
    const reference = event.payload?.payment_link?.entity?.notes?.reference
    if (!reference) return null
    return { reference, paid: true }
  },
}
