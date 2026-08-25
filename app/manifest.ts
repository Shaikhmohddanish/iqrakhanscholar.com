import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Iqra Khan - Authentic Islamic Knowledge',
    short_name: 'Iqra Khan',
    description:
      'From e-books to one-to-one mentorship with Iqra Khan Scholar — authentic Islamic knowledge, rooted in Quran & Sunnah, guiding you every step of the way!',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1713',
    icons: [
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  }
}
