"use client"

import { X, AlertTriangle, Loader2 } from "lucide-react"

interface ConfirmModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  pending?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  pending = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-5 shadow-2xl" role="dialog" aria-labelledby="confirm-title">
        <div className="flex items-start gap-3">
          {variant === "danger" && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
          )}
          <div className="flex-1">
            <h2 id="confirm-title" className="font-heading text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium disabled:opacity-60 ${variant === "danger" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
          >
            {pending && <Loader2 className="size-3.5 animate-spin" />}
            {confirmLabel}
          </button>
          <button type="button" onClick={onClose} className="h-9 rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-muted">
            {cancelLabel}
          </button>
        </div>
      </div>
    </>
  )
}
