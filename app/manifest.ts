import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Iqra Khan - Authentic Islamic Knowledge',
    short_name: 'Iqra Khan',
    description:
      'Authentic Islamic knowledge for the modern Muslim woman - digital books, journals, free resources, and one-to-one consultations rooted in Quran & Sunnah.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#807366',
    icons: [
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  }
}
