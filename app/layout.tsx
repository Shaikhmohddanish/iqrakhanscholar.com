import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Jost, Playfair_Display, Geist_Mono } from 'next/font/google'
import './globals.css'
import { readCart } from '@/lib/cart'
import { getActiveCurrency } from '@/lib/currency-server'
import { CartProvider } from '@/components/cart/cart-provider'
import { CurrencyProvider } from '@/components/currency/currency-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { ThemeProvider } from '@/components/theme-provider'
import { AdsenseLoader } from '@/components/ads/adsense-loader'
import { SITE_URL as siteUrl } from '@/lib/site-config'

const jost = Jost({
  variable: '--font-jost',
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
    'Authentic Islamic knowledge for the modern Muslim woman. Explore digital books, journals, free resources, video lessons, and one-to-one consultations rooted in Quran & Sunnah.',
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
      'Authentic Islamic knowledge for the modern Muslim woman - books, resources, and one-to-one mentorship.',
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
      className={`${jost.variable} ${playfair.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CurrencyProvider initialCurrency={currency}>
            <CartProvider initialItems={cart.items}>
              {children}
              <CookieConsent />
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
        <AdsenseLoader />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
