import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://iqrakhan.com'
  const now = new Date()
  const routes = ['', '/digital-products', '/store', '/consultation', '/blog']

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
