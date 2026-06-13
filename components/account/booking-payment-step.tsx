"use client"

import { useState, useTransition } from "react"
import { SESSION_TYPES, type SessionType } from "@/lib/booking-types"
import { formatPrice } from "@/lib/product-types"
import { confirmPaymentAction } from "@/app/actions/bookings"
import { CreditCard, Lock, CheckCircle2 } from "lucide-react"

interface BookingPaymentStepProps {
  bookingId: string
  sessionType: SessionType
  date: string
  slot: string
  onConfirmed: () => void
}

function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`
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

  const session = SESSION_TYPES.find((s) => s.id === sessionType)!

  function handlePay() {
    setError(null)
    startTransition(async () => {
      const result = await confirmPaymentAction(bookingId)
      if (result.error) {
        setError(result.error)
      } else {
        onConfirmed()
      }
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
            <span className="font-heading text-lg font-bold text-foreground">£0.00</span>
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
            <span className="font-medium">{formatPrice(session.price, session.currency)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Date</span>
            <span>{date} at {formatSlot(slot)}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4 flex items-center justify-between">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-heading text-xl font-bold text-foreground">
            {formatPrice(session.price, session.currency)}
          </span>
        </div>
      </div>

      {/* Mock payment notice */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Lock className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="text-sm text-foreground">
          <strong>Demo mode:</strong> Payment is simulated. In production this integrates with Razorpay. Click &ldquo;Pay Now&rdquo; to confirm with mock payment.
        </p>
      </div>

      {/* Mock card form */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Card details (demo)</span>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
            4242 4242 4242 4242
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
              12/28
            </div>
            <div className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
              123
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        <Lock className="size-4" />
        {pending ? "Processing…" : `Pay ${formatPrice(session.price, session.currency)}`}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
