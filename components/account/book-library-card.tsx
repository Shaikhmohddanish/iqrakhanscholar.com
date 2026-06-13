"use client"

import Image from "next/image"
import Link from "next/link"
import { BookOpen, Bookmark } from "lucide-react"
import type { PublicProduct } from "@/lib/product-types"
import type { PublicProgress } from "@/lib/reading-progress"
import { cn } from "@/lib/utils"

interface BookLibraryCardProps {
  product: PublicProduct
  progress: PublicProgress | null
  view?: "grid" | "list"
}

export function BookLibraryCard({ product, progress, view = "grid" }: BookLibraryCardProps) {
  const pct = progress?.percentComplete ?? 0
  const isStarted = (progress?.currentPage ?? 0) > 1

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.category}</p>
          <h3 className="mt-0.5 font-heading text-sm font-semibold text-foreground truncate">{product.title}</h3>
          {progress && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{pct}% complete · page {progress.currentPage} of {progress.totalPages}</p>
            </div>
          )}
        </div>
        <Link
          href={`/reader/${product.slug}`}
          className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <BookOpen className="size-3.5" />
          {isStarted ? "Continue" : "Read"}
        </Link>
      </div>
    )
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image src={product.image || "/placeholder.svg"} alt={product.title} fill sizes="(min-width: 1024px) 16rem, (min-width: 640px) 40vw, 80vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        {progress && progress.bookmarks.length > 0 && (
          <div className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-primary/90 text-[10px] font-bold text-primary-foreground">
            <Bookmark className="size-3.5" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 font-heading text-sm font-semibold leading-snug text-foreground">{product.title}</h3>
        </div>

        {progress ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{pct}% read</span>
              <span>{progress.bookmarks.length} bookmark{progress.bookmarks.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Not started</p>
        )}

        <Link
          href={`/reader/${product.slug}`}
          className="mt-auto flex h-9 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <BookOpen className="size-3.5" />
          {isStarted ? "Continue reading" : "Start reading"}
        </Link>
      </div>
    </div>
  )
}
