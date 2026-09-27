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
        // Payment links accept partial payments by default. Without this a
        // customer could pay a fraction of the total and still trigger the
        // paid event, so the order must be all-or-nothing.
        accept_partial: false,
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
      payload?: {
        payment_link?: {
          entity?: {
            notes?: { reference?: string }
            amount?: number
            amount_paid?: number
          }
        }
      }
    }

    const entity = event.payload?.payment_link?.entity
    const reference = entity?.notes?.reference
    if (!reference) return null

    switch (event.event) {
      case "payment_link.paid": {
        // Belt and braces alongside accept_partial:false - never mark an order
        // paid for less than it was created for.
        if (
          typeof entity?.amount === "number" &&
          typeof entity?.amount_paid === "number" &&
          entity.amount_paid < entity.amount
        ) {
          return null
        }
        return { reference, paid: true }
      }
      // Previously dropped on the floor, so a declined or abandoned checkout
      // left its order "pending" forever - polluting /admin/orders and making
      // revenue reporting meaningless.
      case "payment_link.cancelled":
      case "payment_link.expired":
      case "payment.failed":
        return { reference, paid: false }
      default:
        return null
    }
  },
}

/**
 * Issue a real refund through Razorpay.
 *
 * The admin "process refund" button previously only flipped `paymentStatus` to
 * "refunded" in Mongo. The order read as refunded while the customer's money
 * stayed in the Razorpay account - a dispute and chargeback generator, and a
 * straightforward way to mislead a customer into thinking they'd been paid
 * back.
 *
 * `speed: "normal"` (not "optimum") so the refund is queued rather than
 * attempted instantly - instant refunds can fail on some methods and that
 * failure is harder to reason about than a normal one.
 */
export async function refundPayment(input: {
  paymentId: string
  /** minor units; omit to refund the full captured amount */
  amount?: number
  notes?: Record<string, string>
}): Promise<{ id: string; status: string }> {
  const res = await fetch(`${RAZORPAY_API}/payments/${input.paymentId}/refund`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(input.amount != null ? { amount: input.amount } : {}),
      speed: "normal",
      ...(input.notes ? { notes: input.notes } : {}),
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Razorpay refund failed: ${res.status} ${detail}`)
  }

  return (await res.json()) as { id: string; status: string }
}

/**
 * Find the captured payment id for one of our payment links.
 *
 * Refunds are issued against a payment, not against the link, and we store the
 * link id (`providerRef`) on the order - so this bridges the two.
 */
export async function getPaidPaymentIdForLink(
  paymentLinkId: string,
): Promise<string | null> {
  const res = await fetch(`${RAZORPAY_API}/payment_links/${paymentLinkId}`, {
    headers: { Authorization: authHeader() },
  })
  if (!res.ok) return null

  const link = (await res.json()) as {
    payments?: { payment_id: string; status: string }[]
  }
  const captured = link.payments?.find((p) => p.status === "captured")
  return captured?.payment_id ?? null
}

// Verify the signed GET that Razorpay appends to callback_url when the customer
// is redirected back after paying.
//
// The order page used to ignore these parameters entirely, so a buyer landed on
// "Payment processing... this page will update once it's complete" - on a page
// with no polling and no revalidate - and had to guess when to reload. The
// webhook is still the authority; this just lets us unlock immediately when the
// customer is standing right there.
export function verifyPaymentLinkReturn(params: {
  paymentLinkId?: string | null
  paymentLinkRefId?: string | null
  paymentLinkStatus?: string | null
  paymentId?: string | null
  signature?: string | null
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  const {
    paymentLinkId,
    paymentLinkRefId,
    paymentLinkStatus,
    paymentId,
    signature,
  } = params
  if (!secret || !signature || !paymentLinkId || !paymentId) return false

  // Razorpay signs these five fields joined by "|", in this exact order.
  const payload = [
    paymentLinkId,
    paymentLinkRefId ?? "",
    paymentLinkStatus ?? "",
    paymentId,
  ].join("|")

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
