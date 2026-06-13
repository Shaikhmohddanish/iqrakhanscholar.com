'use client'

import { useEffect, useState } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

interface TableOfContentsProps {
  headings: TocHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 },
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-border bg-card p-5">
      <p className="font-heading text-sm font-semibold text-foreground">In this article</p>
      <ul className="mt-3 space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                activeId === id
                  ? 'bg-primary/5 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
