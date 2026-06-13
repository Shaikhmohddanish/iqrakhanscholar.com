'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  side?: 'left' | 'right' | 'bottom'
  className?: string
}

const slideClasses = {
  left: 'inset-y-0 left-0 w-full max-w-sm border-r animate-slide-in-left',
  right: 'inset-y-0 right-0 w-full max-w-sm border-l animate-slide-in-right',
  bottom: 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t animate-slide-in-bottom',
}

export function Drawer({
  open,
  onClose,
  children,
  title,
  side = 'right',
  className,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleKey)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKey)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="backdrop-overlay animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Panel'}
        className={cn(
          'fixed z-10 flex flex-col border-border bg-card shadow-[var(--shadow-xl)]',
          slideClasses[side],
          className,
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </aside>
    </div>
  )
}
