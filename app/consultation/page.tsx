import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  Clock,
  MessageCircle,
  Shield,
  Star,
  Video,
  FileText,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Quote,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Book a Consultation',
  description:
    'Schedule a private one-to-one Islamic consultation with Iqra Khan. Personalised guidance for your spiritual journey.',
}

const tiers = [
  {
    name: 'Single Session',
    price: '£79',
    duration: '60 min',
    features: [
      'Private one-to-one session',
      'Personalised guidance',
      'Session recording',
      'Follow-up notes via email',
    ],
    popular: false,
  },
  {
    name: 'Deep Dive',
    price: '£139',
    duration: '90 min',
    features: [
      'Extended session time',
      'In-depth topic exploration',
      'Session recording',
      'Written action plan',
      '1 follow-up email',
    ],
    popular: true,
  },
  {
    name: 'Mentorship Pack',
    price: '£349',
    duration: '3 × 60 min',
    features: [
      '3 sessions over 6 weeks',
      'Ongoing accountability',
      'All session recordings',
      'Written plans per session',
      'WhatsApp support between sessions',
      'Priority booking',
    ],
    popular: false,
  },
]

const steps = [
  { icon: MessageCircle, title: 'Share Your Story', description: 'Tell us what you\'re going through in a safe, judgement-free space.' },
  { icon: FileText, title: 'Receive Guidance', description: 'Get personalised advice grounded in Quran, Sunnah, and lived wisdom.' },
  { icon: CheckCircle, title: 'Take Action', description: 'Leave with a clear plan and continued support to implement it.' },
]

const testimonials = [
  {
    quote: 'Iqra\'s session gave me clarity I\'d been searching for years. She listens with genuine compassion and wisdom.',
    name: 'Aisha R.',
    role: 'Single Session Client',
  },
  {
    quote: 'The mentorship pack transformed my relationship with salah. I finally feel connected in my prayers.',
    name: 'Fatima H.',
    role: 'Mentorship Client',
  },
  {
    quote: 'I was hesitant at first but it was the best investment I\'ve made for my spiritual growth.',
    name: 'Maryam S.',
    role: 'Deep Dive Client',
  },
]

const faqs = [
  { q: 'Who are the consultations for?', a: 'Any Muslim woman seeking guidance on faith, personal development, family life, or spiritual growth. Sessions are accessible regardless of your current level of practice.' },
  { q: 'How do sessions take place?', a: 'All sessions are conducted via secure video call (Zoom or Google Meet). You can join from anywhere in the world.' },
  { q: 'Is everything confidential?', a: 'Absolutely. Every session is strictly private. Recordings are shared only with you and are never published or shared.' },
  { q: 'Can I reschedule or cancel?', a: 'Yes, you can reschedule up to 24 hours before your session. Cancellations within 24 hours are non-refundable.' },
  { q: 'What payment methods are accepted?', a: 'We accept credit/debit cards and UPI via Razorpay. All transactions are secure and encrypted.' },
]

export default function ConsultationPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Consultation' }]} />
        </div>

        {/* Hero */}
        <section className="py-16 text-center sm:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Video className="mr-1.5 size-3.5" />
              One-to-One Sessions
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Personalised Islamic
              <span className="text-primary"> Guidance</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Private sessions tailored to your unique journey. Rooted in Quran & Sunnah,
              delivered with compassion and understanding.
            </p>
          </div>
        </section>

        {/* Pricing tiers */}
        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl border p-6 transition-shadow hover:shadow-[var(--shadow-md)] ${
                    tier.popular
                      ? 'border-primary bg-primary/5 shadow-[var(--shadow-sm)]'
                      : 'border-border bg-card'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-6 inline-flex rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-semibold text-foreground">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">/ {tier.duration}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/account/bookings"
                    className={`mt-8 flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      tier.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    Book Now
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What to expect */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">What to Expect</h2>
              <p className="mt-3 text-muted-foreground">A simple, supportive process</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.title} className="text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <step.icon className="size-7 text-primary" />
                  </div>
                  <span className="mt-4 inline-flex size-7 items-center justify-center rounded-full bg-muted-foreground/10 text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">What Clients Say</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
                  <Quote className="mb-3 size-6 text-accent/50" />
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-border bg-card"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Islamic Consultation',
            provider: { '@type': 'Person', name: 'Iqra Khan' },
            description: 'Private one-to-one Islamic consultation and mentorship.',
            url: 'https://iqrakhan.com/consultation',
          }),
        }}
      />
    </>
  )
}
