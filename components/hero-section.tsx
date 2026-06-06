import Image from 'next/image'
import { Star, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-20 lg:pb-24">
        {/* Copy */}
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary">
            <span className="size-1.5 rounded-full bg-accent" />
            Bismillah · Welcome to a calmer path
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl leading-[1.05] font-semibold text-foreground sm:text-5xl lg:text-6xl">
            Authentic Islamic Knowledge for the{' '}
            <span className="text-primary">Modern Muslim Woman</span>
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Learn. Grow. Transform your life through Quran &amp; Sunnah — with
            trusted books, guided resources, and personal mentorship rooted in
            timeless wisdom.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#digital"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Books
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#consultation"
              className="inline-flex h-12 items-center justify-center rounded-full border border-primary/25 bg-background px-7 text-sm font-medium text-primary transition-colors hover:bg-secondary"
            >
              Book Consultation
            </a>
            <a
              href="#community"
              className="inline-flex h-12 items-center justify-center rounded-full px-4 text-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Join the Community
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {['/avatar-1.png', '/avatar-2.png', '/avatar-3.png'].map((src) => (
                <span
                  key={src}
                  className="relative size-10 overflow-hidden rounded-full border-2 border-background"
                >
                  <Image
                    src={src || '/placeholder.svg'}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Trusted by{' '}
                <span className="font-semibold text-foreground">12,000+</span>{' '}
                students worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-primary/10 lg:max-w-lg">
            <Image
              src="/iqra-hero.png"
              alt="Iqra Khan, Islamic scholar and educator"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-6 left-2 hidden rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:block lg:-left-6">
            <p className="font-heading text-sm font-semibold text-foreground">
              “Verily, with hardship comes ease.”
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Quran 94:6</p>
          </div>
        </div>
      </div>

      {/* decorative arabesque gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 -z-0 size-72 rounded-full bg-accent/10 blur-3xl"
      />
    </section>
  )
}
