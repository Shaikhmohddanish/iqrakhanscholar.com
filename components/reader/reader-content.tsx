'use client'

import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { Document, Page, pdfjs } from 'react-pdf'
import { useReader } from '@/lib/reader-store'
import { ReadingStats } from './reading-stats'

// Use CDN worker - avoids webpack bundling issues in Next.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const pageBg: Record<string, string> = {
  light: 'bg-gray-100',
  dark: 'bg-gray-950',
  sepia: 'bg-[#fdf6e3]',
}

interface ReaderContentProps {
  bookId: string
  userEmail: string
}

export function ReaderContent({ bookId, userEmail }: ReaderContentProps) {
  const { state, dispatch } = useReader()
  const containerRef = useRef<HTMLDivElement>(null)

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      dispatch({ type: 'SET_TOTAL_PAGES', total: numPages })
    },
    [dispatch],
  )

  const onLoadError = useCallback(
    (error: Error) => {
      const msg =
        error.message?.includes('404') || error.message?.includes('not found')
          ? 'PDF not yet available for this book.'
          : error.message?.includes('403') || error.message?.includes('Forbidden')
            ? 'You need to purchase this book to read it.'
            : 'Failed to load PDF. Please try again.'
      dispatch({ type: 'SET_ERROR', error: msg })
    },
    [dispatch],
  )

  const bg = pageBg[state.theme] ?? pageBg.light

  return (
    <main
      id="reader-content"
      ref={containerRef}
      className={`relative flex flex-1 flex-col items-center overflow-auto ${bg} select-none`}
      // Disable right-click to prevent "Save image as"
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Book content"
    >
      {/* Error state */}
      {state.error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="text-5xl">📖</span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Unable to Load Book</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{state.error}</p>
          </div>
          <Link href="/library" className="mt-2 text-sm font-medium text-primary hover:underline">
            ← Back to Library
          </Link>
        </div>
      ) : (
        <div className="relative py-6">
          <Document
            file={`/api/reader/${bookId}`}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={
              <div className="flex h-96 w-64 animate-pulse items-center justify-center rounded-md bg-muted text-sm text-muted-foreground sm:w-96">
                Loading…
              </div>
            }
          >
            <Page
              pageNumber={state.currentPage}
              scale={state.zoom / 100}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl"
            />
          </Document>

          {/* Watermark overlay - user email, subtle, prevents screenshot-to-text */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 text-right text-[10px] font-mono opacity-10 select-none"
            style={{ color: state.theme === 'dark' ? '#fff' : '#000' }}
          >
            {userEmail}
          </div>
        </div>
      )}

      {/* Reading stats bar */}
      <div className="sticky bottom-0 w-full sm:hidden">
        <ReadingStats />
      </div>
    </main>
  )
}
