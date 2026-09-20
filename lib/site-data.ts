export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Abayas', href: '/store/abayas' },
  { label: 'Accessories', href: '/store/accessories' },
  { label: 'E-books', href: '/library' },
  { label: 'Consultation', href: '/consultation' },
  { label: 'Contact', href: '/contact' },
]

export const stats = [
  { value: '150,000+', label: 'Followers on Instagram', numeric: 150000, suffix: '+' },
  { value: '10,000+', label: 'Subscribers on YouTube', numeric: 10000, suffix: '+' },
  { value: '20,000+', label: 'Followers on Facebook', numeric: 20000, suffix: '+' },
  { value: '15,000+', label: 'Followers on TikTok', numeric: 15000, suffix: '+' },
]

export const socialLinks = {
  instagram: 'https://www.instagram.com/iqrakhanscholar',
  youtube: 'https://youtube.com/@iqrakhanscholar',
  facebook: 'https://www.facebook.com/people/Iqrakhanscholar/61577575244442/',
  tiktok: 'https://www.tiktok.com/@iqrakhanscholar',
}

export const contactEmail = 'iqrakspromo@gmail.com'

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
    image: '/product-ebook-salah.webp',
    badge: 'Bestseller',
  },
  {
    title: '30 Day Quran Reflection Journey',
    category: 'Study Guide',
    price: '$19',
    rating: 5,
    reviews: 164,
    image: '/product-ebook-quran.webp',
  },
  {
    title: 'Daily Duas for the Modern Muslim Woman',
    category: 'Resource Pack',
    price: '$9',
    rating: 5,
    reviews: 312,
    image: '/product-ebook-dua.webp',
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
    image: '/product-book.webp',
    badge: 'Signed Edition',
  },
  {
    title: 'Gratitude & Dhikr Journal',
    category: 'Islamic Journal',
    price: '$32',
    rating: 5,
    reviews: 141,
    image: '/product-journal.webp',
  },
  {
    title: 'Salah & Intentions Planner',
    category: 'Daily Planner',
    price: '$36',
    rating: 5,
    reviews: 88,
    image: '/product-planner.webp',
    badge: 'Limited',
  },
]

export const videos = [
  {
    title: 'Finding Stillness in a Restless World',
    meta: 'Lecture · 18 min',
    image: '/video-lecture.webp',
  },
  {
    title: 'A Reminder for the Heart',
    meta: 'Reel · 60 sec',
    image: '/video-reel.webp',
  },
  {
    title: 'Faith, Purpose & Identity',
    meta: 'Talk · 24 min',
    image: '/video-talk.webp',
  },
]

export const testimonials = [
  {
    quote:
      'Iqra’s mentorship completely transformed how I connect with my prayers. For the first time, salah feels like a conversation, not a checklist.',
    name: 'Aisha R.',
    role: 'Consultation Student',
    avatar: '/avatar-1.webp',
  },
  {
    quote:
      'The Quran Reflection Journey is the most beautiful, accessible study guide I have ever used. I recommend it to every sister I know.',
    name: 'Maryam S.',
    role: 'E-books Reader',
    avatar: '/avatar-2.webp',
  },
  {
    quote:
      'I came feeling lost in my faith and left with clarity and a real plan. Iqra listens with so much compassion and wisdom.',
    name: 'Fatima H.',
    role: 'One-to-One Mentee',
    avatar: '/avatar-3.webp',
  },
]

// Topic artworks shown on the homepage. Each image carries its own title and
// tagline, so `title` is used as alt text only - never rendered next to the art.
export const topics = [
  {
    title: 'My Consistent Salah Journey',
    image: '/topic-salah.webp',
  },
  {
    title: 'A Woman’s Worth: Honour & Rights in Islam',
    image: '/topic-womens-rights.webp',
  },
  {
    title: 'Raising Faithful Children in a Distracted World',
    image: '/topic-parenting.webp',
  },
]

export type FaqCategory = 'General' | 'Products & Delivery' | 'Consultations'

// Grouped by `category` rather than array position - /faq buckets on this field,
// so entries can be reordered or added without silently landing in the wrong section.
export const faqs: { q: string; a: string; category: FaqCategory }[] = [
  {
    category: 'General',
    q: 'Who are our teachings and resources designed for?',
    a: 'Everything is created for the modern Muslim - whether you are returning to your faith, strengthening your practice, or seeking clarity in a specific area of life. The language is simple and accessible, and is firmly based on authentic Qur’an and Sunnah.',
  },
  {
    category: 'General',
    q: 'Is the guidance from a recognised scholarly background?',
    a: 'Iqra Khan has completed a 7-year Aalimiyyah degree under qualified scholars.',
  },
  {
    category: 'Products & Delivery',
    q: 'How do I get my e-book after buying it?',
    a: 'Your e-book unlocks instantly in your account library, where you can read it in our in-browser reader on any device. Nothing is sent by email, so there is no attachment to lose - just sign in and continue where you left off.',
  },
  {
    category: 'Products & Delivery',
    q: 'Do you ship physical products internationally?',
    a: 'Yes, we ship our abayas, books, journals, and planners worldwide. Shipping rates and estimated delivery times are calculated at checkout based on your location.',
  },
  {
    category: 'Consultations',
    q: 'What happens during a one-to-one consultation?',
    a: 'Each session is a private, confidential conversation tailored to your situation. We discuss your concerns, ground them in Islamic guidance, and build a clear, compassionate plan forward. You receive a recording and follow-up notes.',
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
