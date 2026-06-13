/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow inline styles from Tailwind + shadcn + react-pdf
              "style-src 'self' 'unsafe-inline'",
              // Allow scripts from self + Next.js inline runtime
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              // Allow pdf.js worker from unpkg CDN
              "worker-src 'self' blob: https://unpkg.com",
              // Allow images from self + data URIs + placeholders
              "img-src 'self' data: blob: https:",
              // Allow fonts from self
              "font-src 'self' data:",
              // Allow API connections + Vercel analytics
              "connect-src 'self' https://vitals.vercel-insights.com https://unpkg.com",
              // Disallow framing
              "frame-ancestors 'none'",
              // Block form submissions to other origins
              "form-action 'self'",
              // Disallow PDF embeds/iframes
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
