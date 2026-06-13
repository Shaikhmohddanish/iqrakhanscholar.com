'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  title: string
}

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  sections: Section[]
  children: React.ReactNode
}

export function LegalPageLayout({ title, lastUpdated, sections, children }: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 },
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sections])

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Sidebar TOC */}
        <aside className="lg:w-56 lg:shrink-0">
          <nav
            className="lg:sticky lg:top-24 space-y-0.5"
            aria-label="Table of contents"
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </p>
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  'block rounded-md px-3 py-1.5 text-sm transition-colors',
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {section.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <div className="prose max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
