import { GridSkeleton } from '@/components/ui/grid-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function LibraryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Hero */}
      <Skeleton className="h-64 w-full rounded-2xl sm:h-80" />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}
      </div>

      {/* Section label */}
      <Skeleton className="h-6 w-40" />
      <GridSkeleton variant="book" count={5} />

      <Skeleton className="h-6 w-40" />
      <GridSkeleton variant="book" count={5} />
    </div>
  )
}
