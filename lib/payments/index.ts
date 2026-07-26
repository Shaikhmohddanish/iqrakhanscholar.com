import "server-only"
import type { PaymentProvider, PaymentProviderName } from "./types"
import { stripeProvider } from "./stripe"
import { razorpayProvider } from "./razorpay"
import { simulatedProvider } from "./simulated"

export type { PaymentProvider, PaymentProviderName }

const hasStripe = () => Boolean(process.env.STRIPE_SECRET_KEY)
const hasRazorpay = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)

// Route INR through Razorpay (its home currency) and everything else through
// Stripe. Falls back to the simulated provider when no keys are configured so
// the storefront keeps working in development.
export function selectProvider(currency: string): PaymentProvider {
  if (currency === "INR" && hasRazorpay()) return razorpayProvider
  if (hasStripe()) return stripeProvider
  if (hasRazorpay()) return razorpayProvider
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
