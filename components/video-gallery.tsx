import Image from 'next/image'
import { Play } from 'lucide-react'
import { videos } from '@/lib/site-data'

export function VideoGallery() {
  return (
    <section id="videos" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Watch & Reflect
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Lectures, reminders &amp; reflections
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Short reminders and full talks to nourish your heart wherever you
            are.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {videos.map((video, i) => (
            <button
              key={video.title}
              type="button"
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card text-left ${
                i === 0 ? 'md:col-span-2 md:row-span-1' : ''
              }`}
            >
              <div
                className={`relative ${i === 0 ? 'aspect-video' : 'aspect-video md:aspect-[4/5]'}`}
              >
                <Image
                  src={video.image || '/placeholder.svg'}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-lg transition-transform group-hover:scale-110">
                  <Play className="size-5 fill-current" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-medium text-background/80">
                    {video.meta}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-background">
                    {video.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
