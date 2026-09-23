'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { hasConsent, onConsentChange } from '@/lib/consent'

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

// Ads run on the blog and nowhere else.
//
// This was previously a deny-list, which meant every route not explicitly
// excluded got ads - including the homepage, /store, /library, /consultation
// and the legal pages. Auto Ads costs 150-400ms of main-thread work and injects
// elements after load (a direct CLS contributor), so it was being paid for on
// exactly the commercial pages where it earns nothing and hurts conversion.
// An allow-list also makes /cookie-policy's claim that we show ads "on our
// blog and content pages" true, and cannot silently start covering a new route.
const ALLOWED_PREFIX = '/blog'

/**
 * Loads the Google AdSense Auto Ads script on blog routes only.
 *
 * No-ops when NEXT_PUBLIC_ADSENSE_CLIENT_ID is unset (so nothing ships
 * pre-launch), off the blog, and until the visitor has consented to marketing
 * cookies.
 */
export function AdsenseLoader() {
  const pathname = usePathname()
  const [marketingAllowed, setMarketingAllowed] = useState(false)

  // Read consent after mount (localStorage is unavailable during SSR) and again
  // whenever the banner saves a choice, so accepting loads ads without a reload.
  useEffect(() => {
    const sync = () => setMarketingAllowed(hasConsent('marketing'))
    sync()
    return onConsentChange(sync)
  }, [])

  if (!AD_CLIENT) return null
  if (pathname !== ALLOWED_PREFIX && !pathname.startsWith(`${ALLOWED_PREFIX}/`)) {
    return null
  }
  if (!marketingAllowed) return null

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
    />
  )
}
