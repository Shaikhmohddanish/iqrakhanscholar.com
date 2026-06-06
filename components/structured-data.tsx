import { faqs } from '@/lib/site-data'

export function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Iqra Khan',
    jobTitle: 'Islamic Scholar & Educator',
    description:
      'Islamic scholar, educator, and mentor helping Muslim women learn and grow through authentic Quran & Sunnah-based teaching.',
    url: 'https://iqrakhan.com',
    knowsAbout: [
      'Islamic Studies',
      'Quran',
      'Islamic Education',
      'Women in Islam',
      'Spiritual Mentorship',
    ],
    sameAs: [
      'https://instagram.com/iqrakhan',
      'https://youtube.com/@iqrakhan',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Iqra Khan',
    url: 'https://iqrakhan.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://iqrakhan.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
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

  const schemas = [personSchema, websiteSchema, faqSchema]

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
