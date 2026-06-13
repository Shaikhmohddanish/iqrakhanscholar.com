'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const email = data.get('email') as string
    const subject = data.get('subject') as string
    const message = data.get('message') as string

    // Client-side validation
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email address'
    if (!subject.trim()) newErrors.subject = 'Subject is required'
    if (!message.trim()) newErrors.message = 'Message is required'
    else if (message.length < 10) newErrors.message = 'Message must be at least 10 characters'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setState('submitting')

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setState('success')
    form.reset()
  }

  if (state === 'success') {
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
          onClick={() => setState('idle')}
          className="mt-6 inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
            className={`input-base ${errors.name ? 'border-destructive' : ''}`}
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
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
            className={`input-base ${errors.email ? 'border-destructive' : ''}`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
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
          className={`input-base ${errors.subject ? 'border-destructive' : ''}`}
          placeholder="What is this regarding?"
        />
        {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          className={`input-base resize-y ${errors.message ? 'border-destructive' : ''}`}
          placeholder="Your message..."
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {state === 'submitting' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
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
