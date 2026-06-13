'use client'

import { useRef, useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSizeMB?: number
  onFilesChange: (files: File[]) => void
  className?: string
}

export function FileUpload({
  accept = '*',
  multiple = false,
  maxSizeMB = 10,
  onFilesChange,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(newFiles: FileList | null) {
    if (!newFiles) return
    setError(null)
    const arr = Array.from(newFiles)

    // Validate size
    const oversized = arr.find((f) => f.size > maxSizeMB * 1024 * 1024)
    if (oversized) {
      setError(`${oversized.name} exceeds ${maxSizeMB}MB limit`)
      return
    }

    const updated = multiple ? [...files, ...arr] : arr
    setFiles(updated)
    onFilesChange(updated)
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesChange(updated)
  }

  function getFileIcon(type: string) {
    if (type.startsWith('image/')) return <ImageIcon className="size-4 text-info" />
    return <FileText className="size-4 text-muted-foreground" />
  }

  return (
    <div className={className}>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
        )}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Upload className="size-6 text-primary" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Drop files here or{' '}
          <span className="text-primary">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {maxSizeMB}MB per file
        </p>
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
            >
              {getFileIcon(file.type)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
