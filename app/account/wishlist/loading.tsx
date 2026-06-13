import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
