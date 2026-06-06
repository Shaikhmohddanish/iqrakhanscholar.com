'use client'

import { useState } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'
import { quotes } from '@/lib/site-data'

export function DailyReflection() {
  const [index, setIndex] = useState(0)
  const quote = quotes[index]

  return (
    <section className="bg-arabesque text-primary-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3.5 py-1.5 text-xs font-medium text-accent">
          <Sparkles className="size-3.5" />
          Daily Reflection
        </span>
        <blockquote className="mt-6 text-balance font-heading text-2xl font-medium leading-snug sm:text-3xl">
          “{quote.text}”
        </blockquote>
        <p className="mt-4 text-sm font-medium tracking-wide text-accent">
          {quote.source}
        </p>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % quotes.length)}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
        >
          <RefreshCw className="size-4" />
          New reflection
        </button>
      </div>
    </section>
  )
}
