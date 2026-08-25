'use client'

import { useEffect } from 'react'

// Catches errors thrown in the root layout itself. It replaces the entire
// document, so it must render its own <html>/<body> and cannot rely on the
// app's global CSS being present — styles are inlined for resilience.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#1a1713',
          fontFamily: 'Arial, Helvetica, sans-serif',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '460px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6b6459', margin: '0 0 24px' }}>
            An unexpected error occurred while loading the page. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              display: 'inline-block',
              padding: '13px 28px',
              borderRadius: '9999px',
              border: 'none',
              background: '#8a6d1c',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
