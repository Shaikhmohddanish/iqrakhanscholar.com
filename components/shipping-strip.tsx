import { Truck, RotateCcw, BookOpen, ShieldCheck } from 'lucide-react'
import { Reveal } from '@/components/reveal'

// Every claim here is verifiable in code: the flat rate comes from
// SHIPPING_RATES.INR in lib/currency.ts, the returns window matches
// /refund-policy, and digital access is how lib/orders.ts grants library items.
// Deliberately NO delivery-time promise - we don't have real dispatch windows
// from the client, and inventing one commits the business to it.
const items = [
  {
    icon: Truck,
    title: 'Flat ₹99 shipping',
    desc: 'One flat rate on orders with physical items, shown at checkout.',
  },
  {
    icon: RotateCcw,
    title: '2-day returns',
    desc: 'Return unused items in original packaging within 2 days of delivery.',
  },
  {
    icon: BookOpen,
    title: 'Instant e-book access',
    desc: 'Digital purchases unlock straight away in your account library.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    desc: 'Payments handled by Razorpay. We never store your card details.',
  },
]

export function ShippingStrip() {
  return (
    <section className="border-y border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="size-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
