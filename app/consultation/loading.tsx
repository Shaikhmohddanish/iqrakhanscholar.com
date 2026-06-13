import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

export default function ConsultationLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-32" />

      {/* Hero */}
      <div className="mt-8 text-center">
        <Skeleton className="mx-auto h-9 w-64" />
        <Skeleton className="mx-auto mt-3 h-5 w-96" />
        <Skeleton className="mx-auto mt-2 h-5 w-80" />
        <Skeleton className="mx-auto mt-6 h-11 w-40 rounded-lg" />
      </div>

      {/* Pricing cards */}
      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 space-y-4"
          >
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-20" />
            <SkeletonText lines={2} />
            <div className="space-y-2 pt-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-2 h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* What to expect */}
      <div className="mt-16">
        <Skeleton className="mx-auto h-7 w-52" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <SkeletonText lines={2} />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-16">
        <Skeleton className="mx-auto h-7 w-40" />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-4">
              <SkeletonText lines={3} />
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <Skeleton className="mx-auto h-7 w-32" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
