import { faqs, socialLinks } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'

export function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Iqra Khan',
    jobTitle: 'Islamic Scholar & Educator',
    description:
      'Islamic scholar, educator, and mentor helping Muslim women learn and grow through authentic Quran & Sunnah-based teaching.',
    url: SITE_URL,
    knowsAbout: [
      'Islamic Studies',
      'Quran',
      'Islamic Education',
      'Women in Islam',
      'Spiritual Mentorship',
    ],
    sameAs: Object.values(socialLinks),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Iqra Khan',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Iqra Khan',
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    description:
      'Authentic Islamic knowledge, digital books, courses, and one-to-one mentorship for the modern Muslim woman.',
    sameAs: Object.values(socialLinks),
  }

  const faqSchema = {
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
  }

  const schemas = [personSchema, websiteSchema, organizationSchema, faqSchema]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
