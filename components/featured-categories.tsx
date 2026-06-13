import { BookOpen, Package, MessageCircleHeart, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const categories = [
  {
    icon: BookOpen,
    title: 'Digital Library',
    desc: 'Ebooks, study guides & Islamic resources delivered instantly to your inbox.',
    items: ['Ebooks', 'Study Guides', 'Resource Packs'],
    href: '#digital',
  },
  {
    icon: Package,
    title: 'Physical Store',
    desc: 'Beautifully crafted books, journals & planners for your daily practice.',
    items: ['Books', 'Journals', 'Planners'],
    href: '#store',
  },
  {
    icon: MessageCircleHeart,
    title: 'Personal Guidance',
    desc: 'Private one-to-one sessions, counseling & mentorship rooted in Islam.',
    items: ['1-on-1 Sessions', 'Counseling', 'Mentorship'],
    href: '#consultation',
  },
]

export function FeaturedCategories() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Where to begin
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Three paths to deepen your faith
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 80}>
              <a
                href={cat.href}
                className="group relative flex flex-col rounded-2xl border border-border bg-background p-7 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <cat.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cat.desc}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
