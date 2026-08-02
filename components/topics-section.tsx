import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { topics } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

export function TopicsSection() {
  return (
    <section id="topics" className="scroll-mt-20 bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
            Explore key topics
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Guidance on what matters most
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            The themes sisters and families bring to every session - worship,
            dignity, and raising children upon faith.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <Reveal key={topic.image} delay={i * 80}>
              <Link
                href="/consultation"
                className="group relative block aspect-[3/2] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {/* The artwork already contains its own title and tagline, so
                    nothing is overlaid on it and the 3:2 box matches the source
                    aspect exactly - no part of the design gets cropped. */}
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end gap-1.5 bg-gradient-to-t from-foreground/70 to-transparent p-4 text-sm font-medium text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  Book a session
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
