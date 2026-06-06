import { Check, CalendarCheck, Clock, Video } from 'lucide-react'

const includes = [
  'A private, confidential 1-to-1 video session',
  'Personalised guidance rooted in Quran & Sunnah',
  'A clear, compassionate action plan',
  'Session recording & written follow-up notes',
]

const tiers = [
  {
    name: 'Clarity Call',
    duration: '30 minutes',
    price: '$60',
    desc: 'A focused session for one specific question or concern.',
  },
  {
    name: 'Deep Guidance',
    duration: '60 minutes',
    price: '$110',
    desc: 'Space to explore your situation in depth with a full plan.',
    featured: true,
  },
  {
    name: 'Mentorship',
    duration: '4 sessions',
    price: '$380',
    desc: 'Ongoing monthly support for lasting transformation.',
  },
]

export function ConsultationCta() {
  return (
    <section id="consultation" className="scroll-mt-20 bg-arabesque text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
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
                <Video className="size-4 text-accent" /> Online via Zoom
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-accent" /> Flexible time zones
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarCheck className="size-4 text-accent" /> Easy rescheduling
              </span>
            </div>
          </div>

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

            <a
              href="#"
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Book Your Session Now
            </a>
            <p className="text-center text-xs text-primary-foreground/60">
              Limited slots available each month · Secure checkout
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
