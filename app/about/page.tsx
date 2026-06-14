import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { stats } from '@/lib/site-data'
import {
  BookOpen,
  Heart,
  GraduationCap,
  Users,
  Star,
  ArrowRight,
  Quote,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Iqra Khan',
  description:
    'Learn about Iqra Khan - an Islamic scholar, educator, and mentor dedicated to empowering Muslim women through authentic Quran & Sunnah knowledge.',
  openGraph: {
    title: 'About Iqra Khan - Islamic Scholar & Educator',
    description:
      'Discover the journey, mission, and qualifications of Iqra Khan.',
  },
}

const qualifications = [
  { year: '2015', title: 'Bachelor of Islamic Studies', institution: 'International Islamic University' },
  { year: '2017', title: 'Ijazah in Quran Recitation', institution: 'Under Sheikh Al-Hussaini' },
  { year: '2019', title: 'Masters in Islamic Jurisprudence', institution: 'Al-Azhar University' },
  { year: '2021', title: 'Certificate in Islamic Counselling', institution: 'Islamic Psychology Institute' },
  { year: '2023', title: 'Launched Iqra Khan Platform', institution: 'Self-founded educational brand' },
]

const values = [
  {
    icon: BookOpen,
    title: 'Authentic Knowledge',
    description: 'Every teaching is rooted firmly in the Quran and authentic Sunnah, verified through classical scholarship.',
  },
  {
    icon: Heart,
    title: 'Compassionate Guidance',
    description: 'We approach every question and struggle with mercy, understanding, and genuine care.',
  },
  {
    icon: GraduationCap,
    title: 'Accessible Education',
    description: 'Making Islamic scholarship approachable for the modern Muslim woman, regardless of background.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Building a global sisterhood united by faith, growth, and mutual support.',
  },
]

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'About' }]} />
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  About the Scholar
                </span>
                <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  Guiding hearts back to
                  <span className="text-primary"> Allah&apos;s light</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Iqra Khan is an Islamic scholar, educator, and mentor dedicated to
                  empowering Muslim women with authentic knowledge rooted in the Quran
                  and Sunnah. Through books, courses, and personal mentorship, she has
                  impacted thousands of lives across the globe.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/consultation"
                    className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Book a Consultation
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                  <Link
                    href="/library"
                    className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Explore Library
                  </Link>
                </div>
              </div>

              {/* Image placeholder - geometric pattern */}
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-arabesque">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-accent/20">
                      <Star className="size-12 text-accent" />
                    </div>
                    <p className="mt-4 font-heading text-2xl font-semibold text-primary-foreground">
                      Iqra Khan
                    </p>
                    <p className="text-sm text-primary-foreground/70">
                      Islamic Scholar & Educator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">Our Values</h2>
              <p className="mt-3 text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <v.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Qualifications Timeline */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Scholarly Journey
              </h2>
              <p className="mt-3 text-muted-foreground">
                Qualifications and milestones
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border sm:left-1/2 sm:-translate-x-px" />

              <div className="space-y-10">
                {qualifications.map((q, i) => (
                  <div
                    key={q.year}
                    className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 top-1 z-10 flex size-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-card sm:left-1/2">
                      <div className="size-2 rounded-full bg-primary" />
                    </div>

                    {/* Content */}
                    <div className="ml-10 sm:ml-0 sm:w-[calc(50%-2rem)]">
                      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-xs)]">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                          {q.year}
                        </span>
                        <h3 className="mt-2 font-semibold text-foreground">{q.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{q.institution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-arabesque py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <Quote className="mx-auto size-10 text-accent/60" />
            <blockquote className="mt-6 font-heading text-2xl font-semibold leading-relaxed text-primary-foreground sm:text-3xl">
              &ldquo;The best of you are those who learn the Quran and teach it.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-primary-foreground/70">- Prophet Muhammad ﷺ</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/consultation"
                className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Book a Session
              </Link>
              <Link
                href="/store"
                className="inline-flex h-12 items-center rounded-full border border-primary-foreground/30 px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Visit the Store
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Iqra Khan',
            url: 'https://iqrakhan.com',
            jobTitle: 'Islamic Scholar & Educator',
            description: 'Islamic scholar, educator, and mentor dedicated to empowering Muslim women.',
            sameAs: [],
          }),
        }}
      />
    </>
  )
}
