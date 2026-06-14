import Image from 'next/image'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { CountUp } from '@/components/count-up'

interface HeroSectionProps {
  /** Optional path to a full-bleed background video (mp4 / webm) shown behind the hero. */
  videoSrc?: string
}

export function HeroSection({ videoSrc }: HeroSectionProps = {}) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Full-bleed background video + readability overlay */}
      {videoSrc && (
        <>
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster="/iqra-hero.png"
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/90 via-background/75 to-background/60"
          />
        </>
      )}

      {/* Decorative blobs + pattern - skipped when a video carries the visual interest
          (they're barely visible over video and add costly per-frame compositing). */}
      {!videoSrc && (
        <>
          {/* Drifting background blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full bg-primary/8 blur-[100px] animate-float-slow"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 -right-24 size-[380px] rounded-full bg-accent/10 blur-[80px] animate-float-slow-2"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-1/3 size-[320px] rounded-full bg-primary/6 blur-[90px] animate-float-slow"
            style={{ animationDelay: '4s' }}
          />

          {/* Islamic geometric dot pattern (subtle) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.025] bg-arabesque"
          />
        </>
      )}

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-20 lg:pb-24">
        {/* ── Copy ── */}
        <div className="relative max-w-xl">
          {/* Welcoming badge */}
          <span
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary animate-fade-in-up animate-delay-100"
          >
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            Bismillah · Welcome to a calmer path
          </span>

          <h1
            className="mt-6 text-balance font-heading text-4xl leading-[1.05] font-semibold text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up animate-delay-200"
          >
            Authentic Islamic Knowledge for the{' '}
            <span className="text-primary relative">
              Modern Muslim Woman
              {/* Gold underline accent */}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-accent/60 animate-fade-in-up animate-delay-400"
              />
            </span>
          </h1>

          <p
            className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-in-up animate-delay-300"
          >
            Learn. Grow. Transform your life through Quran &amp; Sunnah - with
            trusted books, guided resources, and personal mentorship rooted in
            timeless wisdom.
          </p>

          <div
            className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up animate-delay-400"
          >
            <Link
              href="/store"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              Explore Books
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/consultation"
              className="inline-flex h-12 items-center justify-center rounded-full border border-primary/25 bg-background px-7 text-sm font-medium text-primary transition-colors hover:bg-secondary"
            >
              Book Consultation
            </Link>
            <Link
              href="#community"
              className="inline-flex h-12 items-center justify-center rounded-full px-4 text-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Join the Community
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="mt-10 flex items-center gap-4 animate-fade-in-up animate-delay-500"
          >
            <div className="flex -space-x-3">
              {['/avatar-1.png', '/avatar-2.png', '/avatar-3.png'].map((src) => (
                <span
                  key={src}
                  className="relative size-10 overflow-hidden rounded-full border-2 border-background"
                >
                  <Image
                    src={src}
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
                <strong className="font-semibold text-foreground">
                  <CountUp to={12000} suffix="+" />
                </strong>{' '}
                students worldwide
              </p>
            </div>
          </div>
        </div>

        {/* ── Visual ── */}
        <div className="relative animate-fade-in-up animate-delay-200">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-primary/10 lg:max-w-lg">
            {/* Portrait with slow Ken Burns zoom */}
            <Image
              src="/iqra-hero.png"
              alt="Iqra Khan, Islamic scholar and educator"
              fill
              priority
              className="object-cover animate-ken-burns"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>

          {/* Floating Quran quote card */}
          <div className="absolute -bottom-6 left-2 hidden rounded-2xl border border-border bg-card/95 p-4 shadow-xl sm:block lg:-left-6">
            <p className="font-heading text-sm font-semibold text-foreground">
              &ldquo;Verily, with hardship comes ease.&rdquo;
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Quran 94:6</p>
          </div>

          {/* Gold accent dot cluster */}
          <div
            aria-hidden
            className="absolute -top-6 -right-4 hidden size-24 lg:block"
          >
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full bg-accent/40"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
