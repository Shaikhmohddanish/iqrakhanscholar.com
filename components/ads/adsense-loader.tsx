'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

// Routes where ads must never load: paid content (reader/checkout), auth flows,
// and private account/admin areas. Auto Ads will only appear on the remaining
// public marketing/blog pages. Keep this list in sync with AdSense dashboard
// page exclusions as a second layer of defence.
const EXCLUDED_PREFIXES = [
  '/checkout',
  '/cart',
  '/order',
  '/account',
  '/admin',
  '/reader',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/2fa',
  '/verify-email',
  '/account-recovery',
]

/**
 * Loads the Google AdSense Auto Ads script. No-ops entirely when
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID is unset (so nothing ships pre-launch) or when
 * the current route is in EXCLUDED_PREFIXES.
 */
export function AdsenseLoader() {
  const pathname = usePathname()

  if (!AD_CLIENT) return null
  if (EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null
  }

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
    />
  )
}
