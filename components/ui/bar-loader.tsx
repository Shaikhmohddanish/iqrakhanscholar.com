"use client"

import { cn } from "@/lib/utils"

const sizeMap = {
  xs: { h: "h-3", w: "w-[2px]", gap: "gap-[2px]" },
  sm: { h: "h-3.5", w: "w-[2px]", gap: "gap-[2px]" },
  md: { h: "h-4", w: "w-[2.5px]", gap: "gap-[2.5px]" },
  lg: { h: "h-5", w: "w-[3px]", gap: "gap-[3px]" },
} as const

export function BarLoader({
  size = "md",
  bars = 4,
  className,
  label = "Loading",
}: {
  size?: keyof typeof sizeMap
  bars?: number
  className?: string
  label?: string
}) {
  const s = sizeMap[size]
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center", s.gap, s.h, className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn("bar-loader-bar h-full rounded-full bg-current", s.w)}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  )
}
