"use client"

import { useRef, useState } from "react"
import { UploadCloud, Loader2, X, GripVertical, Star } from "lucide-react"

interface ImageUploadProps {
  kind: "product" | "blog" | "book"
  value: string[]
  onChange: (urls: string[]) => void
  multiple?: boolean
}

export function ImageUpload({ kind, value, onChange, multiple = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragIndex = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)

    const toUpload = multiple ? Array.from(files) : [files[0]]
    setUploading((n) => n + toUpload.length)

    const results: string[] = []
    for (const file of toUpload) {
      try {
        const fd = new FormData()
        fd.append("file", file)
        fd.append("kind", kind)
        const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Upload failed")
        results.push(json.url as string)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setUploading((n) => n - 1)
      }
    }

    if (results.length > 0) {
      if (multiple) {
        onChange([...value, ...results])
      } else {
        onChange(results)
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function moveLeft(index: number) {
    if (index === 0) return
    const next = [...value]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  function moveRight(index: number) {
    if (index === value.length - 1) return
    const next = [...value]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  // Drag-to-reorder handlers (only for multiple)
  function onDragStart(index: number) {
    dragIndex.current = index
  }

  function onDragEnter(index: number) {
    setDragOverIndex(index)
  }

  function onDragEnd() {
    const from = dragIndex.current
    const to = dragOverIndex
    dragIndex.current = null
    setDragOverIndex(null)
    if (from === null || to === null || from === to) return
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const showDropzone = multiple || value.length === 0

  return (
    <div className="flex flex-col gap-3">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div
              key={url + i}
              draggable={multiple}
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`group relative flex flex-col gap-1 ${dragOverIndex === i ? "opacity-50" : ""}`}
            >
              {/* Thumbnail */}
              <div className="relative size-24 overflow-hidden rounded-xl border-2 border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="size-full object-cover"
                />
                {/* Cover badge */}
                {multiple && i === 0 && (
                  <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-full bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    <Star className="size-2.5 fill-current" /> Cover
                  </span>
                )}
                {/* Drag handle overlay */}
                {multiple && (
                  <div className="absolute inset-0 flex cursor-grab items-center justify-center opacity-0 group-hover:opacity-100">
                    <GripVertical className="size-5 text-white drop-shadow" />
                  </div>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                >
                  <X className="size-3" />
                </button>
              </div>

              {/* Reorder arrows */}
              {multiple && value.length > 1 && (
                <div className="flex justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveLeft(i)}
                    disabled={i === 0}
                    className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveRight(i)}
                    disabled={i === value.length - 1}
                    className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {showDropzone && (
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background py-8 text-center transition-colors hover:border-primary hover:bg-muted/50"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {uploading > 0 ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <UploadCloud className="size-6 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">
            {uploading > 0
              ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}…`
              : multiple
              ? "Click or drag to upload images (max 5 MB each)"
              : "Click or drag to upload image (max 5 MB)"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading > 0}
          />
        </label>
      )}

      {/* Add more button when images exist (multiple mode) */}
      {multiple && value.length > 0 && (
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-foreground">
          {uploading > 0 ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UploadCloud className="size-4" />
          )}
          {uploading > 0 ? "Uploading…" : "Add more images"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading > 0}
          />
        </label>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
