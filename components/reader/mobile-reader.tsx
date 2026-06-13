'use client'

import Link from 'next/link'
import { ArrowLeft, PanelLeft, ChevronLeft, ChevronRight, Settings, Bookmark } from 'lucide-react'
import { useReader } from '@/lib/reader-store'
import { BookmarkButton } from './bookmark-button'

const mobileBg: Record<string, string> = {
  light: 'bg-white border-gray-200 text-gray-800',
  dark: 'bg-gray-900 border-gray-700 text-gray-100',
  sepia: 'bg-amber-50 border-amber-200 text-amber-900',
}

interface MobileReaderProps {
  bookTitle: string
  bookId: string
}

export function MobileReader({ bookTitle, bookId }: MobileReaderProps) {
  const { state, dispatch } = useReader()
  const bg = mobileBg[state.theme] ?? mobileBg.light

  const percent =
    state.totalPages > 0 ? Math.round((state.currentPage / state.totalPages) * 100) : 0

  return (
    <div className={`sm:hidden flex flex-col border-t ${bg}`} role="toolbar" aria-label="Mobile reader controls">
      {/* Progress bar */}
      <div className="h-1 w-full bg-current/10">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Controls row */}
      <div className="flex h-14 items-center justify-between px-4">
        {/* Back */}
        <Link
          href="/library"
          aria-label="Back to library"
          className="flex size-10 items-center justify-center rounded-full opacity-70"
        >
          <ArrowLeft className="size-5" />
        </Link>

        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label="Toggle sidebar"
          className="flex size-10 items-center justify-center rounded-full opacity-70"
        >
          <PanelLeft className="size-5" />
        </button>

        {/* Prev page */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'PREV_PAGE' })}
          disabled={state.currentPage <= 1}
          aria-label="Previous page"
          className="flex size-10 items-center justify-center rounded-full opacity-70 disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Page info */}
        <span className="text-sm tabular-nums">
          {state.currentPage} / {state.totalPages || '—'}
        </span>

        {/* Next page */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'NEXT_PAGE' })}
          disabled={state.currentPage >= state.totalPages}
          aria-label="Next page"
          className="flex size-10 items-center justify-center rounded-full opacity-70 disabled:opacity-30"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Bookmark */}
        <BookmarkButton bookId={bookId} />

        {/* Settings */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-full opacity-70"
        >
          <Settings className="size-5" />
        </button>
      </div>
    </div>
  )
}
