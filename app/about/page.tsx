import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { stats, socialLinks } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'
import {
  BookOpen,
  GraduationCap,
  MessageCircleHeart,
  Shirt,
  ArrowRight,
  Quote,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Iqra Khan Scholar',
  description:
    'Learn about Iqra Khan - an Islamic scholar sharing authentic knowledge rooted in the Qur’an and Sunnah, helping Muslim women and families strengthen their connection with Allah.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Iqra Khan Scholar',
    description:
      'Discover the journey, Islamic education, and mission of Iqra Khan.',
    url: '/about',
    images: [{ url: '/iqra-about.webp' }],
  },
}

const qualifications = [
  { year: '2017', title: 'Islamic Studies Foundation', institution: 'First Year' },
  { year: '2019', title: 'Islamic Studies Foundation', institution: 'Last Year' },
  { year: '2020', title: 'Master’s in Islamic Scholarship', institution: 'First Year' },
  { year: '2024', title: 'Master’s in Islamic Scholarship', institution: 'Last Year' },
  { year: '2026', title: 'Launched Iqra Khan Scholarship Website', institution: 'Self-founded educational brand' },
]

// "What I Offer" - the four things provided through this website.
const values = [
  {
    icon: MessageCircleHeart,
    title: 'Islamic Consultation',
    description: 'Private one-to-one guidance for the questions and challenges you are facing right now.',
  },
  {
    icon: BookOpen,
    title: 'Educational Resources',
    description: 'Islamic e-books and study resources you can read anytime in your account library.',
  },
  {
    icon: GraduationCap,
    title: 'Beneficial Content',
    description: 'Articles and reminders grounded in the Qur’an and authentic Sunnah.',
  },
  {
    icon: Shirt,
    title: 'Modest Clothing',
    description: 'Abayas and modest Islamic clothing that reflect dignity and faith.',
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
                  About <span className="text-primary">Iqra Khan Scholar</span>
                </h1>
                <p className="mt-6 font-heading text-lg text-foreground">
                  Assalamualaikum wa rehmatullahi wa barakatuhu
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  I am Iqra Khan, an Islamic scholar dedicated to sharing authentic
                  Islamic knowledge rooted in the Qur&apos;an and Sunnah. My aim is to help
                  Muslim women and families strengthen their connection with Allah
                  through beneficial knowledge, guidance, and practical resources.
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

              {/* Portrait - bg-arabesque shows through as the letterbox colour */}
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-arabesque">
                <Image
                  src="/hero-portrait.webp"
                  alt="Iqra Khan, Islamic scholar and educator"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 448px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* My Islamic Education & Mission */}
        <section className="pb-20">
          <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                My Islamic Education
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                I have studied classical Islamic sciences through Maulwiyat and Aalimiyat,
                including Qur&apos;an studies, Tafsir, Hadith, Fiqh, Aqeedah, Arabic language,
                Seerah, Islamic history, and principles of Islamic scholarship.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                I completed my Islamic studies over a period of 7 years, focusing on
                traditional Islamic sciences and developing a deeper understanding of the
                Qur&apos;an, Sunnah, and classical Islamic scholarship.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">My Mission</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                My mission is to make authentic Islamic guidance accessible for today&apos;s
                Muslims — helping them understand their faith, overcome personal challenges,
                and live their lives according to the teachings of Islam.
              </p>
              <h2 className="mt-10 font-heading text-2xl font-bold text-foreground">
                My Approach
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Every guidance and resource is created with a focus on authenticity, wisdom,
                and compassion — while maintaining respect for individual circumstances and
                privacy.
              </p>
            </div>
          </div>
        </section>

        {/* What I Offer */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">What I Offer</h2>
              <p className="mt-3 text-muted-foreground">
                Through this website, I provide
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
              May Allah accept this effort and make it a means of spreading beneficial
              knowledge.
            </blockquote>
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
                Browse Abayas
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
            url: SITE_URL,
            jobTitle: 'Islamic Scholar & Educator',
            description:
              'Islamic scholar sharing authentic knowledge rooted in the Qur’an and Sunnah, helping Muslim women and families strengthen their connection with Allah.',
            sameAs: Object.values(socialLinks),
          }),
        }}
      />
    </>
  )
}
