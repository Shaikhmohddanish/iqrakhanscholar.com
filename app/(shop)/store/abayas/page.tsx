import type { Metadata } from 'next'
import { StoreCategoryView } from '@/components/store/store-category-view'

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
