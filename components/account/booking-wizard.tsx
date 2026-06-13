"use client"

import { useState, useTransition } from "react"
import type { SessionType } from "@/lib/booking-types"
import { SESSION_TYPES } from "@/lib/booking-types"
import { bookSessionAction } from "@/app/actions/bookings"
import { SessionTypeCards } from "./session-type-cards"
import { DatePickerStep } from "./date-picker-step"
import { TimeSlotPicker } from "./time-slot-picker"
import { BookingDetailsForm } from "./booking-details-form"
import { BookingPaymentStep } from "./booking-payment-step"
import { BookingConfirmation } from "./booking-confirmation"
import { ChevronLeft } from "lucide-react"

const STEPS = [
  { id: 1, label: "Session" },
  { id: 2, label: "Date" },
  { id: 3, label: "Time" },
  { id: 4, label: "Details" },
  { id: 5, label: "Payment" },
  { id: 6, label: "Confirmed" },
]

export function BookingWizard() {
  const [step, setStep] = useState(1)
  const [sessionType, setSessionType] = useState<SessionType | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [topic, setTopic] = useState("")
  const [notes, setNotes] = useState("")
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function reset() {
    setStep(1)
    setSessionType(null)
    setDate(null)
    setSlot(null)
    setTopic("")
    setNotes("")
    setBookingId(null)
    setError(null)
  }

  function canAdvance() {
    if (step === 1) return !!sessionType
    if (step === 2) return !!date
    if (step === 3) return !!slot
    if (step === 4) return topic.trim().length > 0
    return true
  }

  async function handleSubmit() {
    if (!sessionType || !date || !slot) return
    setError(null)
    startTransition(async () => {
      const result = await bookSessionAction({ sessionType, date, slot, topic, notes })
      if (result.error) {
        setError(result.error)
      } else if (result.booking) {
        setBookingId(result.booking.id)
        // If free, skip payment
        const session = SESSION_TYPES.find((s) => s.id === sessionType)
        if (session?.price === 0) {
          setStep(6)
        } else {
          setStep(5)
        }
      }
    })
  }

  const isLastInputStep = step === 4
  const session = sessionType ? SESSION_TYPES.find((s) => s.id === sessionType) : null

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
      {/* Step indicator */}
      {step < 6 && (
        <div className="mb-8">
          <div className="flex items-center gap-1.5">
            {STEPS.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    step > s.id
                      ? "bg-primary text-primary-foreground"
                      : step === s.id
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.id ? "✓" : s.id}
                </div>
                {i < 4 && (
                  <div className={`h-px flex-1 ${step > s.id ? "bg-primary" : "bg-border"}`} style={{ width: "2rem" }} />
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Step {step} of 5 — {STEPS[step - 1]?.label}
          </p>
        </div>
      )}

      {/* Step content */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Choose a session type</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select the type of consultation that fits your needs.</p>
          </div>
          <SessionTypeCards selected={sessionType} onSelect={setSessionType} />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Choose a date</h2>
            <p className="mt-1 text-sm text-muted-foreground">Available dates are highlighted. All times are in UK time (GMT/BST).</p>
          </div>
          <DatePickerStep selected={date} onSelect={setDate} />
        </div>
      )}

      {step === 3 && date && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Choose a time</h2>
            <p className="mt-1 text-sm text-muted-foreground">Available slots on {date}:</p>
          </div>
          <TimeSlotPicker date={date} selected={slot} onSelect={setSlot} />
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Session details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tell Iqra what you would like to focus on.</p>
          </div>
          <BookingDetailsForm
            topic={topic}
            notes={notes}
            onTopicChange={setTopic}
            onNotesChange={setNotes}
          />
        </div>
      )}

      {step === 5 && bookingId && sessionType && date && slot && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Complete payment</h2>
            <p className="mt-1 text-sm text-muted-foreground">Secure your session with payment.</p>
          </div>
          <BookingPaymentStep
            bookingId={bookingId}
            sessionType={sessionType}
            date={date}
            slot={slot}
            onConfirmed={() => setStep(6)}
          />
        </div>
      )}

      {step === 6 && sessionType && date && slot && (
        <BookingConfirmation
          sessionType={sessionType}
          date={date}
          slot={slot}
          onBookAgain={reset}
        />
      )}

      {/* Navigation */}
      {step < 5 && step !== 6 && (
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            disabled={!canAdvance() || pending}
            onClick={isLastInputStep ? handleSubmit : () => setStep((s) => s + 1)}
            className="h-11 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? "Processing…" : isLastInputStep ? "Review & Pay" : "Continue"}
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  )
}
