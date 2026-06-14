"use client"

import { useState, useTransition } from "react"
import { exportDataAction, deleteAccountAction } from "@/app/actions/account"
import { Download, Trash2, AlertTriangle } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"

export function DataPrivacySection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pending, startTransition] = useTransition()
  const [exportData, setExportData] = useState<string | null>(null)

  function handleExport() {
    startTransition(async () => {
      const result = await exportDataAction()
      if (result.data) {
        setExportData(JSON.stringify(result.data, null, 2))
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteAccountAction()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Data export */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
          <Download className="size-4 text-primary" />
          Export your data
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Download a copy of your personal data in JSON format. This includes your profile, orders, bookings, and reading history.
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={pending}
          className="mt-4 flex h-9 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          {pending ? <BarLoader size="sm" /> : <Download className="size-3.5" />}
          Export data
        </button>

        {exportData && (
          <div className="mt-4">
            <a
              href={`data:application/json;charset=utf-8,${encodeURIComponent(exportData)}`}
              download="my-iqra-khan-data.json"
              className="flex h-9 w-fit items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              <Download className="size-3.5" />
              Download JSON file
            </a>
          </div>
        )}
      </div>

      {/* Account deletion */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-destructive">
          <Trash2 className="size-4" />
          Delete account
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action is irreversible. Your orders and digital purchases will be lost.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 flex h-9 items-center gap-2 rounded-full border border-destructive/40 px-5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
            Delete my account
          </button>
        ) : (
          <div className="mt-4 rounded-xl border border-destructive/40 bg-background p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">Are you absolutely sure?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This will permanently delete your account. There is no way to undo this.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="flex h-9 items-center gap-2 rounded-full bg-destructive px-5 text-sm font-medium text-destructive-foreground disabled:opacity-60"
              >
                {pending && <BarLoader size="sm" />}
                Yes, delete everything
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-9 rounded-full border border-border px-5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
