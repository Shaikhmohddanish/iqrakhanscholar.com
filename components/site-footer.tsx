import { Camera, PlayCircle, Mail, Send } from 'lucide-react'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'About Iqra', href: '#about' },
      { label: 'Digital Library', href: '#digital' },
      { label: 'Physical Store', href: '#store' },
      { label: 'Knowledge Hub', href: '#blog' },
    ],
  },
  {
    title: 'Work With Me',
    links: [
      { label: '1-to-1 Consultation', href: '#consultation' },
      { label: 'Mentorship', href: '#consultation' },
      { label: 'Speaking', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Refund Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Shipping Info', href: '#' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-arabesque text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                IK
              </span>
              <span className="font-heading text-lg font-semibold">
                Iqra Khan
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Authentic Islamic knowledge for the modern Muslim woman. Learn,
              grow, and transform your life through Quran &amp; Sunnah.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Camera, label: 'Instagram' },
                { icon: PlayCircle, label: 'YouTube' },
                { icon: Send, label: 'Telegram' },
                { icon: Mail, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
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
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Iqra Khan. All rights reserved. Made with
            ihsan.
          </p>
          <p className="text-xs text-primary-foreground/60">
            “The best of you are those who learn the Quran and teach it.”
          </p>
        </div>
      </div>
    </footer>
  )
}
