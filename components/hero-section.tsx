import Image from 'next/image'
import Link from 'next/link'
import { Star, ArrowRight, GraduationCap } from 'lucide-react'
import { CountUp } from '@/components/count-up'
import { HeroVideo } from '@/components/hero-video'

/** The e-book to showcase in the hero, if there is a real one to show. */
export interface HeroEbook {
  title: string
  image: string
  href: string
}

interface HeroSectionProps {
  /** Optional path to a full-bleed background video (mp4 / webm) shown behind the hero. */
  videoSrc?: string
  /** Featured e-book cover. When absent, the hero falls back to the portrait. */
  ebook?: HeroEbook | null
}

export function HeroSection({ videoSrc, ebook }: HeroSectionProps = {}) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Full-bleed background video + readability overlay */}
      {videoSrc && (
        <>
          <HeroVideo src={videoSrc} poster="/video/poster.webp" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/90 via-background/75 to-background/60"
          />
        </>
      )}

      {/* Decorative blobs + pattern. Always rendered: HeroVideo mounts nothing on
          mobile (so phones never download the video), and this is what mobile
          visitors see instead. On desktop the video paints over it. Static (no
          infinite animation) so it stays cheap either way. */}
      {
        <>
          {/* Soft background blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full bg-primary/8 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 -right-24 size-[380px] rounded-full bg-accent/10 blur-[80px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-1/3 size-[320px] rounded-full bg-primary/6 blur-[90px]"
          />

          {/* Islamic geometric dot pattern (subtle) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.025] bg-arabesque"
          />
        </>
      }

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-20 lg:pb-24">
        {/* ── Copy ── */}
        <div className="relative max-w-xl">
          {/* Welcoming badge */}
          <span
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary animate-fade-in-up animate-delay-100"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            Bismillah · Welcome to a calmer path
          </span>

          <h1
            className="mt-6 text-balance font-heading text-4xl leading-[1.05] font-semibold text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up animate-delay-200"
          >
            Authentic Islamic Guidance &amp; Modest Living for the{' '}
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
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02]"
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
              {['/avatar-1.webp', '/avatar-2.webp', '/avatar-3.webp'].map((src) => (
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
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-ink">
                <GraduationCap className="size-3.5 shrink-0" />
                7-year Aalimiyyah degree under qualified scholars
              </p>
            </div>
          </div>
        </div>

        {/* ── Visual ── */}
        <div className="relative animate-fade-in-up animate-delay-200">
          {ebook ? (
            /* E-book showcase. A cover sits ON a backdrop rather than being
               cropped by one, so the panel carries the texture and the cover is
               object-contain inside it. */
            <Link
              // /store/<slug>, not /library/<slug>: proxy.ts gates /library
              // behind auth, so a library link would bounce every logged-out
              // visitor to /login from the hero.
              href={ebook.href}
              aria-label={`View ${ebook.title}`}
              className="group relative mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-secondary via-background to-secondary shadow-2xl shadow-primary/10 lg:max-w-lg"
            >
              <span
                aria-hidden
                className="absolute inset-0 opacity-[0.04] bg-arabesque"
              />
              <Image
                src={ebook.image}
                alt={ebook.title}
                width={420}
                height={560}
                priority
                className="relative h-auto w-[62%] rounded-lg object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 62vw, 320px"
              />
            </Link>
          ) : (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-primary/10 lg:max-w-lg">
              {/* Portrait */}
              <Image
                src="/hero-portrait.webp"
                alt="Iqra Khan, Islamic scholar and educator"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 448px, 512px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
            </div>
          )}

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
