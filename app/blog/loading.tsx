import { GridSkeleton } from '@/components/ui/grid-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-5 w-80" />

      {/* Featured article */}
      <Skeleton className="h-56 w-full rounded-2xl sm:h-72" />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-9 w-28 rounded-full" />)}
      </div>

      <GridSkeleton variant="article" count={6} />
    </div>
  )
}
