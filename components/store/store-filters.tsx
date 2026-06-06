"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const filters = [
  { label: "All Products", value: "" },
  { label: "Digital", value: "digital" },
  { label: "Physical", value: "physical" },
]

const sorts = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
]

export function StoreFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const activeType = params.get("type") ?? ""
  const activeSort = params.get("sort") ?? ""

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(`${pathname}?${next.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => update("type", f.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeType === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-primary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden sm:inline">Sort</span>
        <select
          value={activeSort}
          onChange={(e) => update("sort", e.target.value)}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
