"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, UploadCloud, FileText, X } from "lucide-react"

interface PdfUploadProps {
  slug: string
  pdfPublicId?: string
  initialFileName?: string | null
  onChange: (pdfPublicId: string | undefined) => void
  onUploadingChange?: (uploading: boolean) => void
}

export function PdfUpload({
  slug,
  pdfPublicId,
  initialFileName = null,
  onChange,
  onUploadingChange,
}: PdfUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(initialFileName)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onUploadingChange?.(uploading)
  }, [uploading, onUploadingChange])

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.")
      return
    }
    if (!slug) {
      setError("Please fill in the slug before uploading a PDF.")
      return
    }
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("slug", slug)
      const res = await fetch("/api/admin/upload-pdf", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Upload failed")
      onChange(json.pdfPublicId)
      setFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF upload failed")
    } finally {
      setUploading(false)
    }
  }

  function clear() {
    onChange(undefined)
    setFileName(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">PDF file</label>
      {fileName ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <FileText className="size-5 shrink-0 text-primary" />
          <span className="flex-1 truncate text-sm text-foreground">{fileName}</span>
          <button type="button" onClick={clear} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background py-8 text-center transition-colors hover:border-primary hover:bg-muted/50">
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <UploadCloud className="size-6 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">
            {uploading ? "Uploading…" : "Click to upload PDF (max 50 MB)"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={handleChange}
            disabled={uploading}
          />
        </label>
      )}
      <p className="text-xs text-muted-foreground">
        Uploaded securely to Cloudinary. Customers can read but not download.
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
