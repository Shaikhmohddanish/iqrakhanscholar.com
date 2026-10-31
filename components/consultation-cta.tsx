import Link from 'next/link'
import { Check, CalendarCheck, Clock, Mic } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SESSION_TYPES } from '@/lib/booking-types'
import { formatPrice } from '@/lib/product-types'

// Sessions are AUDIO on Google Meet, not video. The wording and the icon both
// said video while the consultation page and its FAQ said audio.
const includes = [
  'A private, confidential 1-to-1 audio session on Google Meet',
  'Personalised guidance rooted in Quran & Sunnah',
  'A clear, compassionate action plan',
  'Session recording & written follow-up notes',
]

// Derived from SESSION_TYPES - the same source the booking wizard prices
// against - rather than hand-written here.
//
// This block previously hardcoded "Clarity Call $60 / Deep Guidance $110 /
// Mentorship $380": tier names that existed nowhere else on the site, in a
// currency the store no longer sells in, on the homepage, while /consultation
// and the actual checkout charged Rs.2,100 / Rs.4,100 / Rs.13,600. Deriving
// them means a price change can never leave this section stale again.
const tiers = SESSION_TYPES.map((s, i) => ({
  name: s.title,
  duration: s.id === 'package-3x60' ? '3 × 60 minutes' : `${s.duration} minutes`,
  price: formatPrice(s.price, s.currency),
  desc: s.description,
  featured: i === 1,
}))

export function ConsultationCta() {
  return (
    <section id="consultation" className="scroll-mt-20 bg-arabesque text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              One-to-One Consultation
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold sm:text-4xl">
              Need personal guidance?
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
              Sometimes you need more than a book. Sit down with me, one-to-one,
              for compassionate guidance tailored to exactly where you are in
              your journey.
            </p>

            <ul className="mt-8 space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-3" />
                  </span>
                  <span className="text-sm text-primary-foreground/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-primary-foreground/80">
              <span className="inline-flex items-center gap-2">
                <Mic className="size-4 text-accent" /> Audio call on Google Meet
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-accent" /> Session times in IST
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarCheck className="size-4 text-accent" /> Easy rescheduling
              </span>
            </div>
          </div>
          </Reveal>

          <Reveal delay={100}>
          <div className="space-y-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition-colors ${
                  tier.featured
                    ? 'border-accent bg-primary-foreground/10'
                    : 'border-primary-foreground/15 bg-primary-foreground/5 hover:bg-primary-foreground/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold">
                      {tier.name}
                    </h3>
                    {tier.featured && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-primary-foreground/70">
                    {tier.duration} · {tier.desc}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xl font-bold">{tier.price}</p>
                </div>
              </div>
            ))}

            <Link
              href="/consultation"
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Book Your Session Now
            </Link>
            {/* No "limited slots each month" claim: no monthly cap exists
                anywhere in the code, and manufactured scarcity on a scholar's
                site is both untrue and a bad look. */}
            <p className="text-center text-xs text-primary-foreground/60">
              Secure checkout via Razorpay · Reschedule within 2 hours
            </p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
