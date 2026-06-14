'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Pagination } from './pagination'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchKey?: string
  searchPlaceholder?: string
  pageSize?: number
  onRowClick?: (row: T) => void
  emptyMessage?: string
  className?: string
  exportable?: boolean
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No data found',
  className,
  exportable = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter
  const filtered = useMemo(() => {
    if (!search || !searchKey) return data
    const q = search.toLowerCase()
    return data.filter((row) => {
      const val = String(row[searchKey] ?? '').toLowerCase()
      return val.includes(q)
    })
  }, [data, search, searchKey])

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal === bVal) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = aVal < bVal ? -1 : 1
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') {
        setSortKey(null)
        setSortDir(null)
      }
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setCurrentPage(1)
  }

  function handleExport() {
    const headers = columns.map((c) => c.header).join(',')
    const rows = sorted.map((row) =>
      columns.map((c) => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`).join(','),
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function SortIcon({ column }: { column: string }) {
    if (sortKey !== column) return <ChevronsUpDown className="size-3.5 text-muted-foreground/40" />
    if (sortDir === 'asc') return <ChevronUp className="size-3.5 text-primary" />
    return <ChevronDown className="size-3.5 text-primary" />
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {searchKey && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder={searchPlaceholder}
              className="input-base pl-9"
            />
          </div>
        )}
        {exportable && (
          <button
            type="button"
            onClick={handleExport}
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Download className="size-4" />
            Export
          </button>
        )}
      </div>

      {/* Table - desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('px-4 py-3 text-left font-semibold text-foreground', col.className)}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                    >
                      {col.header}
                      <SortIcon column={col.key} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border last:border-b-0 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-muted/30',
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3', col.className)}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card view - mobile */}
      <div className="space-y-3 md:hidden">
        {paginated.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          paginated.map((row, i) => (
            <div
              key={i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'rounded-xl border border-border bg-card p-4 space-y-2',
                onRowClick && 'cursor-pointer hover:bg-muted/30',
              )}
            >
              {columns.map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{col.header}</span>
                  <span className="text-sm text-foreground text-right">
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
