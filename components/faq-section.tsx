'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { faqs } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Questions &amp; Answers
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Everything you might be wondering
          </h2>
        </Reveal>

        <dl className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <Reveal key={faq.q} delay={i * 50}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-heading text-lg font-medium text-foreground">
                        {faq.q}
                      </span>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors">
                        {isOpen ? (
                          <Minus className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </span>
                    </button>
                  </dt>
                  {/* CSS grid-rows transition for smooth height animation */}
                  <dd
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-pretty leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </div>
                  </dd>
                </div>
              </Reveal>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
