'use client'

import { Bookmark, List, X } from 'lucide-react'
import { useReader } from '@/lib/reader-store'
import { libraryBooks } from '@/lib/library-data'

const sidebarBg: Record<string, string> = {
  light: 'bg-white border-gray-200 text-gray-800',
  dark: 'bg-gray-900 border-gray-700 text-gray-100',
  sepia: 'bg-amber-50 border-amber-200 text-amber-900',
}

// Derive a fake chapter list from page count for demo purposes.
// In production this would come from the PDF's outline.
function buildChapters(total: number) {
  if (!total) return []
  const count = Math.min(8, Math.ceil(total / 15))
  return Array.from({ length: count }, (_, i) => ({
    title: `Chapter ${i + 1}`,
    page: Math.floor((total / count) * i) + 1,
  }))
}

interface ReaderSidebarProps {
  bookTitle: string
}

export function ReaderSidebar({ bookTitle }: ReaderSidebarProps) {
  const { state, dispatch } = useReader()
  const bg = sidebarBg[state.theme] ?? sidebarBg.light
  const chapters = buildChapters(state.totalPages)

  if (!state.sidebarOpen) return null

  return (
    <aside
      className={`flex w-64 flex-shrink-0 flex-col border-r ${bg} overflow-hidden`}
      aria-label="Reader sidebar"
    >
      {/* Sidebar header */}
      <div className={`flex h-12 items-center justify-between border-b px-4 ${bg}`}>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_SIDEBAR_TAB', tab: 'toc' })}
            aria-label="Table of contents"
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              state.sidebarTab === 'toc' ? 'bg-primary/10 text-primary' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <List className="size-3.5" />
            Contents
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_SIDEBAR_TAB', tab: 'bookmarks' })}
            aria-label="Bookmarks"
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              state.sidebarTab === 'bookmarks' ? 'bg-primary/10 text-primary' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Bookmark className="size-3.5" />
            Marks
          </button>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label="Close sidebar"
          className="rounded-md p-1 opacity-60 transition hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {state.sidebarTab === 'toc' ? (
          <nav aria-label="Table of contents">
            <p className="mb-2 truncate text-xs font-semibold opacity-50">{bookTitle}</p>
            {chapters.length === 0 ? (
              <p className="text-xs opacity-50">Loading contents…</p>
            ) : (
              <ul className="space-y-0.5">
                {chapters.map((ch) => (
                  <li key={ch.page}>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'SET_PAGE', page: ch.page })}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                        state.currentPage === ch.page
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'opacity-70 hover:bg-black/5 hover:opacity-100'
                      }`}
                    >
                      <span>{ch.title}</span>
                      <span className="ml-2 text-xs opacity-50">p. {ch.page}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        ) : (
          <div aria-label="Bookmarks">
            {state.bookmarks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 pt-8 text-center">
                <Bookmark className="size-8 opacity-20" />
                <p className="text-xs opacity-50">No bookmarks yet.</p>
                <p className="text-xs opacity-40">Press the bookmark icon to save a page.</p>
              </div>
            ) : (
              <ul className="space-y-0.5">
                {state.bookmarks.map((page) => (
                  <li key={page}>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'SET_PAGE', page })}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                        state.currentPage === page
                          ? 'bg-primary/10 text-primary'
                          : 'opacity-70 hover:bg-black/5 hover:opacity-100'
                      }`}
                    >
                      <Bookmark className="size-3.5 shrink-0" />
                      <span>Page {page}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
