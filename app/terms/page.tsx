import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Iqra Khan terms of service governing the use of our platform, digital products, consultations, and store.',
}

const sections = [
  { id: 'acceptance', title: 'Acceptance' },
  { id: 'accounts', title: 'Accounts' },
  { id: 'digital-products', title: 'Digital Products' },
  { id: 'physical-products', title: 'Physical Products' },
  { id: 'consultations', title: 'Consultations' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'prohibited', title: 'Prohibited Uses' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'governing-law', title: 'Governing Law' },
]

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <LegalPageLayout title="Terms of Service" lastUpdated="15 June 2026" sections={sections}>
          <section id="acceptance">
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using iqrakhan.com (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
          </section>

          <section id="accounts">
            <h2>User Accounts</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your credentials. We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section id="digital-products">
            <h2>Digital Products</h2>
            <p>Digital products (ebooks, guides, study materials) are licensed for personal, non-commercial use only. You may not:</p>
            <ul>
              <li>Redistribute, share, or resell digital products</li>
              <li>Copy, modify, or create derivative works</li>
              <li>Attempt to download, export, or circumvent reading restrictions</li>
              <li>Share account access to bypass purchase requirements</li>
            </ul>
            <p>Digital products are delivered via our in-browser reader and are non-refundable once accessed.</p>
          </section>

          <section id="physical-products">
            <h2>Physical Products</h2>
            <p>Physical products are subject to our <Link href="/refund-policy">Refund Policy</Link>. Prices are displayed in the relevant currency and include applicable taxes. Shipping costs are calculated at checkout.</p>
          </section>

          <section id="consultations">
            <h2>Consultations</h2>
            <p>Consultation sessions are personal guidance sessions and do not constitute professional counselling, therapy, or legal advice. Sessions can be rescheduled up to 24 hours in advance. No-shows are non-refundable.</p>
          </section>

          <section id="intellectual-property">
            <h2>Intellectual Property</h2>
            <p>All content on the Platform — including text, graphics, logos, images, digital products, and course materials — is owned by Iqra Khan and protected by copyright law. Unauthorised reproduction is strictly prohibited.</p>
          </section>

          <section id="prohibited">
            <h2>Prohibited Uses</h2>
            <ul>
              <li>Using the Platform for any unlawful purpose</li>
              <li>Attempting to gain unauthorised access to any systems</li>
              <li>Scraping, harvesting, or collecting data without permission</li>
              <li>Uploading malicious code or content</li>
              <li>Impersonating another person or entity</li>
            </ul>
          </section>

          <section id="liability">
            <h2>Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Iqra Khan shall not be liable for any indirect, incidental, or consequential damages arising from use of the Platform. Our total liability is limited to the amount paid for the relevant product or service.</p>
          </section>

          <section id="changes">
            <h2>Changes to Terms</h2>
            <p>We may update these terms from time to time. Material changes will be notified via email or a prominent notice on the Platform. Continued use after changes constitutes acceptance.</p>
          </section>

          <section id="governing-law">
            <h2>Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of England.</p>
          </section>
        </LegalPageLayout>
      </main>
      <SiteFooter />
    </>
  )
}
