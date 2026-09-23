import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'
import { contactEmail } from '@/lib/site-data'
import { shippingRateLabel, freeShippingLabel } from '@/lib/shipping-copy'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'How Iqra Khan Scholar ships physical orders: rates, free-shipping threshold, dispatch times, tracking and delivery addresses.',
  alternates: { canonical: '/shipping-policy' },
}

const sections = [
  { id: 'rates', title: 'Shipping Rates' },
  { id: 'digital', title: 'Digital Products' },
  { id: 'dispatch', title: 'Dispatch & Delivery' },
  { id: 'tracking', title: 'Tracking Your Order' },
  { id: 'address', title: 'Delivery Addresses' },
  { id: 'problems', title: 'Delays, Damage & Lost Parcels' },
  { id: 'contact', title: 'Contact Us' },
]

export default function ShippingPolicyPage() {
  // Derived from SHIPPING_RATES / FREE_SHIPPING_THRESHOLDS so this page can
  // never quote a rate the checkout doesn't charge.
  const rate = shippingRateLabel()
  const freeOver = freeShippingLabel()

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <LegalPageLayout
          title="Shipping Policy"
          lastUpdated="23 September 2026"
          sections={sections}
        >
          <section id="rates">
            <h2>Shipping Rates</h2>
            <p>
              Shipping is calculated at checkout and shown before you pay, so you always
              see the final amount before confirming an order.
            </p>
            <ul>
              <li>
                A flat <strong>{rate}</strong> shipping charge applies to orders containing
                physical items.
              </li>
              {freeOver && (
                <li>
                  Shipping is <strong>free</strong> on orders over{' '}
                  <strong>{freeOver}</strong> (calculated on the order subtotal, before
                  shipping).
                </li>
              )}
              <li>
                Orders containing only digital items are never charged shipping.
              </li>
            </ul>
            <p>
              We currently ship within India only. All prices and shipping charges are in
              Indian Rupees (₹).
            </p>
          </section>

          <section id="digital">
            <h2>Digital Products</h2>
            <p>
              E-books and digital guides are not shipped. They unlock immediately in your
              account library after payment is confirmed, and are read in our in-browser
              reader on any device. Nothing is posted and nothing is emailed as an
              attachment.
            </p>
          </section>

          <section id="dispatch">
            <h2>Dispatch &amp; Delivery</h2>
            <p>
              Orders are dispatched on working days (Monday to Saturday, excluding public
              holidays) after payment has cleared. Orders placed on a non-working day are
              processed on the next working day.
            </p>
            <p>
              Delivery times depend on your location and the courier. We do not guarantee a
              specific delivery date, and courier timelines are outside our control once a
              parcel has been handed over.
            </p>
          </section>

          <section id="tracking">
            <h2>Tracking Your Order</h2>
            <p>
              You can see the status of every order under{' '}
              <Link href="/account/orders">Your Orders</Link>. Where the courier provides a
              tracking reference, we add it to the order record and include it in your
              dispatch notification.
            </p>
          </section>

          <section id="address">
            <h2>Delivery Addresses</h2>
            <p>
              Please check your delivery address carefully before completing checkout. We
              ship to the address supplied with the order, and we cannot change it once the
              parcel has been dispatched.
            </p>
            <p>
              If a parcel is returned to us because the address was incomplete or incorrect,
              or because nobody was available to receive it after the courier&rsquo;s
              attempts, any re-delivery will be charged at the standard shipping rate.
            </p>
          </section>

          <section id="problems">
            <h2>Delays, Damage &amp; Lost Parcels</h2>
            <p>
              If your order arrives damaged, please contact us within 2 days of delivery
              with photographs of the item and its packaging so we can raise it with the
              courier and put things right.
            </p>
            <p>
              If a parcel appears lost in transit, contact us and we will open an enquiry
              with the courier. Returns and refunds are covered separately in our{' '}
              <Link href="/refund-policy">Refund Policy</Link>.
            </p>
          </section>

          <section id="contact">
            <h2>Contact Us</h2>
            <p>
              For any question about shipping or a specific order, email{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or use our{' '}
              <Link href="/contact">contact form</Link>. Please include your order number so
              we can find it quickly.
            </p>
          </section>
        </LegalPageLayout>
      </main>
      <SiteFooter />
    </>
  )
}
