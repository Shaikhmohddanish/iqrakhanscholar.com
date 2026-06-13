import { cn } from '@/lib/utils'

type Variant = 'list' | 'grid' | 'detail'

interface LoadingPageProps {
  variant?: Variant
  className?: string
}

function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn('animate-skeleton rounded-lg', className)} />
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-4">
          <SkeletonBox className="size-12 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
          </div>
          <SkeletonBox className="h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border">
          <SkeletonBox className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <SkeletonBox className="h-5 w-16" />
              <SkeletonBox className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <SkeletonBox className="aspect-square w-full rounded-xl" />
      <div className="space-y-6">
        <div className="space-y-3">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-8 w-3/4" />
          <SkeletonBox className="h-4 w-1/3" />
        </div>
        <SkeletonBox className="h-6 w-28" />
        <div className="space-y-2">
          <SkeletonBox className="h-3 w-full" />
          <SkeletonBox className="h-3 w-full" />
          <SkeletonBox className="h-3 w-2/3" />
        </div>
        <div className="flex gap-3">
          <SkeletonBox className="h-12 flex-1 rounded-lg" />
          <SkeletonBox className="h-12 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function LoadingPage({ variant = 'grid', className }: LoadingPageProps) {
  return (
    <div className={cn('animate-fade-in', className)}>
      {/* Header skeleton */}
      <div className="mb-8 space-y-3">
        <SkeletonBox className="h-8 w-48" />
        <SkeletonBox className="h-4 w-80" />
      </div>
      {variant === 'list' && <ListSkeleton />}
      {variant === 'grid' && <GridSkeleton />}
      {variant === 'detail' && <DetailSkeleton />}
    </div>
  )
}
