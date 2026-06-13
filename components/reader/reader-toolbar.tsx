'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Settings,
  Maximize,
  Minimize,
} from 'lucide-react'
import { useReader } from '@/lib/reader-store'
import { BookmarkButton } from './bookmark-button'

interface ReaderToolbarProps {
  bookTitle: string
  bookAuthor: string
  bookId: string
}

const toolbarBg: Record<string, string> = {
  light: 'bg-white border-gray-200 text-gray-800',
  dark: 'bg-gray-900 border-gray-700 text-gray-100',
  sepia: 'bg-amber-50 border-amber-200 text-amber-900',
}

export function ReaderToolbar({ bookTitle, bookAuthor, bookId }: ReaderToolbarProps) {
  const { state, dispatch } = useReader()
  const [pageInput, setPageInput] = useState('')

  const bg = toolbarBg[state.theme] ?? toolbarBg.light

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(pageInput, 10)
    if (!isNaN(num)) dispatch({ type: 'SET_PAGE', page: num })
    setPageInput('')
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
    dispatch({ type: 'TOGGLE_FULLSCREEN' })
  }

  return (
    <header
      className={`flex h-12 items-center gap-2 border-b px-3 ${bg}`}
      role="toolbar"
      aria-label="Reader controls"
    >
      {/* Back to library */}
      <Link
        href="/library"
        aria-label="Back to library"
        className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100"
      >
        <ArrowLeft className="size-4" />
      </Link>

      {/* Sidebar toggle */}
      <button
        type="button"
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        aria-label="Toggle sidebar"
        className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100"
      >
        <PanelLeft className="size-4" />
      </button>

      <div className="mx-1 h-5 w-px bg-current opacity-20" />

      {/* Book title */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{bookTitle}</p>
        <p className="truncate text-xs opacity-60">{bookAuthor}</p>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => dispatch({ type: 'PREV_PAGE' })}
          disabled={state.currentPage <= 1}
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100 disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>

        <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
          <input
            type="number"
            value={pageInput || state.currentPage}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={() => setPageInput('')}
            min={1}
            max={state.totalPages || undefined}
            aria-label="Current page"
            className="w-12 rounded border border-current/20 bg-transparent px-1 py-0.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-current/40"
          />
          <span className="text-xs opacity-50">/ {state.totalPages || '—'}</span>
        </form>

        <button
          type="button"
          onClick={() => dispatch({ type: 'NEXT_PAGE' })}
          disabled={state.currentPage >= state.totalPages}
          aria-label="Next page"
          className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100 disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-current opacity-20" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => dispatch({ type: 'ZOOM_OUT' })}
          aria-label="Zoom out"
          className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100"
        >
          <ZoomOut className="size-4" />
        </button>
        <span className="w-12 text-center text-xs">{state.zoom}%</span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ZOOM_IN' })}
          aria-label="Zoom in"
          className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100"
        >
          <ZoomIn className="size-4" />
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-current opacity-20" />

      {/* Bookmark */}
      <BookmarkButton bookId={bookId} />

      {/* Settings */}
      <button
        type="button"
        onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
        aria-label="Reader settings"
        className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100"
      >
        <Settings className="size-4" />
      </button>

      {/* Fullscreen */}
      <button
        type="button"
        onClick={handleFullscreen}
        aria-label={state.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="flex size-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100"
      >
        {state.isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
      </button>
    </header>
  )
}
