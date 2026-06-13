'use client'

import { useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { useReader } from '@/lib/reader-store'

interface BookmarkButtonProps {
  bookId: string
}

export function BookmarkButton({ bookId }: BookmarkButtonProps) {
  const { state, dispatch } = useReader()
  const isBookmarked = state.bookmarks.includes(state.currentPage)
  const [, startTransition] = useTransition()

  function handleClick() {
    dispatch({ type: 'TOGGLE_BOOKMARK', page: state.currentPage })
    // Sync to DB asynchronously
    startTransition(async () => {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, toggleBookmark: state.currentPage }),
      }).catch(() => {})
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
      aria-pressed={isBookmarked}
      className={`flex size-8 items-center justify-center rounded-md transition ${
        isBookmarked ? 'text-primary opacity-100' : 'opacity-70 hover:opacity-100'
      }`}
    >
      <Bookmark
        className="size-4"
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  )
}
