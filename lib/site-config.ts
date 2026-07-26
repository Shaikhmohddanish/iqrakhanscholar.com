// Canonical site origin used for metadata, sitemaps, and structured data.
// NEXT_PUBLIC_SITE_URL (set per-environment on Vercel) takes precedence so
// preview deployments can emit their own URLs.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://iqrakhanscholar.com'
