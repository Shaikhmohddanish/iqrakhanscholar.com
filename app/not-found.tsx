import Link from 'next/link'
import { Home, Search, BookOpen, ShoppingBag, MessageCircle } from 'lucide-react'

const popularLinks = [
  { label: 'Digital Library', href: '/library', icon: BookOpen },
  { label: 'Store', href: '/store', icon: ShoppingBag },
  { label: 'Consultations', href: '/consultation', icon: MessageCircle },
]

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="currentColor" />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" />
              <circle cx="60" cy="0" r="1.5" fill="currentColor" />
              <circle cx="0" cy="60" r="1.5" fill="currentColor" />
              <circle cx="60" cy="60" r="1.5" fill="currentColor" />
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" className="text-primary" />
        </svg>
      </div>

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* Animated 404 */}
        <div className="relative">
          <span className="font-heading text-[10rem] font-bold leading-none text-primary/10 sm:text-[12rem]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
              <Search className="size-10 text-primary" />
            </div>
          </div>
        </div>

        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        {/* Search */}
        <div className="mt-8 w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search for something..."
              className="input-base w-full pl-9"
            />
          </div>
        </div>

        {/* Popular links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {popularLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Home CTA */}
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Home className="size-4" />
          Return Home
        </Link>
      </div>
    </div>
  )
}
