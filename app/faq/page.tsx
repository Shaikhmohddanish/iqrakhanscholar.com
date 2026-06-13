import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { faqs } from '@/lib/site-data'
import { ChevronDown, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Iqra Khan\'s digital products, consultations, shipping, and more.',
}

const categories = [
  {
    title: 'General',
    faqs: faqs.slice(0, 2),
  },
  {
    title: 'Products & Delivery',
    faqs: faqs.slice(2, 4),
  },
  {
    title: 'Consultations',
    faqs: faqs.slice(4),
  },
]

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'FAQ' }]} />

          <div className="mt-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? <a href="/contact" className="text-primary hover:underline">Contact us</a>
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {categories.map((cat) => (
              <div key={cat.title}>
                <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">{cat.title}</h2>
                <div className="space-y-2">
                  {cat.faqs.map((faq) => (
                    <details
                      key={faq.q}
                      className="group rounded-xl border border-border bg-card"
                    >
                      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                        {faq.q}
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </>
  )
}
