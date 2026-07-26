"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { PublicBookAdmin } from "@/lib/books-admin"
import { SUPPORTED_CURRENCIES, toMinorUnits, fromMinorUnits } from "@/lib/currency"
import { CheckCircle2 } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"
import { createBookAction, updateBookAction } from "@/app/actions/admin/books"
import { ImageUpload } from "./image-upload"
import { PdfUpload } from "./pdf-upload"
import { CurrencyPriceList, type CurrencyPriceRow } from "./currency-price-list"

interface BookFormProps {
  book?: PublicBookAdmin
}

export function BookForm({ book }: BookFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfPublicId, setPdfPublicId] = useState<string | undefined>(book?.pdfPublicId)

  const baseCurrency = book?.currency ?? "USD"
  const [extraPrices, setExtraPrices] = useState<CurrencyPriceRow[]>(() =>
    Object.entries(book?.prices ?? {})
      .filter(([code]) => code !== baseCurrency)
      .map(([code, minor]) => ({ code, amount: String(fromMinorUnits(minor, code)) })),
  )

  const [form, setForm] = useState({
    title: book?.title ?? "",
    slug: book?.slug ?? "",
    author: book?.author ?? "Iqra Khan",
    category: book?.category ?? "",
    description: book?.description ?? "",
    coverImage: book?.coverImage ?? "",
    price: book ? String(fromMinorUnits(book.price, baseCurrency)) : "",
    currency: baseCurrency,
    pageCount: book ? String(book.pageCount) : "",
    featured: book?.featured ?? false,
    status: book?.status ?? "draft",
  })

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === "title" && !book) {
      setForm((f) => ({
        ...f,
        slug: value.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const basePrice = toMinorUnits(parseFloat(form.price), form.currency)
      const prices: Record<string, number> = { [form.currency]: basePrice }
      for (const row of extraPrices) {
        const amount = parseFloat(row.amount)
        if (row.code && !Number.isNaN(amount)) {
          prices[row.code] = toMinorUnits(amount, row.code)
        }
      }

      const data = {
        title: form.title,
        slug: form.slug,
        author: form.author,
        category: form.category,
        description: form.description,
        coverImage: form.coverImage,
        price: basePrice,
        currency: form.currency,
        prices,
        pageCount: parseInt(form.pageCount) || 0,
        featured: form.featured,
        status: form.status as "draft" | "published",
        tags: [],
        rating: book?.rating ?? 5,
        reviews: book?.reviews ?? 0,
        publishedAt: form.status === "published" ? (book?.publishedAt ?? new Date()) : null,
        ...(pdfPublicId ? { pdfPublicId } : {}),
      }

      let result: { error?: string }
      if (book) {
        const res = await updateBookAction(book.id, data)
        result = res.ok ? {} : { error: "Failed to update." }
      } else {
        const res = await createBookAction(data as Parameters<typeof createBookAction>[0])
        result = res.error ? { error: res.error } : {}
      }

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/admin/books"), 1000)
      }
    })
  }

  function field(label: string, key: string, type = "text", required = false) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-destructive"> *</span>}</label>
        <input
          type={type}
          value={(form as Record<string, string | boolean>)[key] as string}
          onChange={(e) => set(key, e.target.value)}
          required={required}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("Title", "title", "text", true)}
        {field("Slug", "slug", "text", true)}
        {field("Author", "author", "text", true)}
        {field("Category", "category", "text", true)}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Base currency <span className="text-destructive">*</span>
          </label>
          <select
            value={form.currency}
            onChange={(e) => set("currency", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </select>
        </div>
        {field("Base price", "price", "number", true)}
        {field("Page count", "pageCount", "number")}
      </div>

      {/* Per-currency pricing */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <CurrencyPriceList
          rows={extraPrices}
          onChange={setExtraPrices}
          excludeCode={form.currency}
        />
      </div>

      {/* Cover image */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Cover image</label>
        <ImageUpload
          kind="book"
          value={form.coverImage ? [form.coverImage] : []}
          onChange={(urls) => set("coverImage", urls[0] ?? "")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* PDF upload */}
      <PdfUpload
        slug={form.slug}
        pdfPublicId={pdfPublicId}
        initialFileName={book?.pdfPublicId ? "PDF already uploaded" : null}
        onChange={setPdfPublicId}
        onUploadingChange={setPdfUploading}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Status</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground self-end">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
          Featured
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-4" /> Saved! Redirecting…
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending || pdfUploading} className="flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {pending && <BarLoader size="sm" />}
          {book ? "Save changes" : "Create book"}
        </button>
        <button type="button" onClick={() => router.back()} className="h-10 rounded-full border border-border px-6 text-sm font-medium text-foreground hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  )
}
