// Canonical site origin used for metadata, sitemaps, and structured data.
// NEXT_PUBLIC_SITE_URL (set per-environment on Vercel) takes precedence so
// preview deployments can emit their own URLs.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://iqrakhanscholar.com'

// Bare hostname for prose, e.g. "By accessing and using iqrakhanscholar.com".
// Derived from SITE_URL so legal copy can never name a different domain than
// the one the site is actually served from - Terms used to hardcode the apex
// domain while Privacy rendered whatever NEXT_PUBLIC_SITE_URL held, which is
// exactly the mismatch the client reported.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '')
