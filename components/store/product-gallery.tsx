'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  // Use at least the single product image
  const gallery = images.length > 0 ? images : ['/placeholder.svg']

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted"
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={gallery[activeIndex]}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          priority
          className={cn(
            'object-cover transition-transform duration-500',
            zoomed && 'scale-150',
          )}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setActiveIndex(i); setZoomed(false) }}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:size-20',
                i === activeIndex ? 'border-primary' : 'border-border hover:border-primary/50',
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
