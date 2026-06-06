import Image from 'next/image'
import { stats } from '@/lib/site-data'

const pillars = [
  {
    title: 'Why I Started',
    text: 'I saw so many Muslim women longing to connect with their Deen but feeling overwhelmed or unseen. I wanted to build a calm, judgement-free space to learn.',
  },
  {
    title: 'My Mission',
    text: 'To make authentic Islamic knowledge accessible, beautiful, and deeply practical for everyday life — grounded firmly in Quran and Sunnah.',
  },
  {
    title: 'My Vision',
    text: 'A global community of women who feel confident, anchored, and joyful in their faith — supporting one another every step of the way.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-border shadow-xl">
              <Image
                src="/iqra-about.png"
                alt="Iqra Khan studying the Quran in her home study"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -right-4 -bottom-6 hidden rounded-2xl border border-border bg-accent px-5 py-4 text-accent-foreground shadow-lg sm:block">
              <p className="font-heading text-2xl font-bold">10+ yrs</p>
              <p className="text-xs font-medium">of teaching & study</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Assalamu Alaikum, I&apos;m Iqra
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              Helping Muslim women live with faith, purpose &amp; peace
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              For over a decade I&apos;ve studied the Islamic sciences under
              qualified scholars and walked alongside thousands of women on their
              journey back to Allah. My work blends classical knowledge with the
              real challenges of modern life.
            </p>

            <div className="mt-8 space-y-6">
              {pillars.map((p) => (
                <div key={p.title} className="border-l-2 border-accent pl-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card px-6 py-8 text-center"
            >
              <p className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
