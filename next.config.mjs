/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Cloudinary-delivered media (product images, uploads).
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Google account avatars from OAuth sign-in.
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
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
              // Allow scripts from self + Next.js inline runtime + Google AdSense
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://fundingchoicesmessages.google.com https://www.google.com",
              // Allow pdf.js worker from unpkg CDN
              "worker-src 'self' blob: https://unpkg.com",
              // Allow images from self + data URIs + placeholders + ad creatives (https:)
              "img-src 'self' data: blob: https:",
              // Allow fonts from self
              "font-src 'self' data:",
              // Allow API connections + Vercel analytics + AdSense beacons
              "connect-src 'self' https://vitals.vercel-insights.com https://unpkg.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://csi.gstatic.com https://fundingchoicesmessages.google.com https://adservice.google.com https://www.google.com",
              // Allow AdSense ad iframes (frame-src is otherwise inherited from default-src)
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://*.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google https://fundingchoicesmessages.google.com",
              // Disallow framing of our own pages
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
