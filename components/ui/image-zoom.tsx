'use client'

import { useState } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

export function ImageZoom({ src, alt, className }: ImageZoomProps) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setZoom(1); }}
        className={cn('group relative cursor-zoom-in overflow-hidden rounded-lg', className)}
        aria-label={`Zoom ${alt}`}
      >
        <img src={src} alt={alt} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
          <ZoomIn className="size-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 animate-fade-in">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/10 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Zoom out"
            >
              <ZoomOut className="size-5" />
            </button>
            <span className="flex items-center px-2 text-sm font-medium text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Zoom in"
            >
              <ZoomIn className="size-5" />
            </button>
          </div>

          <div
            className="max-h-[90vh] max-w-[90vw] overflow-auto"
            onClick={() => setOpen(false)}
          >
            <img
              src={src}
              alt={alt}
              className="animate-scale-in transition-transform duration-300"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
