import type { Metadata } from 'next'
import { StoreCategoryView } from '@/components/store/store-category-view'

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
