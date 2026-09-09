'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

/**
 * Counts up to `to` when scrolled into view.
 *
 * The correct number is the DEFAULT and the animation is the enhancement: state
 * starts at `to`, so server-rendered HTML, crawlers, no-JS visitors and any
 * hydration failure all show the real figure. Previously this started at 0 and
 * only reached `to` if an IntersectionObserver fired, which meant a single
 * broken link in that chain left visitors reading "0+".
 */
export function CountUp({ to, duration = 1800, suffix = '', prefix = '' }: CountUpProps) {
  const [value, setValue] = useState(to)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (started.current) return

    // Reduced motion: leave the final value in place.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Already on screen at mount? Keep the final value rather than snapping
    // back to 0 to animate - that flash reads as a glitch.
    const rect = el.getBoundingClientRect()
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < viewportH && rect.bottom > 0) return

    let frame = 0
    let safety: ReturnType<typeof setTimeout> | undefined

    const run = () => {
      started.current = true
      const startTime = performance.now()
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * to))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    // Below the fold: hold at 0 until it scrolls into view.
    setValue(0)

    const observer = new IntersectionObserver(
      (entries) => {
        // Check EVERY queued record, not just entries[0]: the observer can
        // deliver several records in one batch (hydration, font swap and image
        // layout all settling together), and if the first happens to be
        // non-intersecting, destructuring only that one drops the hit.
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          observer.disconnect()
          if (safety) clearTimeout(safety)
          run()
        }
      },
      // A near-zero threshold so a short inline span always qualifies.
      { threshold: 0.01 },
    )
    observer.observe(el)

    // Backstop: if the observer never fires for any reason, never leave the
    // visitor looking at 0.
    safety = setTimeout(() => {
      if (!started.current) {
        observer.disconnect()
        started.current = true
        setValue(to)
      }
    }, 4000)

    return () => {
      observer.disconnect()
      if (safety) clearTimeout(safety)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
