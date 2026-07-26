"use client"

import { SUPPORTED_CURRENCIES } from "@/lib/currency"
import { Plus, X } from "lucide-react"

export interface CurrencyPriceRow {
  code: string
  amount: string
}

// Editable list of per-currency prices for the admin product/book forms. The
// base currency is edited separately and excluded here to avoid duplication.
export function CurrencyPriceList({
  rows,
  onChange,
  excludeCode,
}: {
  rows: CurrencyPriceRow[]
  onChange: (rows: CurrencyPriceRow[]) => void
  excludeCode?: string
}) {
  const usable = SUPPORTED_CURRENCIES.filter((c) => c.code !== excludeCode)

  function update(index: number, patch: Partial<CurrencyPriceRow>) {
    onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  function remove(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  function add() {
    const taken = new Set(rows.map((r) => r.code))
    const next = usable.find((c) => !taken.has(c.code))
    if (!next) return
    onChange([...rows, { code: next.code, amount: "" }])
  }

  const canAdd = rows.length < usable.length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Additional currency prices</label>
          <p className="text-xs text-muted-foreground">
            Set the exact amount buyers pay in each currency. Currencies left out fall back to the base price.
          </p>
        </div>
      </div>

      {rows.map((row, i) => {
        const taken = new Set(rows.filter((_, idx) => idx !== i).map((r) => r.code))
        const options = usable.filter((c) => !taken.has(c.code))
        return (
          <div key={i} className="flex items-center gap-2">
            <select
              value={row.code}
              onChange={(e) => update(i, { code: e.target.value })}
              className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {options.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="any"
              min="0"
              value={row.amount}
              onChange={(e) => update(i, { amount: e.target.value })}
              placeholder="Amount"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove currency"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}

      {canAdd && (
        <button
          type="button"
          onClick={add}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-4" />
          Add currency
        </button>
      )}
    </div>
  )
}
