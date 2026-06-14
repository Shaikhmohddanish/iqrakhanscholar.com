"use client"

import { useState, useTransition } from "react"
import type { PublicOrder } from "@/lib/order-types"
import { X } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"

interface RefundRequestModalProps {
  order: PublicOrder | null
  onClose: () => void
}

export function RefundRequestModal({ order, onClose }: RefundRequestModalProps) {
  const [reason, setReason] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  if (!order) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      // In production: POST to /api/refunds
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        role="dialog"
        aria-label="Request refund"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="font-heading text-base font-semibold">Request refund - {order.reference}</p>
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/15">
              <span className="text-2xl">✓</span>
            </div>
            <p className="font-heading text-base font-semibold text-foreground">Refund request submitted</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We will review your request and respond within 3–5 business days.
            </p>
            <button type="button" onClick={onClose} className="mt-4 h-9 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Please describe the reason for your refund request. Our team will review it within 3–5 business days.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="refund-reason" className="text-sm font-medium text-foreground">
                Reason <span className="text-destructive">*</span>
              </label>
              <textarea
                id="refund-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                placeholder="Please explain why you are requesting a refund…"
                className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={pending || !reason.trim()}
                className="flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {pending && <BarLoader size="sm" />}
                Submit request
              </button>
              <button type="button" onClick={onClose} className="h-9 rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-muted">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
