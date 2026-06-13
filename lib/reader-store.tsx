'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type Dispatch,
  type ReactNode,
} from 'react'

export type ReaderTheme = 'light' | 'dark' | 'sepia'
export type ReaderFitMode = 'width' | 'page'
export type ReaderSidebarTab = 'toc' | 'bookmarks'

export interface ReaderState {
  currentPage: number
  totalPages: number
  zoom: number // 50–200
  theme: ReaderTheme
  fitMode: ReaderFitMode
  sidebarOpen: boolean
  sidebarTab: ReaderSidebarTab
  settingsOpen: boolean
  bookmarks: number[]
  isFullscreen: boolean
  isLoading: boolean
  error: string | null
}

export type ReaderAction =
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_TOTAL_PAGES'; total: number }
  | { type: 'PREV_PAGE' }
  | { type: 'NEXT_PAGE' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'SET_THEME'; theme: ReaderTheme }
  | { type: 'SET_FIT_MODE'; mode: ReaderFitMode }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_TAB'; tab: ReaderSidebarTab }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_BOOKMARK'; page: number }
  | { type: 'LOAD_BOOKMARKS'; bookmarks: number[] }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }

function reducer(state: ReaderState, action: ReaderAction): ReaderState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: Math.max(1, Math.min(action.page, state.totalPages || 1)) }
    case 'PREV_PAGE':
      return { ...state, currentPage: Math.max(1, state.currentPage - 1) }
    case 'NEXT_PAGE':
      return { ...state, currentPage: Math.min(state.totalPages || 1, state.currentPage + 1) }
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.total, isLoading: false }
    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(50, Math.min(200, action.zoom)) }
    case 'ZOOM_IN':
      return { ...state, zoom: Math.min(200, state.zoom + 10) }
    case 'ZOOM_OUT':
      return { ...state, zoom: Math.max(50, state.zoom - 10) }
    case 'SET_THEME':
      return { ...state, theme: action.theme }
    case 'SET_FIT_MODE':
      return { ...state, fitMode: action.mode }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_SIDEBAR_TAB':
      return { ...state, sidebarTab: action.tab, sidebarOpen: true }
    case 'TOGGLE_SETTINGS':
      return { ...state, settingsOpen: !state.settingsOpen }
    case 'TOGGLE_BOOKMARK': {
      const has = state.bookmarks.includes(action.page)
      return {
        ...state,
        bookmarks: has
          ? state.bookmarks.filter((p) => p !== action.page)
          : [...state.bookmarks, action.page].sort((a, b) => a - b),
      }
    }
    case 'LOAD_BOOKMARKS':
      return { ...state, bookmarks: action.bookmarks }
    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullscreen: !state.isFullscreen }
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading }
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false }
    default:
      return state
  }
}

const defaultState: ReaderState = {
  currentPage: 1,
  totalPages: 0,
  zoom: 100,
  theme: 'light',
  fitMode: 'width',
  sidebarOpen: false,
  sidebarTab: 'toc',
  settingsOpen: false,
  bookmarks: [],
  isFullscreen: false,
  isLoading: true,
  error: null,
}

const ReaderContext = createContext<{
  state: ReaderState
  dispatch: Dispatch<ReaderAction>
} | null>(null)

// Debounce utility
function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// Save progress to DB (debounced, fire-and-forget)
const saveProgressToDb = debounce((bookId: string, currentPage: number, totalPages: number) => {
  fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId, currentPage, totalPages }),
  }).catch(() => {})
}, 2000)

export function ReaderProvider({ children, bookId }: { children: ReactNode; bookId: string }) {
  const [state, dispatch] = useReducer(reducer, defaultState)

  // Restore last read page — try localStorage first, then DB
  useEffect(() => {
    const savedPage = localStorage.getItem(`reader:${bookId}:page`)
    if (savedPage) {
      const page = parseInt(savedPage, 10)
      if (!isNaN(page) && page > 1) dispatch({ type: 'SET_PAGE', page })
    }
    const savedBookmarks = localStorage.getItem(`reader:${bookId}:bookmarks`)
    if (savedBookmarks) {
      try {
        const parsed = JSON.parse(savedBookmarks) as number[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'LOAD_BOOKMARKS', bookmarks: parsed })
        }
      } catch {
        // ignore corrupt data
      }
    }
    // Also hydrate from DB to sync across devices
    fetch(`/api/progress?bookId=${bookId}`)
      .then((r) => r.json())
      .then((data: { progress?: { currentPage: number; totalPages: number; bookmarks: number[] } }) => {
        if (data.progress) {
          if (data.progress.currentPage > 1) {
            dispatch({ type: 'SET_PAGE', page: data.progress.currentPage })
          }
          if (data.progress.bookmarks.length > 0) {
            dispatch({ type: 'LOAD_BOOKMARKS', bookmarks: data.progress.bookmarks })
          }
        }
      })
      .catch(() => {})
  }, [bookId]) // runs once on mount

  // Persist current page — localStorage (instant) + DB (debounced)
  useEffect(() => {
    if (state.totalPages > 0) {
      localStorage.setItem(`reader:${bookId}:page`, String(state.currentPage))
      saveProgressToDb(bookId, state.currentPage, state.totalPages)
    }
  }, [state.currentPage, state.totalPages, bookId])

  // Persist bookmarks — localStorage (instant) + DB
  useEffect(() => {
    localStorage.setItem(`reader:${bookId}:bookmarks`, JSON.stringify(state.bookmarks))
  }, [state.bookmarks, bookId])

  return <ReaderContext.Provider value={{ state, dispatch }}>{children}</ReaderContext.Provider>
}

export function useReader() {
  const ctx = useContext(ReaderContext)
  if (!ctx) throw new Error('useReader must be used within ReaderProvider')
  return ctx
}
