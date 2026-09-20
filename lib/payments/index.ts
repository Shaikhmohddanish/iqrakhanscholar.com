import "server-only"
import type { PaymentProvider, PaymentProviderName } from "./types"
import { stripeProvider } from "./stripe"
import { razorpayProvider } from "./razorpay"
import { simulatedProvider } from "./simulated"

export type { PaymentProvider, PaymentProviderName }

const hasStripe = () => Boolean(process.env.STRIPE_SECRET_KEY)
const hasRazorpay = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)

// The store sells in INR only, so Razorpay (its home currency) comes first
// unconditionally. Stripe is only a fallback: routing an INR charge to a
// Stripe account that isn't India-based gets it rejected at the gateway.
// Falls back to the simulated provider when no keys are configured so the
// storefront keeps working in development.
export function selectProvider(_currency: string): PaymentProvider {
  if (hasRazorpay()) return razorpayProvider
  if (hasStripe()) return stripeProvider
  return simulatedProvider
}

// Look up a provider by name to verify its webhooks.
export function providerByName(name: PaymentProviderName): PaymentProvider {
  switch (name) {
    case "stripe":
      return stripeProvider
    case "razorpay":
      return razorpayProvider
    default:
      return simulatedProvider
  }
}
