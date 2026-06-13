import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ContactForm } from './contact-form'
import { Mail, MapPin, Clock, Phone, Camera, PlayCircle, Send as TelegramIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Iqra Khan. Send a message, ask a question, or inquire about collaborations and speaking engagements.',
}

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@iqrakhan.com',
    href: 'mailto:hello@iqrakhan.com',
  },
  {
    icon: Clock,
    title: 'Response Time',
    value: 'Within 24–48 hours',
  },
  {
    icon: MapPin,
    title: 'Based In',
    value: 'United Kingdom',
  },
]

const socials = [
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: PlayCircle, label: 'YouTube', href: '#' },
  { icon: TelegramIcon, label: 'Telegram', href: '#' },
]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Contact' }]} />

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Form */}
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Get in Touch
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Have a question, suggestion, or collaboration idea? We&apos;d love to hear from you.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Info sidebar */}
            <aside className="space-y-6">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-primary hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social links */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm font-medium text-foreground">Follow Us</p>
                <div className="mt-3 flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <s.icon className="size-5" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
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
            url: 'https://iqrakhan.com/contact',
          }),
        }}
      />
    </>
  )
}
