'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Menu,
  X,
  Search,
  ArrowRight,
  User,
  LayoutDashboard,
  BookMarked,
  ShoppingBag,
  CalendarClock,
  Settings,
  Heart,
  Bell,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { BarLoader } from '@/components/ui/bar-loader'
import { navLinks } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { CartButton } from '@/components/cart/cart-button'
import { logoutAction } from '@/app/actions/auth'
import type { PublicUser } from '@/lib/types'
import { hasRole } from '@/lib/types'
import { ThemeToggle } from '@/components/theme-toggle'

interface SmartHeaderProps {
  user?: PublicUser | null
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const accountLinks = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/library', label: 'My Books', icon: BookMarked },
  { href: '/account/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/bookings', label: 'Consultations', icon: CalendarClock },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

export function SmartHeader({ user }: SmartHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pending, startTransition] = useTransition()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  // Scroll detection
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

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarOpen) return
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [avatarOpen])

  // Close avatar dropdown on Escape
  useEffect(() => {
    if (!avatarOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setAvatarOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [avatarOpen])

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
    setAvatarOpen(false)
  }, [pathname])

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      await logoutAction()
      setAvatarOpen(false)
      router.replace('/')
      router.refresh()
    })
  }, [router])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Skip to content - accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          scrolled
            ? 'border-border bg-background shadow-[var(--shadow-sm)]'
            : 'border-transparent bg-background/40 backdrop-blur-sm',
        )}
      >
        <nav
          className="relative mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* ── Left: Hamburger + Search (mobile) / Logo (desktop) ── */}
          <div className="relative z-20 flex items-center gap-1 lg:gap-2.5">
            {/* Hamburger - mobile only */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Search - mobile only */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground lg:hidden"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>

            {/* Logo - desktop only (left-aligned on desktop) */}
            <Link href="/" className="hidden items-center gap-2.5 lg:flex">
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
            </Link>
          </div>

          {/* ── Center: Logo (mobile only, absolute centered) ── */}
          {/* pointer-events-none on the wrapper means only the link itself receives taps,
              not the full-width invisible box that would otherwise overlap the edge buttons */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center lg:hidden">
            <Link
              href="/"
              className="pointer-events-auto flex items-center gap-2"
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
            </Link>
          </div>

          {/* ── Center: Nav links (desktop) ── */}
          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-primary',
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* ── Right: Auth-aware actions ── */}
          <div className="relative z-20 ml-auto flex items-center gap-1 lg:gap-2">
            {user ? (
              <>
                {/* Desktop search button */}
                <button
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  className="hidden size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-primary lg:inline-flex"
                  aria-label="Search"
                >
                  <Search className="size-[18px]" />
                </button>

                {/* Notifications */}
                <Link
                  href="/account/notifications"
                  className="hidden size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-primary lg:inline-flex"
                  aria-label="Notifications"
                >
                  <Bell className="size-[18px]" />
                </Link>

                {/* Cart */}
                <CartButton />

                {/* Theme toggle - desktop */}
                <ThemeToggle className="hidden lg:inline-flex" />

                {/* Avatar dropdown - desktop */}
                <div className="relative hidden lg:block" ref={avatarRef}>
                  <button
                    type="button"
                    onClick={() => setAvatarOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-expanded={avatarOpen}
                    aria-haspopup="true"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {initials(user.name)}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {avatarOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card p-1.5 shadow-[var(--shadow-lg)] animate-scale-in">
                      {/* User info */}
                      <div className="px-3 py-2.5">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="mx-2 h-px bg-border" />

                      {/* Account links */}
                      <div className="py-1">
                        {accountLinks.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setAvatarOpen(false)}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                isActive(item.href)
                                  ? 'bg-secondary text-primary font-medium'
                                  : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                              )}
                            >
                              <Icon className="size-4" />
                              {item.label}
                            </Link>
                          )
                        })}

                        {/* Admin link */}
                        {hasRole(user.role, 'admin') && (
                          <>
                            <div className="mx-2 my-1 h-px bg-border" />
                            <Link
                              href="/admin"
                              onClick={() => setAvatarOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                            >
                              <ShieldCheck className="size-4" />
                              Admin Portal
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="mx-2 h-px bg-border" />

                      {/* Sign out */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={pending}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                      >
                        {pending ? (
                          <BarLoader size="md" />
                        ) : (
                          <LogOut className="size-4" />
                        )}
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

                {/* User icon - mobile only (links to account) */}
                <Link
                  href="/account"
                  className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground lg:hidden"
                  aria-label="Account"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {initials(user.name)}
                  </span>
                </Link>
              </>
            ) : (
              <>
                {/* Desktop search */}
                <button
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  className="hidden size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-primary lg:inline-flex"
                  aria-label="Search"
                >
                  <Search className="size-[18px]" />
                </button>

                {/* Cart */}
                <CartButton />

                {/* Theme toggle - desktop */}
                <ThemeToggle className="hidden lg:inline-flex" />

                {/* Desktop: Sign In + CTA */}
                <Link
                  href="/login"
                  className="hidden h-9 items-center justify-center rounded-full px-4 text-sm font-medium text-foreground/80 transition-colors hover:text-primary lg:inline-flex"
                >
                  Sign In
                </Link>
                <Link
                  href="/consultation"
                  className="hidden h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:inline-flex"
                >
                  Book a Session
                </Link>

                {/* Mobile user icon */}
                <Link
                  href="/login"
                  className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground lg:hidden"
                  aria-label="Sign in"
                >
                  <User className="size-5" />
                </Link>
              </>
            )}
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
                placeholder="Search books, products, articles..."
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

            {/* Main site nav */}
            <nav className="mobile-drawer-nav" aria-label="Main navigation">
              <Link href="/" onClick={() => setDrawerOpen(false)}>
                Home
                <ArrowRight />
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                  <ArrowRight />
                </Link>
              ))}
            </nav>

            {/* Account links if logged in */}
            {user && (
              <>
                <div className="mx-4 h-px bg-border" />
                <div className="px-4 pb-1 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    My Account
                  </p>
                </div>
                <nav className="mobile-drawer-nav !pt-0" aria-label="Account navigation">
                  {accountLinks.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="size-4" />
                          {item.label}
                        </span>
                        <ArrowRight />
                      </Link>
                    )
                  })}
                  {hasRole(user.role, 'admin') && (
                    <Link href="/admin" onClick={() => setDrawerOpen(false)}>
                      <span className="flex items-center gap-3 text-primary">
                        <ShieldCheck className="size-4" />
                        Admin Portal
                      </span>
                      <ArrowRight />
                    </Link>
                  )}
                </nav>
              </>
            )}

            <div className="mobile-drawer-footer">
              {/* Theme toggle - always visible in drawer */}
              <ThemeToggle variant="labeled" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-2">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {initials(user.name)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false)
                      handleLogout()
                    }}
                    disabled={pending}
                    className="drawer-cta drawer-cta-outline text-destructive"
                  >
                    {pending ? (
                      <BarLoader size="md" className="mr-2" />
                    ) : (
                      <LogOut className="mr-2 size-4" />
                    )}
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="drawer-cta drawer-cta-outline"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/consultation"
                    onClick={() => setDrawerOpen(false)}
                    className="drawer-cta drawer-cta-primary"
                  >
                    Book a Session
                  </Link>
                </>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  )
}
