import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'
import { contactEmail } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'Iqra Khan Scholar refund policy for digital products, physical products, and consultations.',
}

const sections = [
  { id: 'digital', title: 'Digital Products' },
  { id: 'physical', title: 'Physical Products' },
  { id: 'consultations', title: 'Consultations' },
  { id: 'how-to', title: 'How to Request' },
  { id: 'processing', title: 'Processing Time' },
]

export default function RefundPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <LegalPageLayout title="Refund Policy" lastUpdated="5 August 2026" sections={sections}>
          <section id="digital">
            <h2>Digital Products</h2>
            <p>
              Due to the nature of digital products, all digital purchases (ebooks, guides, study
              materials) are non-refundable once accessed through the in-browser reader.
            </p>
          </section>

          <section id="physical">
            <h2>Physical Products</h2>
            <p>
              We want you to be completely satisfied with your purchase. If you are not happy, you
              may return physical products within <strong>2 days of delivery</strong>, provided:
            </p>
            <ul>
              <li>Items are unused and in their original packaging</li>
              <li>You can provide proof of purchase (barcode / QR code)</li>
            </ul>
            <p>
              Outside this window, items are non-refundable unless they arrive damaged or defective.
            </p>
          </section>

          <section id="consultations">
            <h2>Consultations</h2>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cancellation within 2 hours of booking</td>
                    <td>Full refund</td>
                  </tr>
                  <tr>
                    <td>Cancellation after 2 hours</td>
                    <td>Non-refundable (reschedule available)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="how-to">
            <h2>How to Request a Refund</h2>
            <p>To request a refund, you can:</p>
            <ul>
              <li>
                Submit a refund request through your <Link href="/account/orders">Orders</Link> page
              </li>
              <li>
                Email us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with your order
                number
              </li>
            </ul>
          </section>

          <section id="processing">
            <h2>Processing Time</h2>
            <p>
              Approved refunds are processed within 5-10 business days. The refund will be credited
              to the original payment method used at checkout.
            </p>
          </section>
        </LegalPageLayout>
      </main>
      <SiteFooter />
    </>
  )
}
