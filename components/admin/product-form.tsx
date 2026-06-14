"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { PublicProduct } from "@/lib/product-types"
import { createProductAction, updateProductAction } from "@/app/actions/admin/products"
import { CheckCircle2 } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"
import { ImageUpload } from "./image-upload"
import { PdfUpload } from "./pdf-upload"

interface ProductFormProps {
  product?: PublicProduct
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfPublicId, setPdfPublicId] = useState<string | undefined>(undefined)
  const [images, setImages] = useState<string[]>(
    product?.images ?? (product?.image ? [product.image] : []),
  )

  const [form, setForm] = useState({
    title: product?.title ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? "",
    type: product?.type ?? "digital",
    price: product ? String(product.price / 100) : "",
    currency: product?.currency ?? "USD",
    badge: product?.badge ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    stock: product?.stock !== null && product?.stock !== undefined ? String(product.stock) : "",
    featured: product?.featured ?? false,
    author: product?.author ?? "",
    pageCount: product?.pageCount ? String(product.pageCount) : "",
  })

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === "title" && !product) {
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
      const data: Record<string, unknown> = {
        title: form.title,
        slug: form.slug,
        category: form.category,
        type: form.type as "digital" | "physical",
        price: Math.round(parseFloat(form.price) * 100),
        currency: form.currency,
        image: images[0] ?? "",
        images,
        badge: form.badge || undefined,
        shortDescription: form.shortDescription,
        description: form.description,
        highlights: [],
        stock: form.type === "physical" && form.stock ? parseInt(form.stock) : null,
        featured: form.featured,
        rating: product?.rating ?? 5,
        reviews: product?.reviews ?? 0,
      }

      if (form.type === "digital") {
        if (form.author) data.author = form.author
        if (form.pageCount) data.pageCount = parseInt(form.pageCount)
        if (pdfPublicId) data.pdfPublicId = pdfPublicId
      }

      const result = product
        ? await updateProductAction(product.id, data as Parameters<typeof updateProductAction>[1])
        : await createProductAction(data as Parameters<typeof createProductAction>[0])

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/admin/products"), 1000)
      }
    })
  }

  function field(label: string, key: string, type = "text", required = false) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          {label}{required && <span className="text-destructive"> *</span>}
        </label>
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
        {field("Category", "category", "text", true)}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Type <span className="text-destructive">*</span></label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
          </select>
        </div>
        {field("Price (USD)", "price", "number", true)}
        {form.type === "physical" && field("Stock quantity", "stock", "number")}
        {field("Badge (optional)", "badge", "text")}
      </div>

      {/* Product images */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Product images</label>
        <p className="text-xs text-muted-foreground">First image is used as the cover. Drag or use arrows to reorder.</p>
        <ImageUpload kind="product" multiple value={images} onChange={setImages} />
      </div>

      {/* Digital book fields */}
      {form.type === "digital" && (
        <div className="rounded-xl border border-border bg-muted/30 p-5 flex flex-col gap-5">
          <p className="text-sm font-semibold text-foreground">Digital book details</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {field("Author", "author")}
            {field("Page count", "pageCount", "number")}
          </div>

          {/* PDF upload */}
          <PdfUpload
            slug={form.slug}
            pdfPublicId={pdfPublicId}
            initialFileName={product?.hasPdf ? "PDF already uploaded" : null}
            onChange={setPdfPublicId}
            onUploadingChange={setPdfUploading}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Short description</label>
        <input
          type="text"
          value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
        Featured product
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-4" /> Saved! Redirecting…
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending || pdfUploading} className="flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {pending && <BarLoader size="sm" />}
          {product ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.back()} className="h-10 rounded-full border border-border px-6 text-sm font-medium text-foreground hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  )
}
