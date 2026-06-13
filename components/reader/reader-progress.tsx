'use client'

import { useReader } from '@/lib/reader-store'

const progressBg: Record<string, string> = {
  light: 'bg-white border-gray-200 text-gray-600',
  dark: 'bg-gray-900 border-gray-700 text-gray-400',
  sepia: 'bg-amber-50 border-amber-200 text-amber-700',
}

export function ReaderProgress() {
  const { state } = useReader()
  const bg = progressBg[state.theme] ?? progressBg.light

  const percent =
    state.totalPages > 0 ? Math.round((state.currentPage / state.totalPages) * 100) : 0

  return (
    <footer
      className={`flex h-8 items-center gap-4 border-t px-4 ${bg}`}
      role="status"
      aria-label="Reading progress"
    >
      {/* Progress bar */}
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-current/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <span className="shrink-0 text-xs tabular-nums">
        Page {state.currentPage} of {state.totalPages || '—'}
      </span>

      <span className="shrink-0 text-xs tabular-nums opacity-60">{percent}%</span>
    </footer>
  )
}
