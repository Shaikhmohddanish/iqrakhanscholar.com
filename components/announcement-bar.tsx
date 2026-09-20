'use client'

import { useEffect, useState } from 'react'

// Short and few, on purpose: the previous version scrolled a duplicated list of
// four long messages, which read as repetitive noise. Nothing here may promise
// something the checkout doesn't honour (the old "free shipping over $50" line
// was never implemented - shipping is a flat rate at any order value).
const items = [
  'New: 30 Day Quran Reflection Journey',
  'One-to-one consultations open for booking',
  'Free Islamic self-improvement guide',
]

const ROTATE_MS = 4500

export function AnnouncementBar() {
  // Always starts at index 0 so server and client markup agree; only advances
  // after mount.
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  // No live region and nothing aria-hidden: all three messages stay in the
  // accessibility tree and are read once, rather than a rotating region
  // interrupting screen readers every few seconds.
  return (
    <div className="bg-arabesque border-b border-primary-foreground/10 py-2 text-primary-foreground">
      <div className="relative mx-auto h-5 max-w-7xl px-4 text-xs tracking-wide">
        {items.map((item, i) => (
          <span
            key={item}
            className={`absolute inset-0 flex items-center justify-center gap-2.5 transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <span className="text-accent">✦</span>
            <span className="truncate font-medium text-primary-foreground/90">{item}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
