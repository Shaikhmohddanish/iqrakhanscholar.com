'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, User, ArrowRight } from 'lucide-react'
import { navLinks } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { CartButton } from '@/components/cart/cart-button'

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-colors duration-300',
          scrolled
            ? 'border-border bg-background/90 backdrop-blur-md'
            : 'border-transparent bg-background/40 backdrop-blur-sm',
        )}
      >
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* ── Left: Hamburger + Search (mobile) / Logo (desktop) ── */}
          <div className="flex items-center gap-1 lg:gap-2.5">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Search — mobile only */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground lg:hidden"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>

            {/* Logo — desktop only (left-aligned on desktop) */}
            <a href="#top" className="hidden items-center gap-2.5 lg:flex">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                IK
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-lg font-semibold text-foreground">
                  Iqra Khan
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Islamic Scholar
                </span>
              </span>
            </a>
          </div>

          {/* ── Center: Logo (mobile only, absolute centered) ── */}
          <a
            href="#top"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              IK
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-base font-semibold text-foreground">
                Iqra Khan
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Islamic Scholar
              </span>
            </span>
          </a>

          {/* ── Center: Nav links (desktop) ── */}
          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Right: User + Cart (mobile) / Sign In + CTA (desktop) ── */}
          <div className="ml-auto flex items-center gap-1 lg:gap-3">
            {/* Desktop CTA buttons */}
            <a
              href="/login"
              className="hidden h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-foreground/80 transition-colors hover:text-primary lg:inline-flex"
            >
              Sign In
            </a>
            <a
              href="#consultation"
              className="hidden h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:inline-flex"
            >
              Book a Session
            </a>

            {/* User icon — mobile only */}
            <a
              href="/login"
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground lg:hidden"
              aria-label="Account"
            >
              <User className="size-5" />
            </a>

            {/* Cart icon — always visible */}
            <CartButton />
          </div>
        </nav>

        {/* ── Search overlay ── */}
        {searchOpen && (
          <div className="search-overlay">
            <div className="search-overlay-inner">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search books, guides, resources..."
                className="search-overlay-input"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <>
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="mobile-drawer" role="dialog" aria-label="Navigation menu">
            <div className="mobile-drawer-header">
              <a href="#top" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  IK
                </span>
                <span className="font-heading text-base font-semibold text-foreground">
                  Iqra Khan
                </span>
              </a>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mobile-drawer-nav" aria-label="Main navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                  <ArrowRight />
                </a>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <a
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="drawer-cta drawer-cta-outline"
              >
                Sign In
              </a>
              <a
                href="#consultation"
                onClick={() => setDrawerOpen(false)}
                className="drawer-cta drawer-cta-primary"
              >
                Book a Session
              </a>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
