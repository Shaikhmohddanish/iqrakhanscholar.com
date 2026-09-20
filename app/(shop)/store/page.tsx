import type { Metadata } from 'next'
import { StoreCategoryView } from '@/components/store/store-category-view'

export const metadata: Metadata = {
  title: 'Shop - Abayas, Books & Digital Resources',
  description:
    'Shop elegant abayas and modest wear, signed hardcover books, premium Islamic journals and planners, plus instant-download ebooks, study guides and resource packs by Iqra Khan.',
  alternates: { canonical: '/store' },
  openGraph: {
    title: 'Shop - Abayas, Books & Digital Resources | Iqra Khan',
    description:
      'Signed hardcover books, premium Islamic journals and planners, plus instant-download ebooks and guides.',
    url: '/store',
  },
}

export default function StorePage() {
  return <StoreCategoryView label="Shop" />
}
