'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Search, User, ArrowRight } from 'lucide-react'
import { CartButton } from '@/components/cart/cart-button'

const links = [
  { label: 'All Products', href: '/store' },
  { label: 'Digital', href: '/store?type=digital' },
  { label: 'Physical', href: '/store?type=physical' },
  { label: 'Account', href: '/account' },
]

const desktopLinks = [
  { label: 'All', href: '/store' },
  { label: 'Digital', href: '/store?type=digital' },
  { label: 'Physical', href: '/store?type=physical' },
]

export function StoreHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

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
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* ── Left: Hamburger + Search (mobile) / Logo (desktop) ── */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Hamburger - mobile only */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground sm:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Search - mobile only */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground sm:hidden"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>

            {/* Logo - desktop (left-aligned) */}
            <Link href="/" className="hidden items-center gap-2 sm:flex">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-base font-bold text-primary-foreground">
                IK
              </span>
              <span className="font-heading text-lg font-semibold text-foreground">
                Iqra Khan
              </span>
            </Link>
          </div>

          {/* ── Center: Logo (mobile only, absolute centered) ── */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
              IK
            </span>
            <span className="font-heading text-base font-semibold text-foreground">
              Iqra Khan
            </span>
          </Link>

          {/* ── Center: Nav links (desktop) ── */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 sm:flex"
            aria-label="Store categories"
          >
            {desktopLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Right: User + Cart (mobile) / Account + Cart (desktop) ── */}
          <div className="ml-auto flex items-center gap-1">
            {/* Account - desktop only */}
            <Link
              href="/account"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline-flex"
            >
              Account
            </Link>

            {/* User icon - mobile only */}
            <Link
              href="/account"
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground sm:hidden"
              aria-label="Account"
            >
              <User className="size-5" />
            </Link>

            {/* Cart icon */}
            <CartButton />
          </div>
        </div>

        {/* ── Search overlay ── */}
        {searchOpen && (
          <div className="search-overlay">
            <div className="search-overlay-inner">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search products..."
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
          <aside className="mobile-drawer" role="dialog" aria-label="Store navigation">
            <div className="mobile-drawer-header">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  IK
                </span>
                <span className="font-heading text-base font-semibold text-foreground">
                  Iqra Khan
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mobile-drawer-nav" aria-label="Store navigation">
              <Link href="/" onClick={() => setDrawerOpen(false)}>
                Home
                <ArrowRight />
              </Link>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                  <ArrowRight />
                </Link>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="drawer-cta drawer-cta-outline"
              >
                Back to Main Site
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
