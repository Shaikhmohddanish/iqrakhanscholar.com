'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error server-side / in monitoring.
    console.error('Route error boundary caught:', error)
  }, [error])

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-10 text-destructive" />
        </div>

        <h1 className="mt-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted-foreground">
          An unexpected error occurred. You can try again, and if the problem persists, please
          head back home.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-muted-foreground/70">Reference: {error.digest}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Home className="size-4" />
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}
