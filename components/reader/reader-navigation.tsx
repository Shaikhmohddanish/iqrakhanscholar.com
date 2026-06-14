'use client'

import { useEffect } from 'react'
import { useReader } from '@/lib/reader-store'

// Renders nothing - attaches keyboard listeners for page navigation and reader controls.
export function ReaderNavigation() {
  const { state, dispatch } = useReader()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip if focus is in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          dispatch({ type: 'PREV_PAGE' })
          break
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          dispatch({ type: 'NEXT_PAGE' })
          break
        case 'Home':
          e.preventDefault()
          dispatch({ type: 'SET_PAGE', page: 1 })
          break
        case 'End':
          e.preventDefault()
          dispatch({ type: 'SET_PAGE', page: 9999 }) // reducer clamps to totalPages
          break
        case '+':
        case '=':
          dispatch({ type: 'ZOOM_IN' })
          break
        case '-':
          dispatch({ type: 'ZOOM_OUT' })
          break
        case 'b':
        case 'B':
          dispatch({ type: 'TOGGLE_BOOKMARK', page: state.currentPage })
          break
        case 's':
        case 'S':
          dispatch({ type: 'TOGGLE_SETTINGS' })
          break
        case 'Escape':
          dispatch({ type: 'TOGGLE_SETTINGS' })
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch])

  return null
}
