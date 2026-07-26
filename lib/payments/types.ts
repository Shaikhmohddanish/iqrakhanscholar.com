// Payment provider abstraction so checkout doesn't care which gateway runs.
// Implementations: stripe (global), razorpay (INR), simulated (dev/no keys).

import type { PaymentProviderName } from "@/lib/order-types"

export type { PaymentProviderName }

export interface CreatePaymentInput {
  orderId: string
  reference: string
  // amount to charge in minor units of `currency`
  amount: number
  currency: string
  email: string
  description: string
  // absolute URLs the provider redirects back to
  successUrl: string
  cancelUrl: string
}

export interface CreatePaymentResult {
  // where to send the customer to complete payment
  redirectUrl: string
  // provider-side id (Checkout session / payment link) stored on the order
  providerRef?: string
}

export interface WebhookResult {
  // our order reference to mark paid
  reference: string
  paid: boolean
}

export interface PaymentProvider {
  name: PaymentProviderName
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>
  // Verify and parse a webhook request body; return null if not a paid event.
  verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookResult | null>
}
