'use client'

import { usePathname } from 'next/navigation'
import { WhatsappIcon } from '@/components/icons/social-icons'

// Digits only, country code first, no "+" or spaces - e.g. 919876543210.
// Set NEXT_PUBLIC_WHATSAPP_NUMBER in Vercel and the button appears; leave it
// unset and this renders nothing, so the site never ships a dead chat bubble
// or a link to someone else's number.
const RAW_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

// Routes where a floating chat bubble is in the way rather than helpful: the
// reader (it covers the page), checkout/payment (distraction at the point of
// purchase), and admin.
const HIDDEN_PREFIXES = ['/reader', '/checkout', '/admin']

const PREFILL = "Assalamu alaikum, I'd like to ask about"

export function WhatsappButton() {
  const pathname = usePathname()

  if (!RAW_NUMBER) return null

  // Tolerate a number pasted with +, spaces or dashes - wa.me accepts digits only.
  const number = RAW_NUMBER.replace(/\D/g, '')
  if (!number) return null

  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null
  }

  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(PREFILL)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
    >
      <WhatsappIcon className="size-7" />
    </a>
  )
}
