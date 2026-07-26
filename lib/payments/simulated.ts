import "server-only"
import type { PaymentProvider } from "./types"

// Fallback used in development or when no real gateway keys are configured.
// No external redirect happens; checkout marks the order paid directly and the
// customer lands straight on the order confirmation page.
export const simulatedProvider: PaymentProvider = {
  name: "simulated",
  async createPayment(input) {
    return { redirectUrl: input.successUrl }
  },
  async verifyWebhook() {
    return null
  },
}
