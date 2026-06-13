'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie, Shield } from 'lucide-react'

const CONSENT_KEY = 'ik-cookie-consent'

type ConsentChoice = {
  necessary: true
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      // Delay showing to avoid layout shift on first paint
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function saveConsent(choice: ConsentChoice) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(choice))
    // Also set a cookie for server-side reading
    document.cookie = `cookie-consent=${encodeURIComponent(JSON.stringify(choice))};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`
    setVisible(false)
  }

  function handleAcceptAll() {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    })
  }

  function handleRejectNonEssential() {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    })
  }

  function handleSavePreferences() {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    })
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 animate-slide-in-bottom"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-xl)]">
        {!showPreferences ? (
          <>
            {/* Main banner */}
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Cookie className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-foreground">
                  We value your privacy
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  We use cookies to enhance your experience, analyse site traffic, and for marketing.
                  You can manage your preferences or read our{' '}
                  <Link href="/cookie-policy" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Cookie Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss cookie banner"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="h-9 rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Manage Preferences
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preferences panel */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Cookie Preferences</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Back to main consent"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Necessary — always on */}
              <label className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Necessary</p>
                  <p className="text-xs text-muted-foreground">Required for core functionality</p>
                </div>
                <div className="relative">
                  <input type="checkbox" checked disabled className="peer sr-only" />
                  <div className="h-6 w-10 rounded-full bg-primary" />
                  <div className="absolute left-[18px] top-[2px] size-5 rounded-full bg-white shadow" />
                </div>
              </label>

              {/* Analytics */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Analytics</p>
                  <p className="text-xs text-muted-foreground">Help us understand how you use the site</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className={`h-6 w-10 rounded-full transition-colors ${analytics ? 'bg-primary' : 'bg-border'}`} />
                  <div className={`absolute top-[2px] size-5 rounded-full bg-white shadow transition-transform ${analytics ? 'left-[18px]' : 'left-[2px]'}`} />
                </div>
              </label>

              {/* Marketing */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Marketing</p>
                  <p className="text-xs text-muted-foreground">Personalised ads and promotions</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className={`h-6 w-10 rounded-full transition-colors ${marketing ? 'bg-primary' : 'bg-border'}`} />
                  <div className={`absolute top-[2px] size-5 rounded-full bg-white shadow transition-transform ${marketing ? 'left-[18px]' : 'left-[2px]'}`} />
                </div>
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="h-9 flex-1 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Accept All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
