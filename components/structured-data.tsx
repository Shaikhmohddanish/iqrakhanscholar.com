import { socialLinks } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'

/**
 * Site-wide identity schema: who runs this site, what it is, and how to search
 * it. Mounted in the root layout so it appears on every URL.
 *
 * It used to be rendered from app/page.tsx, which meant a Rich Results or
 * schema-validator run against any inner page (/store/<slug>, /about, /terms)
 * correctly reported no Organization and no WebSite - the client read that as
 * "schema missing".
 *
 * FAQPage deliberately lives NOT here but on /faq (app/faq/page.tsx), the page
 * that actually displays those questions. Emitting it site-wide would put two
 * FAQPage entities on /faq and attach FAQ markup to pages with no FAQ on them.
 */
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
      'From e-books to one-to-one mentorship with Iqra Khan Scholar — authentic Islamic knowledge, rooted in Quran & Sunnah, guiding you every step of the way!',
    sameAs: Object.values(socialLinks),
  }

  const schemas = [personSchema, websiteSchema, organizationSchema]

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
