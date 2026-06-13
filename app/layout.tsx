import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import './globals.css'
import { readCart } from '@/lib/cart'
import { CartProvider } from '@/components/cart/cart-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
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

const siteUrl = 'https://iqrakhan.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Iqra Khan — Islamic Scholar, Educator & Mentor for Muslim Women',
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
    title: 'Iqra Khan — Authentic Islamic Knowledge for Modern Muslim Women',
    description:
      'Learn. Grow. Transform your life through Quran & Sunnah with books, courses, and personal mentorship.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iqra Khan — Islamic Scholar & Educator',
    description:
      'Authentic Islamic knowledge for the modern Muslim woman — books, resources, and one-to-one mentorship.',
  },
  alternates: {
    canonical: siteUrl,
  },
  generator: 'v0.app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cart = await readCart()
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider initialItems={cart.items}>
            {children}
            <CookieConsent />
          </CartProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
