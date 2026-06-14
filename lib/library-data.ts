// Mock digital library book data
// This will later be replaced by MongoDB queries

export interface LibraryBook {
  id: string
  slug: string
  title: string
  author: string
  coverImage: string
  description: string
  category: string
  pageCount: number
  rating: number
  reviews: number
  price: number // cents
  currency: string
  featured: boolean
  publishedAt: string
  /** Path to the PDF file (relative to /public or a storage URL). Undefined until uploaded. */
  pdfPath?: string
}

export interface LibraryBookPage {
  items: LibraryBook[]
  total: number
  hasMore: boolean
  page: number
}

export function queryLibraryBooks(opts: {
  page?: number
  limit?: number
  category?: string
  q?: string
} = {}): LibraryBookPage {
  const { page = 1, limit = 8, category, q } = opts
  let result = [...libraryBooks]

  if (category && category !== 'All') {
    result = result.filter((b) => b.category === category)
  }
  if (q) {
    const lower = q.toLowerCase()
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower) ||
        b.category.toLowerCase().includes(lower),
    )
  }

  const total = result.length
  const skip = (page - 1) * limit
  const items = result.slice(skip, skip + limit)
  return { items, total, hasMore: skip + items.length < total, page }
}

export function getLibraryCategories(): string[] {
  return [...new Set(libraryBooks.map((b) => b.category))].sort()
}

export const libraryBooks: LibraryBook[] = [
  {
    id: 'book-1',
    slug: 'the-art-of-khushu-in-salah',
    title: 'The Art of Khushu in Salah',
    author: 'Iqra Khan',
    coverImage: '/product-ebook-salah.png',
    description:
      'Discover the lost art of khushuʿ - the deep stillness and presence that transforms salah from routine into a living conversation with Allah. Rooted in Quran and Sunnah, this book offers gentle, actionable practices to quiet the restless heart and pray with meaning.',
    category: 'Worship',
    pageCount: 120,
    rating: 5,
    reviews: 218,
    price: 1400,
    currency: 'USD',
    featured: true,
    publishedAt: '2025-09-15',
  },
  {
    id: 'book-2',
    slug: '30-day-quran-reflection-journey',
    title: '30 Day Quran Reflection Journey',
    author: 'Iqra Khan',
    coverImage: '/product-ebook-quran.png',
    description:
      'A structured 30-day journey through selected passages of the Quran, with reflections, journaling prompts, and practical takeaways for each day.',
    category: 'Quran Studies',
    pageCount: 92,
    rating: 5,
    reviews: 164,
    price: 1900,
    currency: 'USD',
    featured: true,
    publishedAt: '2025-11-01',
  },
  {
    id: 'book-3',
    slug: 'daily-duas-for-the-modern-muslim-woman',
    title: 'Daily Duas for the Modern Muslim Woman',
    author: 'Iqra Khan',
    coverImage: '/product-ebook-dua.png',
    description:
      'A beautifully formatted collection of authentic duʿas drawn from the Quran and Sunnah, organised around the rhythms of a modern woman\'s day.',
    category: 'Dua & Dhikr',
    pageCount: 68,
    rating: 5,
    reviews: 312,
    price: 900,
    currency: 'USD',
    featured: false,
    publishedAt: '2026-01-10',
  },
  {
    id: 'book-4',
    slug: 'understanding-your-nafs',
    title: 'Understanding Your Nafs',
    author: 'Iqra Khan',
    coverImage: '/product-ebook-salah.png',
    description:
      'An exploration of the Islamic concept of nafs (self/soul) and practical steps to purify your heart and align your inner world with your faith.',
    category: 'Spirituality',
    pageCount: 146,
    rating: 4,
    reviews: 89,
    price: 1600,
    currency: 'USD',
    featured: false,
    publishedAt: '2026-03-20',
  },
  {
    id: 'book-5',
    slug: 'raising-righteous-children',
    title: 'Raising Righteous Children',
    author: 'Iqra Khan',
    coverImage: '/product-ebook-quran.png',
    description:
      'A comprehensive guide for Muslim parents on nurturing faith, character, and resilience in children. Based on prophetic parenting principles.',
    category: 'Parenting',
    pageCount: 180,
    rating: 5,
    reviews: 156,
    price: 2100,
    currency: 'USD',
    featured: true,
    publishedAt: '2026-05-01',
  },
  {
    id: 'book-6',
    slug: 'the-seerah-companion',
    title: 'The Seerah Companion',
    author: 'Iqra Khan',
    coverImage: '/product-ebook-dua.png',
    description:
      'Walk alongside the Prophet ﷺ through the key moments of his life. A beautifully written companion guide with reflections and lessons for today.',
    category: 'Seerah',
    pageCount: 210,
    rating: 5,
    reviews: 203,
    price: 2400,
    currency: 'USD',
    featured: false,
    publishedAt: '2025-06-15',
  },
]
