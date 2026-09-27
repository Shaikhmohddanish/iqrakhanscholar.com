import type { Metadata } from 'next'
import { StoreCategoryView } from '@/components/store/store-category-view'

// These pages read the catalogue but no longer read the session, so Next
// prerenders them. Without a revalidate window that prerender happens once
// at build time and a new or edited product would never appear until the
// next deploy. One hour, matching the homepage, blog and /library.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Shop - Abayas, Books & Digital Resources',
  description:
    'Shop elegant abayas and modest wear, signed hardcover books, premium Islamic journals and planners, plus ebooks, study guides and resource packs by Iqra Khan that unlock instantly in your library.',
  alternates: { canonical: '/store' },
  openGraph: {
    title: 'Shop - Abayas, Books & Digital Resources | Iqra Khan',
    description:
      'Signed hardcover books, premium Islamic journals and planners, plus ebooks and guides that unlock instantly in your library.',
    url: '/store',
  },
}

export default function StorePage() {
  return <StoreCategoryView label="Shop" />
}
