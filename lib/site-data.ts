export const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Library', href: '/library' },
  { label: 'Store', href: '/store' },
  { label: 'Consultation', href: '/consultation' },
  { label: 'Blog', href: '/blog' },
]

export const stats = [
  { value: '480K+', label: 'Instagram Community', numeric: 480, suffix: 'K+' },
  { value: '12,000+', label: 'Students Impacted', numeric: 12000, suffix: '+' },
  { value: '3,500+', label: 'Sessions Conducted', numeric: 3500, suffix: '+' },
  { value: '60,000+', label: 'Books & Guides Sold', numeric: 60000, suffix: '+' },
]

export type Product = {
  title: string
  category: string
  price: string
  rating: number
  reviews: number
  image: string
  badge?: string
}

export const digitalProducts: Product[] = [
  {
    title: 'The Art of Khushu in Salah',
    category: 'Ebook',
    price: '$14',
    rating: 5,
    reviews: 218,
    image: '/product-ebook-salah.png',
    badge: 'Bestseller',
  },
  {
    title: '30 Day Quran Reflection Journey',
    category: 'Study Guide',
    price: '$19',
    rating: 5,
    reviews: 164,
    image: '/product-ebook-quran.png',
  },
  {
    title: 'Daily Duas for the Modern Muslim Woman',
    category: 'Resource Pack',
    price: '$9',
    rating: 5,
    reviews: 312,
    image: '/product-ebook-dua.png',
    badge: 'New',
  },
]

export const physicalProducts: Product[] = [
  {
    title: 'Becoming Her: Faith & Identity',
    category: 'Hardcover Book',
    price: '$28',
    rating: 5,
    reviews: 96,
    image: '/product-book.png',
    badge: 'Signed Edition',
  },
  {
    title: 'Gratitude & Dhikr Journal',
    category: 'Islamic Journal',
    price: '$32',
    rating: 5,
    reviews: 141,
    image: '/product-journal.png',
  },
  {
    title: 'Salah & Intentions Planner',
    category: 'Daily Planner',
    price: '$36',
    rating: 5,
    reviews: 88,
    image: '/product-planner.png',
    badge: 'Limited',
  },
]

export const videos = [
  {
    title: 'Finding Stillness in a Restless World',
    meta: 'Lecture · 18 min',
    image: '/video-lecture.png',
  },
  {
    title: 'A Reminder for the Heart',
    meta: 'Reel · 60 sec',
    image: '/video-reel.png',
  },
  {
    title: 'Faith, Purpose & Identity',
    meta: 'Talk · 24 min',
    image: '/video-talk.png',
  },
]

export const testimonials = [
  {
    quote:
      'Iqra’s mentorship completely transformed how I connect with my prayers. For the first time, salah feels like a conversation, not a checklist.',
    name: 'Aisha R.',
    role: 'Consultation Student',
    avatar: '/avatar-1.png',
  },
  {
    quote:
      'The Quran Reflection Journey is the most beautiful, accessible study guide I have ever used. I recommend it to every sister I know.',
    name: 'Maryam S.',
    role: 'Digital Library Reader',
    avatar: '/avatar-2.png',
  },
  {
    quote:
      'I came feeling lost in my faith and left with clarity and a real plan. Iqra listens with so much compassion and wisdom.',
    name: 'Fatima H.',
    role: 'One-to-One Mentee',
    avatar: '/avatar-3.png',
  },
]

export const blogPosts = [
  {
    title: 'How to Build a Consistent Salah Routine That Actually Lasts',
    category: 'Worship',
    readTime: '8 min read',
    excerpt:
      'Practical, Sunnah-rooted steps to anchor your five daily prayers - even in your busiest seasons.',
    image: '/blog-salah.png',
  },
  {
    title: 'Raising Faithful Children in a Distracted World',
    category: 'Parenting',
    readTime: '11 min read',
    excerpt:
      'Gentle, prophetic parenting principles to nurture love of Allah in your home from an early age.',
    image: '/blog-parenting.png',
  },
  {
    title: 'A Woman’s Worth: Honour & Rights in Islam',
    category: 'Women in Islam',
    readTime: '9 min read',
    excerpt:
      'Revisiting the dignity, autonomy, and spiritual station Islam grants to women - straight from the sources.',
    image: '/blog-women.png',
  },
]

export const faqs = [
  {
    q: 'Who are your teachings and resources designed for?',
    a: 'Everything is created with the modern Muslim woman in mind - whether you are returning to your faith, deepening your practice, or seeking clarity in a specific area of life. The language is accessible and rooted firmly in authentic Quran & Sunnah.',
  },
  {
    q: 'Are the digital products delivered instantly?',
    a: 'Yes. Ebooks, study guides, and resource packs are delivered to your inbox immediately after checkout, so you can begin learning right away on any device.',
  },
  {
    q: 'What happens during a one-to-one consultation?',
    a: 'Each session is a private, confidential conversation tailored to your situation. We discuss your concerns, ground them in Islamic guidance, and build a clear, compassionate plan forward. You receive a recording and follow-up notes.',
  },
  {
    q: 'Is the guidance from a recognised scholarly background?',
    a: 'Iqra has studied under qualified scholars in classical Islamic sciences with a focus on Quran, Aqeedah, and Fiqh for women, and continues to teach under scholarly supervision.',
  },
  {
    q: 'Do you ship physical products internationally?',
    a: 'Yes, we ship our books, journals, and planners worldwide. Shipping rates and estimated delivery times are calculated at checkout based on your location.',
  },
]

export const quotes = [
  {
    text: 'Verily, in the remembrance of Allah do hearts find rest.',
    source: 'Quran 13:28',
  },
  {
    text: 'So remember Me; I will remember you.',
    source: 'Quran 2:152',
  },
  {
    text: 'And He found you lost and guided you.',
    source: 'Quran 93:7',
  },
  {
    text: 'The most beloved deeds to Allah are those done consistently, even if small.',
    source: 'Prophet Muhammad ﷺ',
  },
]
