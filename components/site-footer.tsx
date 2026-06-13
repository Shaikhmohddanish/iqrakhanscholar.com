import Link from 'next/link'
import { Camera, PlayCircle, Mail, Send } from 'lucide-react'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'About Iqra', href: '/about' },
      { label: 'Digital Library', href: '/library' },
      { label: 'Physical Store', href: '/store' },
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
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                IK
              </span>
              <span className="font-heading text-lg font-semibold">
                Iqra Khan
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Authentic Islamic knowledge for the modern Muslim woman. Learn,
              grow, and transform your life through Quran &amp; Sunnah.
            </p>

            {/* Newsletter signup */}
            <form
              className="mt-6"
              action="#"
            >
              <label htmlFor="footer-email" className="text-xs font-medium uppercase tracking-wider text-accent">
                Stay Connected
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email"
                  required
                  className="flex-1 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Join
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Camera, label: 'Instagram', href: '#' },
                { icon: PlayCircle, label: 'YouTube', href: '#' },
                { icon: Send, label: 'Telegram', href: '#' },
                { icon: Mail, label: 'Email', href: 'mailto:hello@iqrakhan.com' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
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
            © {new Date().getFullYear()} Iqra Khan. All rights reserved. Made with
            ihsan.
          </p>
          <p className="text-xs text-primary-foreground/60">
            &ldquo;The best of you are those who learn the Quran and teach it.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  )
}
