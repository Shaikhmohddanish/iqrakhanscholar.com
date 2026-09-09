'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroVideoProps {
  /** Path to the mp4 source; the .webm sibling is preferred automatically. */
  src: string
  /** Poster shown instantly before/while the video loads. */
  poster?: string
}

/**
 * Full-bleed background video that only decodes while it's actually on screen.
 *
 * `preload="none"` keeps it off the initial-load critical path (the poster shows
 * immediately), and an IntersectionObserver play/pauses the video so it never
 * decodes on the main thread once the user scrolls past the hero.
 */
// Below this width the video is never mounted, so phones never download it.
const DESKTOP_QUERY = '(min-width: 768px)'

export function HeroVideo({ src, poster }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  // Starts false so the server renders no <video> at all and mobile issues no
  // request; desktop mounts it after hydration. Rendering nothing first is safe
  // because the video is purely decorative and sits behind the hero content.
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const sync = () => setShowVideo(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!showVideo) return
    const video = ref.current
    if (!video) return

    // Don't start fetching/decoding until the window has fully loaded, so the
    // video never competes with the LCP image and other critical resources.
    let observer: IntersectionObserver | undefined
    const start = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // play() can reject if autoplay is blocked — ignore, the poster remains.
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        },
        { threshold: 0.1 },
      )
      observer.observe(video)
    }

    if (document.readyState === 'complete') {
      start()
    } else {
      window.addEventListener('load', start, { once: true })
    }
    return () => {
      window.removeEventListener('load', start)
      observer?.disconnect()
    }
  }, [showVideo])

  if (!showVideo) return null

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    >
      {/* WebM (VP9) first for ~34% smaller payload; MP4 fallback for Safari/older browsers.
          If neither plays, the poster image remains visible — graceful, no JS needed. */}
      <source src={src.replace(/\.mp4$/, '.webm')} type="video/webm" />
      <source src={src} type="video/mp4" />
    </video>
  )
}
