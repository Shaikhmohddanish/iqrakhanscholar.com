import { GridSkeleton } from '@/components/ui/grid-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="mb-2 h-10 w-64" />
      <Skeleton className="mb-10 h-5 w-96" />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 flex-1 max-w-xs rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      <div className="flex gap-8">
        {/* Sidebar (desktop) */}
        <div className="hidden w-60 shrink-0 lg:block">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                {[1, 2, 3].map((j) => <Skeleton key={j} className="h-4 w-full" />)}
              </div>
            ))}
          </div>
        </div>
        {/* Grid */}
        <div className="flex-1">
          <GridSkeleton variant="product-grid" count={6} />
        </div>
      </div>
    </div>
  )
}
