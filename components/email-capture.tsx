'use client'

import { useActionState, useState } from 'react'
import { Gift, Check, BookOpenCheck } from 'lucide-react'
import { subscribeAction, type SubscribeState } from '@/app/actions/subscribe'

const initialState: SubscribeState = {}

export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [state, action, isPending] = useActionState(subscribeAction, initialState)
  const submitted = state.ok === true

  return (
    <section id="community" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="grid items-center gap-0 lg:grid-cols-2">
            <div className="bg-secondary/60 p-8 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-primary">
                <Gift className="size-3.5" />
                Free Download
              </span>
              <h2 className="mt-5 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                Your free Islamic self-improvement guide
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                A beautifully designed 30-page guide with daily habits, duas,
                and reflections to help you grow closer to Allah - yours
                completely free.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  '30-day spiritual habit tracker',
                  'Curated morning & evening adhkar',
                  'Weekly journaling prompts',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-foreground/80"
                  >
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 sm:p-12">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                    <BookOpenCheck className="size-7" />
                  </span>
                  <h3 className="mt-4 font-heading text-2xl font-semibold text-foreground">
                    Alhamdulillah!
                  </h3>
                  {/* Says only what is true: the address is saved. The guide is
                      still being finished, so we must not claim it was sent. */}
                  <p className="mt-2 max-w-sm text-pretty text-muted-foreground">
                    We&apos;ve added{' '}
                    <span className="font-medium text-foreground">{email}</span> to the
                    list. The guide is being finished now — we&apos;ll email it to you as
                    soon as it&apos;s ready, insha&apos;Allah.
                  </p>
                </div>
              ) : (
                <form action={action} className="space-y-4">
                  <input type="hidden" name="source" value="guide" />
                  <div>
                    <label
                      htmlFor="capture-name"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      First name
                    </label>
                    <input
                      id="capture-name"
                      name="name"
                      type="text"
                      placeholder="Aisha"
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="capture-email"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Email address
                    </label>
                    <input
                      id="capture-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {state.error && (
                    <p className="text-sm text-destructive">{state.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                  >
                    {isPending ? 'Sending…' : 'Send Me the Free Guide'}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    No spam, ever. Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
