import type { Metadata } from 'next'

// page.tsx is a client component and so cannot export metadata itself. Without
// this the route had NO metadata of its own: it inherited the root title,
// description and OG card, and (while the root still declared one) a canonical
// pointing at the homepage - all on a fully indexable account-recovery flow.
export const metadata: Metadata = {
  title: 'Account recovery',
  description: 'Recover access to your Iqra Khan account.',
  alternates: { canonical: '/account-recovery' },
  robots: { index: false, follow: false },
}

export default function AccountRecoveryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
