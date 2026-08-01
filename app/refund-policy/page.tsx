import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Iqra Khan refund and returns policy for digital products, physical products, and consultation services.',
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
        <LegalPageLayout title="Refund Policy" lastUpdated="15 June 2026" sections={sections}>
          <section id="digital">
            <h2>Digital Products</h2>
            <p>Due to the nature of digital products, all digital purchases (ebooks, guides, study materials) are <strong>non-refundable</strong> once accessed through the in-browser reader.</p>
            <p>If you experience technical issues preventing access, please contact us within 7 days of purchase and we will resolve the issue or provide a full refund.</p>
          </section>

          <section id="physical">
            <h2>Physical Products</h2>
            <p>We want you to be completely satisfied with your purchase. If you&apos;re not happy, you may return physical products within <strong>14 days</strong> of delivery, provided:</p>
            <ul>
              <li>Items are unused and in original packaging</li>
              <li>You provide proof of purchase</li>
              <li>Return shipping costs are your responsibility</li>
            </ul>
            <p>Personalised or signed items are non-refundable unless damaged or defective.</p>
          </section>

          <section id="consultations">
            <h2>Consultations</h2>
            <ul>
              <li><strong>Cancellation within 2 hours of booking:</strong> Full refund</li>
              <li><strong>Cancellation after 2 hours:</strong> Non-refundable</li>
              <li><strong>Rescheduling:</strong> Available within 2 hours of booking</li>
              <li><strong>No-show:</strong> Non-refundable</li>
            </ul>
            <p>Session packages: individual sessions follow the same policy. Unused sessions remain valid for 6 months from purchase.</p>
          </section>

          <section id="how-to">
            <h2>How to Request a Refund</h2>
            <p>To request a refund, you can:</p>
            <ul>
              <li>Submit a refund request through your <Link href="/account/orders">Orders</Link> page</li>
              <li>Email us at <a href="mailto:iqrakspromo@gmail.com">iqrakspromo@gmail.com</a> with your order number</li>
            </ul>
          </section>

          <section id="processing">
            <h2>Processing Time</h2>
            <p>Approved refunds are processed within 5–10 business days. The refund will be credited to the original payment method used at checkout.</p>
          </section>
        </LegalPageLayout>
      </main>
      <SiteFooter />
    </>
  )
}
