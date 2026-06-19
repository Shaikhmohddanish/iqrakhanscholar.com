import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser, isUserVerified } from "@/lib/session"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { VerifyEmailBanner } from "@/components/account/verify-email-banner"

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
}

export default async function CheckoutPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?next=/checkout")

  // Purchases require a verified email; warn up front (the order action enforces it too).
  const emailVerified = user.emailVerified || (await isUserVerified(user.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {!emailVerified && (
        <div className="mb-6">
          <VerifyEmailBanner email={user.email} />
        </div>
      )}
      <CheckoutForm userEmail={user.email} />
    </div>
  )
}
