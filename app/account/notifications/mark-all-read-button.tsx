"use client"

import { useTransition } from "react"
import { markAllNotificationsReadAction } from "@/app/actions/notifications"
import { CheckCheck } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"

export function MarkAllReadButton() {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => markAllNotificationsReadAction())}
      className="flex shrink-0 h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
    >
      {pending ? <BarLoader size="sm" /> : <CheckCheck className="size-3.5" />}
      Mark all read
    </button>
  )
}
