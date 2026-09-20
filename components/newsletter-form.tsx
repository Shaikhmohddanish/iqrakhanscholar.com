'use client'

import { useActionState } from 'react'
import { subscribeAction, type SubscribeState } from '@/app/actions/subscribe'

const initialState: SubscribeState = {}

/**
 * Footer newsletter signup. Extracted as a client component because the footer
 * itself is a server component; previously this form posted to `action="#"`,
 * which reloaded the page and threw the address away.
 */
export function NewsletterForm() {
  const [state, action, isPending] = useActionState(subscribeAction, initialState)

  return (
    <form className="mt-6" action={action}>
      <input type="hidden" name="source" value="newsletter" />
      <label
        htmlFor="footer-email"
        className="text-xs font-medium uppercase tracking-wider text-accent"
      >
        Stay Connected
      </label>
      {state.ok ? (
        <p className="mt-2 text-sm text-primary-foreground/80">
          Jazakillah khair — you&apos;re on the list.
        </p>
      ) : (
        <>
          <div className="mt-2 flex gap-2">
            <input
              id="footer-email"
              name="email"
              type="email"
              placeholder="Your email"
              required
              className="flex-1 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              {isPending ? '…' : 'Join'}
            </button>
          </div>
          {state.error && (
            <p className="mt-2 text-xs text-primary-foreground/70">{state.error}</p>
          )}
        </>
      )}
    </form>
  )
}
