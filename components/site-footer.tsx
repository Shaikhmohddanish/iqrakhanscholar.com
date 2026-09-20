import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@/components/icons/social-icons'
import { socialLinks } from '@/lib/site-data'
import { NewsletterForm } from '@/components/newsletter-form'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'About Iqra Khan Scholar', href: '/about' },
      { label: 'E-books', href: '/library' },
      { label: 'Abayas', href: '/store/abayas' },
      { label: 'Knowledge Hub', href: '/blog' },
    ],
  },
  {
    title: 'Work With Me',
    links: [
      { label: '1-to-1 Consultation', href: '/consultation' },
      { label: 'Mentorship', href: '/consultation' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-arabesque text-primary-foreground" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo-mark.png"
                alt="Iqra Khan - Islamic Scholar"
                width={69}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              From e-books to one-to-one mentorship with Iqra Khan Scholar — authentic Islamic knowledge, rooted in Quran & Sunnah, guiding you every step of the way!
            </p>

            {/* Newsletter signup */}
            <NewsletterForm />

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: InstagramIcon, label: 'Instagram', href: socialLinks.instagram },
                { icon: YoutubeIcon, label: 'YouTube', href: socialLinks.youtube },
                { icon: FacebookIcon, label: 'Facebook', href: socialLinks.facebook },
                { icon: TiktokIcon, label: 'TikTok', href: socialLinks.tiktok },
                // Points at /contact rather than mailto: - a mailto link does
                // nothing (silently) on a browser with no mail handler
                // registered, which is what made this icon look broken.
                { icon: Mail, label: 'Contact us', href: '/contact' },
              ].map((s) => {
                const cls =
                  'flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none'
                // Internal routes go through Link for client-side navigation;
                // external ones open in a new tab.
                return s.href.startsWith('/') ? (
                  <Link key={s.label} href={s.href} aria-label={s.label} className={cls}>
                    <s.icon className="size-4" />
                  </Link>
                ) : (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    <s.icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
                {col.title}
              </h3>
              <nav aria-label={col.title}>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground focus-visible:outline-none focus-visible:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Iqra Khan. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/60">
            &ldquo;The best of you are those who learn the Quran and teach it.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  )
}
