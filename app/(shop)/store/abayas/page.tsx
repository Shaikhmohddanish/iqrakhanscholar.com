import type { Metadata } from 'next'
import { StoreCategoryView } from '@/components/store/store-category-view'

// These pages read the catalogue but no longer read the session, so Next
// prerenders them. Without a revalidate window that prerender happens once
// at build time and a new or edited product would never appear until the
// next deploy. One hour, matching the homepage, blog and /library.
export const revalidate = 3600

// A literal folder, not a dynamic [category] segment: `/store/[slug]` already
// owns one dynamic segment at this level, and a second would be a build error.
// Static segments win Next's match order, so this resolves before [slug].

export const metadata: Metadata = {
  title: 'Abayas - Modest Islamic Wear',
  description:
    'Elegant abayas and modest Islamic wear by Iqra Khan, chosen for dignity, comfort and everyday practice.',
  alternates: { canonical: '/store/abayas' },
  openGraph: {
    title: 'Abayas - Modest Islamic Wear | Iqra Khan',
    description: 'Elegant abayas and modest Islamic wear by Iqra Khan.',
    url: '/store/abayas',
  },
}

export default function AbayasPage() {
  return <StoreCategoryView category="Abayas" label="Abayas" />
}
