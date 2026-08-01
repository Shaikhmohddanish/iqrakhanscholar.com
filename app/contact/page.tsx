import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ContactForm } from './contact-form'
import { Mail, MapPin } from 'lucide-react'
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@/components/icons/social-icons'
import { contactEmail, socialLinks } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Iqra Khan. Send a message, ask a question, or inquire about collaborations and speaking engagements.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Iqra Khan',
    description:
      'Get in touch with Iqra Khan - questions, collaborations, and speaking engagements.',
    url: '/contact',
  },
}

const socials = [
  { icon: InstagramIcon, label: 'Instagram', href: socialLinks.instagram },
  { icon: YoutubeIcon, label: 'YouTube', href: socialLinks.youtube },
  { icon: FacebookIcon, label: 'Facebook', href: socialLinks.facebook },
  { icon: TiktokIcon, label: 'TikTok', href: socialLinks.tiktok },
]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Contact' }]} />

          <div className="mt-10 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Contact
            </h1>
            <p className="mt-3 text-muted-foreground">
              Have a question, suggestion, or collaboration idea? We&apos;d love to hear
              from you.
            </p>
          </div>

          <div className="mt-10">
            <ContactForm />
          </div>

          {/* Compact contact details */}
          <div className="mt-12 border-t border-border pt-8 text-center">
            <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-8">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="size-4" />
                {contactEmail}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                Based in India
              </span>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Iqra Khan',
            url: `${SITE_URL}/contact`,
          }),
        }}
      />
    </>
  )
}
