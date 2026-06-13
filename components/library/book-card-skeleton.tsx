import { Skeleton } from '@/components/ui/skeleton'

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}
