'use client'

import { useActionState, useEffect, useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { BarLoader } from '@/components/ui/bar-loader'
import { sendContactMessage, type ContactState } from '@/app/actions/contact'

const initial: ContactState = {}

export function ContactForm() {
  const [state, action, isPending] = useActionState(sendContactMessage, initial)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (state.ok) setSent(true)
  }, [state.ok])

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-success/20 bg-success/5 px-6 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="size-8 text-success" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Message Sent!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thank you for reaching out. We&apos;ll get back to you within 24–48 hours, insha&apos;Allah.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            className={`input-base ${state.fieldErrors?.name ? 'border-destructive' : ''}`}
            placeholder="Your name"
          />
          {state.fieldErrors?.name && <p className="mt-1 text-xs text-destructive">{state.fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className={`input-base ${state.fieldErrors?.email ? 'border-destructive' : ''}`}
            placeholder="you@example.com"
          />
          {state.fieldErrors?.email && <p className="mt-1 text-xs text-destructive">{state.fieldErrors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-foreground">
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          minLength={2}
          className={`input-base ${state.fieldErrors?.subject ? 'border-destructive' : ''}`}
          placeholder="What is this regarding?"
        />
        {state.fieldErrors?.subject && <p className="mt-1 text-xs text-destructive">{state.fieldErrors.subject}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={6}
          className={`input-base resize-y ${state.fieldErrors?.message ? 'border-destructive' : ''}`}
          placeholder="Your message..."
        />
        {state.fieldErrors?.message && <p className="mt-1 text-xs text-destructive">{state.fieldErrors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <BarLoader size="md" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
