import { ImageResponse } from 'next/og'

export const alt =
  'Iqra Khan Scholar - Authentic Islamic Knowledge Rooted in Quran & Sunnah'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default sitewide social card (used wherever a page doesn't set its own image).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background: '#2f5d50',
          color: '#ffffff',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#d4af37',
            fontFamily: 'sans-serif',
          }}
        >
          Islamic Scholar · Educator · Mentor
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 110,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Iqra Khan
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontSize: 40,
            color: '#e8efe9',
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          From e-books to one-to-one mentorship — authentic Islamic knowledge,
          rooted in Quran &amp; Sunnah.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 60,
            fontSize: 28,
            color: '#d4af37',
            fontFamily: 'sans-serif',
          }}
        >
          iqrakhanscholar.com
        </div>
      </div>
    ),
    { ...size },
  )
}
