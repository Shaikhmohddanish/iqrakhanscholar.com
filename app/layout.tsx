import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Poppins, Playfair_Display, Geist_Mono } from 'next/font/google'
import './globals.css'
import { readCart } from '@/lib/cart'
import { getActiveCurrency } from '@/lib/currency-server'
import { CartProvider } from '@/components/cart/cart-provider'
import { CurrencyProvider } from '@/components/currency/currency-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { AdsenseLoader } from '@/components/ads/adsense-loader'
import { SITE_URL as siteUrl } from '@/lib/site-config'

// Poppins has no variable-font build on Google Fonts, so weights are explicit.
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Iqra Khan - Islamic Scholar, Educator & Mentor for Muslim Women',
    template: '%s | Iqra Khan',
  },
  description:
    'From e-books to one-to-one mentorship with Iqra Khan Scholar — authentic Islamic knowledge, rooted in Quran & Sunnah, guiding you every step of the way!',
  keywords: [
    'Islamic scholar',
    'Islamic guidance',
    'Islamic education',
    'Quran learning',
    'Muslim women education',
    'Islamic consultation',
    'Islamic books',
    'Iqra Khan',
  ],
  authors: [{ name: 'Iqra Khan' }],
  creator: 'Iqra Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Iqra Khan',
    title: 'Iqra Khan - Authentic Islamic Knowledge for Modern Muslim Women',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cart = await readCart()
  const currency = await getActiveCurrency()
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${poppins.variable} ${playfair.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <CurrencyProvider initialCurrency={currency}>
          <CartProvider initialItems={cart.items}>
            {children}
            <CookieConsent />
          </CartProvider>
        </CurrencyProvider>
        <AdsenseLoader />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
