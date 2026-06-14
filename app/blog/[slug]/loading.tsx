import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

export default function BlogDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-40" />

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        {/* Article - 2/3 width */}
        <article className="lg:col-span-2">
          {/* Back link */}
          <Skeleton className="h-4 w-28" />

          {/* Category + read time */}
          <div className="mt-6 flex items-center gap-3">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Title */}
          <Skeleton className="mt-4 h-10 w-full" />
          <Skeleton className="mt-2 h-10 w-4/5" />

          {/* Excerpt */}
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-2/3" />

          {/* Author row */}
          <div className="mt-6 flex items-center gap-3 border-b border-border pb-6">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          {/* Banner image */}
          <Skeleton className="mt-8 aspect-[2/1] w-full rounded-2xl" />

          {/* Content body */}
          <div className="mt-8 space-y-4">
            <SkeletonText lines={4} />
            <Skeleton className="h-6 w-52" />
            <SkeletonText lines={3} />
            <Skeleton className="h-6 w-44" />
            <SkeletonText lines={5} />
            <Skeleton className="h-6 w-40" />
            <SkeletonText lines={3} />
          </div>

          {/* Share buttons */}
          <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
            <Skeleton className="h-4 w-12" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="size-8 rounded-lg" />
            ))}
          </div>
        </article>

        {/* Sidebar - 1/3 width */}
        <aside className="space-y-6">
          {/* TOC */}
          <div className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-4 w-28" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>

          {/* Author card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <SkeletonText lines={2} className="mt-3" />
          </div>

          {/* Recent posts */}
          <div>
            <Skeleton className="h-4 w-32" />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-16 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
