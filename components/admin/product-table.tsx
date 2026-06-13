"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import type { PublicProduct } from "@/lib/product-types"
import { formatPrice } from "@/lib/product-types"
import { deleteProductAction } from "@/app/actions/admin/products"
import { Pencil, Trash2, Plus, Loader2, Search } from "lucide-react"

export function ProductTable({ products }: { products: PublicProduct[] }) {
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const filtered = products.filter(
    (p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  )

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    startTransition(async () => {
      await deleteProductAction(id)
      setDeleting(null)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Link href="/admin/products/new" className="flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No products found.</td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={product.image || "/placeholder.svg"} alt={product.title} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-medium text-foreground line-clamp-1">{product.title}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{product.category}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${product.type === "digital" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                      {product.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatPrice(product.price, product.currency)}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {product.stock === null ? "∞" : product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/products/${product.id}`} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.title)}
                        disabled={deleting === product.id || pending}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                      >
                        {deleting === product.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
