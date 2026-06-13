import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

export default function ContactLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-24" />

      {/* Title */}
      <div className="mt-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-3 h-5 w-72" />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Contact form — 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>

        {/* Contact info — 1/3 */}
        <aside className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <SkeletonText lines={2} />
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}
