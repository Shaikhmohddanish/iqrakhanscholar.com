import type { MetadataRoute } from 'next'
import { getPublishedArticles } from '@/lib/blog'
import { getAllProducts } from '@/lib/products'
import { SITE_URL as base } from '@/lib/site-config'

// Refresh the sitemap hourly so new articles/products appear without a redeploy.
export const revalidate = 3600

type Freq = MetadataRoute.Sitemap[number]['changeFrequency']

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Freq }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/store', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/store/abayas', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/store/accessories', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/library', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.9, changeFrequency: 'daily' },
  { path: '/consultation', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/faq', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Pull dynamic content; tolerate DB hiccups so the sitemap never 500s.
  const [articlesRes, products] = await Promise.all([
    getPublishedArticles({ limit: 1000 }).catch(() => ({ articles: [] })),
    getAllProducts().catch(() => []),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = articlesRes.articles.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const storeEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/store/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const libraryEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.type === 'digital')
    .map((p) => ({
      url: `${base}/library/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...staticEntries, ...blogEntries, ...storeEntries, ...libraryEntries]
}
