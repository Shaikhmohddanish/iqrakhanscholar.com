"use client"

import { useState, useTransition } from "react"
import { SESSION_TYPES, BOOKING_HOLD_MINUTES, type SessionType } from "@/lib/booking-types"
import { BOOKING_TZ_LABEL, formatBookingDate, formatSlot } from "@/lib/booking-time"
import { formatPrice } from "@/lib/product-types"
import { resolveProductPrice } from "@/lib/currency"
import { useCurrency } from "@/components/currency/currency-provider"
import { startBookingPaymentAction } from "@/app/actions/bookings"
import { PaymentMethods } from "@/components/checkout/payment-methods"
import { CreditCard, Lock, CheckCircle2 } from "lucide-react"

interface BookingPaymentStepProps {
  bookingId: string
  sessionType: SessionType
  date: string
  slot: string
  onConfirmed: () => void
}

export function BookingPaymentStep({
  bookingId,
  sessionType,
  date,
  slot,
  onConfirmed,
}: BookingPaymentStepProps) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { currency } = useCurrency()

  const session = SESSION_TYPES.find((s) => s.id === sessionType)!
  const priced = resolveProductPrice(session, currency)

  // Hands off to Razorpay. This used to call a mock action that marked the
  // booking paid with no gateway involved, behind a fake card form - so every
  // consultation was effectively free.
  function handlePay() {
    setError(null)
    startTransition(async () => {
      const result = await startBookingPaymentAction(bookingId)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }
      // Free tier, already paid, or the simulated provider in local dev.
      onConfirmed()
    })
  }

  if (session.price === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-heading text-lg font-semibold text-foreground">Order summary</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{session.title}</span>
            <span className="font-medium text-foreground">Free</span>
          </div>
          <div className="mt-3 border-t border-border pt-3 flex items-center justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-heading text-lg font-bold text-foreground">{formatPrice(0, priced.currency)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePay}
          disabled={pending}
          className="h-11 w-full rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "Confirming…" : "Confirm Booking (Free)"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Order summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="font-heading text-lg font-semibold text-foreground">Order summary</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{session.title}</span>
            <span className="font-medium">{formatPrice(priced.amount, priced.currency)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Date</span>
            <span>
              {formatBookingDate(date, "short")} at {formatSlot(slot)} {BOOKING_TZ_LABEL}
            </span>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4 flex items-center justify-between">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-heading text-xl font-bold text-foreground">
            {formatPrice(priced.amount, priced.currency)}
          </span>
        </div>
      </div>

      {/* Mock payment notice */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Lock className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="text-sm text-foreground">
          You&rsquo;ll be taken to <strong>Razorpay</strong> to pay securely by card, UPI or
          net banking. Your slot is held for {BOOKING_HOLD_MINUTES} minutes while you complete
          payment, and we never see or store your card details.
        </p>
      </div>

      <PaymentMethods />

      <button
        type="button"
        onClick={handlePay}
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        <Lock className="size-4" />
        {pending ? "Processing…" : `Pay ${formatPrice(priced.amount, priced.currency)}`}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
