import type { Metadata } from 'next'
import { StoreCategoryView } from '@/components/store/store-category-view'

// These pages read the catalogue but no longer read the session, so Next
// prerenders them. Without a revalidate window that prerender happens once
// at build time and a new or edited product would never appear until the
// next deploy. One hour, matching the homepage, blog and /library.
export const revalidate = 3600

// See the note in ../abayas/page.tsx on why this is a literal folder.

export const metadata: Metadata = {
  title: 'Accessories - Modest Islamic Accessories',
  description:
    'Accessories to complement your modest wardrobe - selected by Iqra Khan.',
  alternates: { canonical: '/store/accessories' },
  openGraph: {
    title: 'Accessories | Iqra Khan',
    description: 'Accessories to complement your modest wardrobe.',
    url: '/store/accessories',
  },
}

export default function AccessoriesPage() {
  return <StoreCategoryView category="Accessories" label="Accessories" />
}
