'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ================================================================
   Types
   ================================================================ */
type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

/* ================================================================
   Context
   ================================================================ */
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

/* ================================================================
   Provider
   ================================================================ */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

/* ================================================================
   Container (portal-style, top-right)
   ================================================================ */
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  )
}

/* ================================================================
   Toast Item
   ================================================================ */
const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; bg: string; border: string; iconColor: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-card', border: 'border-success/30', iconColor: 'text-success' },
  error: { icon: AlertCircle, bg: 'bg-card', border: 'border-destructive/30', iconColor: 'text-destructive' },
  warning: { icon: AlertTriangle, bg: 'bg-card', border: 'border-warning/30', iconColor: 'text-warning' },
  info: { icon: Info, bg: 'bg-card', border: 'border-info/30', iconColor: 'text-info' },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [exiting, setExiting] = useState(false)
  const config = variantConfig[toast.variant]
  const Icon = config.icon

  useEffect(() => {
    const duration = toast.duration ?? 5000
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(toast.id), 200)
    }, duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role="alert"
      className={cn(
        'flex w-80 items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
        config.bg,
        config.border,
        exiting ? 'animate-toast-out' : 'animate-toast-in',
      )}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', config.iconColor)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setExiting(true)
          setTimeout(() => onDismiss(toast.id), 200)
        }}
        className="mt-0.5 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
