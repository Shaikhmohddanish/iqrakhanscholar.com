'use client'

import { useReader } from '@/lib/reader-store'

// Approximate reading speed: 2 minutes per page
const MINS_PER_PAGE = 2

export function ReadingStats() {
  const { state } = useReader()

  if (!state.totalPages) return null

  const pagesRead = state.currentPage - 1
  const pagesLeft = state.totalPages - state.currentPage + 1
  const minsLeft = pagesLeft * MINS_PER_PAGE
  const percent = Math.round((state.currentPage / state.totalPages) * 100)

  const formatTime = (mins: number) =>
    mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`

  return (
    <div
      className="flex items-center justify-center gap-4 bg-black/50 px-4 py-1.5 text-xs text-white backdrop-blur-sm sm:hidden"
      role="status"
      aria-label="Reading progress"
    >
      <span>{state.currentPage} / {state.totalPages}</span>
      <span>{percent}% complete</span>
      {pagesLeft > 0 && <span>~{formatTime(minsLeft)} left</span>}
    </div>
  )
}
