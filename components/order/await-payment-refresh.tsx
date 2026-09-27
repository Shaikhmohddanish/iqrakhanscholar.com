"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Refreshes the order page while it is waiting on the payment webhook.
 *
 * The "Payment processing... this page will update once it's complete" state
 * had nothing behind it: no polling, no revalidate. A customer whose webhook
 * arrived a few seconds late sat on that screen indefinitely unless they
 * thought to reload.
 *
 * Backs off and eventually gives up rather than polling forever, so a genuinely
 * stuck payment doesn't hammer the server from an abandoned tab.
 */
const INTERVAL_MS = 4000
const MAX_ATTEMPTS = 15 // ~1 minute

export function AwaitPaymentRefresh({ active }: { active: boolean }) {
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!active || attempts >= MAX_ATTEMPTS) return
    const timer = setTimeout(() => {
      setAttempts((n) => n + 1)
      router.refresh()
    }, INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [active, attempts, router])

  if (!active || attempts < MAX_ATTEMPTS) return null

  return (
    <p className="mt-4 text-sm text-muted-foreground">
      This is taking longer than usual. Your payment may still complete — refresh
      this page in a moment, or check{" "}
      <a href="/account/orders" className="text-primary underline underline-offset-2">
        your orders
      </a>
      . If you were charged and this order stays unconfirmed, contact us and
      we&apos;ll sort it out.
    </p>
  )
}
