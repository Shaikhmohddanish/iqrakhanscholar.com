import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/cart-provider'
import { CurrencyProvider } from '@/components/currency/currency-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { AdsenseLoader } from '@/components/ads/adsense-loader'
import { AnnouncementBar } from '@/components/announcement-bar'
import { WhatsappButton } from '@/components/whatsapp-button'
import { StructuredData } from '@/components/structured-data'
import { SITE_URL as siteUrl } from '@/lib/site-config'

// Poppins has no variable-font build on Google Fonts, so weights are explicit.
// Each weight is a separate file fetched on first paint, so only the ones the
// design actually uses are listed. 300 was loaded on every page with zero
// `font-light` utilities in the codebase. 700 stays - `font-bold` is used on
// Poppins elements (prices, badges, counters) and dropping it would leave the
// browser to synthesise a fake bold.
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Iqra Khan - Islamic Scholar, Educator & Mentor for Muslim Women',
    template: '%s | Iqra Khan',
  },
  // Leads with what the site actually offers rather than generic phrasing, and
  // stays inside the ~155 chars search results display.
  description:
    'One-to-one Islamic consultation, e-books and modest wear from Iqra Khan Scholar — guidance rooted in Quran & Sunnah, from a 7-year Aalimiyyah graduate.',
  // No `keywords` meta: search engines have ignored it for years and a stuffed
  // list reads as spam to anyone inspecting the page.
  authors: [{ name: 'Iqra Khan' }],
  creator: 'Iqra Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Iqra Khan',
    title: 'Iqra Khan - Authentic Islamic Guidance & Modest Living for the Modern Muslim Woman',
    description:
      'Learn. Grow. Transform your life through Quran & Sunnah with books, courses, and personal mentorship.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iqra Khan - Islamic Scholar & Educator',
    description:
      'From e-books to one-to-one mentorship with Iqra Khan Scholar — authentic Islamic knowledge, rooted in Quran & Sunnah.',
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  generator: 'v0.app',
}

// Deliberately NOT async, and deliberately reads no cookies or headers.
//
// This layout previously did `await readCart()` and `await getActiveCurrency()`,
// both of which touch next/headers. In a ROOT layout that opts the entire
// application out of static rendering: every route rendered on demand, and the
// `export const revalidate = 3600` on the homepage and blog was dead code.
// /terms and /privacy - static text with no data at all - were hitting a server
// function on every request.
//
// Both providers now resolve their own state on the client: CartProvider
// hydrates from the (non-httpOnly) cart cookie, and the store is INR-only so
// there is no currency to resolve per visitor. Pages that genuinely need
// server-side currency still call getActiveCurrency() themselves and stay
// dynamic, which is correct.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${poppins.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased">
        <CurrencyProvider>
          <CartProvider>
            <AnnouncementBar />
            {children}
            <CookieConsent />
            <WhatsappButton />
          </CartProvider>
        </CurrencyProvider>
        <AdsenseLoader />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
