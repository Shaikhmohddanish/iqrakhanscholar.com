'use client'

import { ReaderProvider, useReader } from '@/lib/reader-store'
import { ReaderToolbar } from './reader-toolbar'
import { ReaderContent } from './reader-content'
import { ReaderSidebar } from './reader-sidebar'
import { ReaderSettings } from './reader-settings'
import { ReaderProgress } from './reader-progress'
import { ReaderNavigation } from './reader-navigation'
import { MobileReader } from './mobile-reader'

interface ReaderShellProps {
  bookId: string
  bookSlug: string
  bookTitle: string
  bookAuthor: string
  totalPageHint: number
  userEmail: string
}

const themeBg: Record<string, string> = {
  light: 'bg-gray-100',
  dark: 'bg-gray-950',
  sepia: 'bg-amber-50',
}

function ReaderInner({ bookId, bookTitle, bookAuthor, userEmail }: Omit<ReaderShellProps, 'bookSlug' | 'totalPageHint'>) {
  const { state } = useReader()

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${themeBg[state.theme] ?? 'bg-gray-100'}`}
      data-reader-theme={state.theme}
    >
      {/* Keyboard listener (renders nothing) */}
      <ReaderNavigation />

      {/* Top toolbar - desktop only */}
      <div className="hidden sm:block">
        <ReaderToolbar bookTitle={bookTitle} bookAuthor={bookAuthor} bookId={bookId} />
      </div>

      {/* Main row */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <ReaderSidebar bookTitle={bookTitle} />

        {/* PDF canvas area */}
        <ReaderContent bookId={bookId} userEmail={userEmail} />

        {/* Settings overlay (right side) */}
        <ReaderSettings />
      </div>

      {/* Bottom progress - desktop only */}
      <div className="hidden sm:block">
        <ReaderProgress />
      </div>

      {/* Mobile toolbar - mobile only */}
      <MobileReader bookTitle={bookTitle} bookId={bookId} />
    </div>
  )
}

export function ReaderShell(props: ReaderShellProps) {
  return (
    <ReaderProvider bookId={props.bookId}>
      <ReaderInner
        bookId={props.bookId}
        bookTitle={props.bookTitle}
        bookAuthor={props.bookAuthor}
        userEmail={props.userEmail}
      />
    </ReaderProvider>
  )
}
