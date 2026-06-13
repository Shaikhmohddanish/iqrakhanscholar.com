import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Iqra Khan privacy policy — how we collect, use, and protect your personal data in compliance with GDPR.',
}

const sections = [
  { id: 'controller', title: 'Data Controller' },
  { id: 'data-collected', title: 'Data We Collect' },
  { id: 'purpose', title: 'Purpose of Processing' },
  { id: 'legal-basis', title: 'Legal Basis' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'third-parties', title: 'Third Parties' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'contact', title: 'Contact Us' },
]

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <LegalPageLayout title="Privacy Policy" lastUpdated="15 June 2026" sections={sections}>
          <section id="controller">
            <h2>Data Controller</h2>
            <p>The data controller responsible for your personal data is:</p>
            <p><strong>Iqra Khan</strong><br />Email: privacy@iqrakhan.com<br />Website: https://iqrakhan.com</p>
          </section>

          <section id="data-collected">
            <h2>Data We Collect</h2>
            <p>We collect the following types of personal data:</p>
            <ul>
              <li><strong>Account data:</strong> Name, email address, password (hashed)</li>
              <li><strong>Order data:</strong> Shipping address, order history, payment reference</li>
              <li><strong>Usage data:</strong> Pages visited, reading progress, session duration</li>
              <li><strong>Communication data:</strong> Contact form submissions, consultation notes</li>
              <li><strong>Technical data:</strong> IP address, browser type, device information</li>
            </ul>
          </section>

          <section id="purpose">
            <h2>Purpose of Processing</h2>
            <p>We process your personal data for the following purposes:</p>
            <ul>
              <li>Providing and managing your account</li>
              <li>Processing orders and delivering digital content</li>
              <li>Scheduling and managing consultations</li>
              <li>Sending order confirmations and service updates</li>
              <li>Improving our website and services</li>
              <li>Responding to your enquiries</li>
              <li>Marketing communications (with your consent)</li>
            </ul>
          </section>

          <section id="legal-basis">
            <h2>Legal Basis (Article 6 GDPR)</h2>
            <ul>
              <li><strong>Contract:</strong> Processing necessary to fulfil your orders, provide access to digital content, and manage consultations.</li>
              <li><strong>Consent:</strong> Marketing communications, analytics cookies, and optional data collection.</li>
              <li><strong>Legitimate interest:</strong> Fraud prevention, website security, and service improvement.</li>
              <li><strong>Legal obligation:</strong> Tax and accounting requirements.</li>
            </ul>
          </section>

          <section id="retention">
            <h2>Data Retention</h2>
            <ul>
              <li><strong>Account data:</strong> Retained until account deletion</li>
              <li><strong>Order data:</strong> 7 years (tax obligations)</li>
              <li><strong>Consultation records:</strong> 3 years after last session</li>
              <li><strong>Marketing consent:</strong> Until withdrawal</li>
              <li><strong>Technical logs:</strong> 90 days</li>
            </ul>
          </section>

          <section id="third-parties">
            <h2>Third-Party Processors</h2>
            <p>We share data with the following processors:</p>
            <ul>
              <li><strong>Razorpay</strong> — Payment processing</li>
              <li><strong>MongoDB Atlas</strong> — Database hosting (EU region)</li>
              <li><strong>Cloudinary</strong> — Image and media hosting</li>
              <li><strong>Vercel</strong> — Website hosting and analytics</li>
            </ul>
            <p>All processors are contractually bound to protect your data in accordance with GDPR.</p>
          </section>

          <section id="cookies">
            <h2>Cookies</h2>
            <p>We use cookies for essential site functionality, analytics (with consent), and preference storage. You can manage cookie preferences at any time via the cookie banner or our <Link href="/cookie-policy">Cookie Policy</Link>.</p>
          </section>

          <section id="your-rights">
            <h2>Your Rights</h2>
            <p>Under GDPR, you have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to data processing based on legitimate interest</li>
              <li><strong>Restriction:</strong> Request limited processing in certain circumstances</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent at any time for consent-based processing</li>
            </ul>
            <p>To exercise any of these rights, use the Settings page in your account or email privacy@iqrakhan.com.</p>
          </section>

          <section id="contact">
            <h2>Contact Us</h2>
            <p>For any data protection enquiries, please contact:</p>
            <p>Email: <a href="mailto:privacy@iqrakhan.com">privacy@iqrakhan.com</a></p>
            <p>You also have the right to lodge a complaint with your local data protection authority.</p>
          </section>
        </LegalPageLayout>
      </main>
      <SiteFooter />
    </>
  )
}
