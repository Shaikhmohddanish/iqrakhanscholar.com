import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How iqrakhan.com uses cookies and similar technologies.',
}

const sections = [
  { id: 'what-are', title: 'What Are Cookies' },
  { id: 'types', title: 'Types We Use' },
  { id: 'manage', title: 'Managing Cookies' },
  { id: 'contact', title: 'Contact' },
]

export default function CookiePolicyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <LegalPageLayout title="Cookie Policy" lastUpdated="15 June 2026" sections={sections}>
          <section id="what-are">
            <h2>What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>
          </section>

          <section id="types">
            <h2>Types of Cookies We Use</h2>
            <h3>Necessary Cookies</h3>
            <p>These cookies are essential for the website to function. They include session cookies for authentication, cart functionality, and cookie consent preferences. They cannot be disabled.</p>

            <h3>Analytics Cookies</h3>
            <p>With your consent, we use analytics cookies (Vercel Analytics) to understand how visitors interact with our website. This data is anonymised and helps us improve the user experience.</p>

            <h3>Marketing Cookies</h3>
            <p>With your consent, we may use marketing cookies to deliver personalised content and advertisements. We currently do not use third-party advertising cookies.</p>
          </section>

          <section id="manage">
            <h2>Managing Your Cookie Preferences</h2>
            <p>You can manage your cookie preferences at any time by:</p>
            <ul>
              <li>Using the cookie consent banner (shown on your first visit)</li>
              <li>Clearing cookies through your browser settings</li>
              <li>Using browser extensions that block cookies</li>
            </ul>
            <p>Please note that disabling necessary cookies may affect website functionality.</p>
          </section>

          <section id="contact">
            <h2>Contact Us</h2>
            <p>For questions about our cookie practices, email <a href="mailto:privacy@iqrakhan.com">privacy@iqrakhan.com</a>.</p>
          </section>
        </LegalPageLayout>
      </main>
      <SiteFooter />
    </>
  )
}
