"use client"

import { useEffect, useRef, useState } from "react"
import { Globe, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { SUPPORTED_CURRENCIES } from "@/lib/currency"
import { useCurrency } from "./currency-provider"

interface CurrencySwitcherProps {
  className?: string
  variant?: "icon" | "labeled"
}

export function CurrencySwitcher({ className, variant = "icon" }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function choose(code: string) {
    setCurrency(code)
    setOpen(false)
  }

  const menu = open && (
    <div
      className="absolute right-0 top-full z-50 mt-2 max-h-80 w-48 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-[var(--shadow-lg)] animate-scale-in"
      role="listbox"
      aria-label="Select currency"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <button
          key={c.code}
          type="button"
          role="option"
          aria-selected={c.code === currency}
          onClick={() => choose(c.code)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            c.code === currency
              ? "bg-secondary font-medium text-primary"
              : "text-foreground/80 hover:bg-muted hover:text-foreground",
          )}
        >
          <span className="flex items-center gap-2">
            <span className="w-7 text-left text-muted-foreground">{c.symbol}</span>
            <span>{c.code}</span>
          </span>
          {c.code === currency && <Check className="size-4 shrink-0" />}
        </button>
      ))}
    </div>
  )

  if (variant === "labeled") {
    return (
      <div ref={ref} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Globe className="size-4" />
          Currency
          <span className="ml-auto flex items-center gap-1 text-foreground">
            {currency}
            <ChevronDown className="size-4" />
          </span>
        </button>
        {menu}
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-primary"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select currency"
      >
        <Globe className="size-[18px]" />
        <span className="hidden sm:inline">{currency}</span>
        <ChevronDown className="size-3.5" />
      </button>
      {menu}
    </div>
  )
}
