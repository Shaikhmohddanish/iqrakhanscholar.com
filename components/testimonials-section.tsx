'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function prev() {
    setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  }
  function next() {
    setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1))
  }

  useEffect(() => {
    if (paused) return
    // Respect reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    intervalRef.current = setInterval(next, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, active])

  return (
    <section className="border-y border-border bg-card overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Words from the community
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Lives changed, hearts at ease
          </h2>
        </Reveal>

        {/* Carousel */}
        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="w-full shrink-0 px-2 sm:px-4">
                  <figure className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-8 sm:p-10">
                    <Quote className="size-8 text-accent/40" />
                    <div className="mt-3 flex items-center gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-5 text-pretty text-lg leading-relaxed text-foreground/90 font-heading">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                      <span className="relative size-12 overflow-hidden rounded-full">
                        <Image
                          src={t.avatar || '/placeholder.svg'}
                          alt={t.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          {t.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {t.role}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 hidden size-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-secondary sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 hidden size-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-secondary sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === active
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-border hover:bg-primary/40'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
