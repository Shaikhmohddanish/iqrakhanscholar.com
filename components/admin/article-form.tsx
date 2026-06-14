"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { PublicArticle } from "@/lib/blog"
import { createArticleAction, updateArticleAction, publishArticleAction } from "@/app/actions/admin/blog"
import { CheckCircle2, Globe } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"
import { ImageUpload } from "./image-upload"

export function ArticleForm({ article }: { article?: PublicArticle }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    coverImage: article?.coverImage ?? "",
    category: article?.category ?? "",
    tags: article?.tags.join(", ") ?? "",
    readingTime: article ? String(article.readingTime) : "5",
    status: article?.status ?? "draft",
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === "title" && !article) {
      setForm((f) => ({
        ...f,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      }))
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const data = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        readingTime: parseInt(form.readingTime) || 5,
        status: form.status as "draft" | "published",
        publishedAt: form.status === "published" ? (article?.publishedAt ?? new Date()) : null,
        author: article?.author ?? "",
        authorId: article?.authorId ?? "",
      }

      const result = article
        ? await updateArticleAction(article.id, data)
        : await createArticleAction(data as Parameters<typeof createArticleAction>[0])

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/admin/blog"), 1000)
      }
    })
  }

  async function handlePublish() {
    if (!article) return
    startTransition(async () => {
      await publishArticleAction(article.id)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Title *</label>
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Slug *</label>
          <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Category</label>
          <input type="text" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Spirituality, Quran, Dua…" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
          <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="prayer, fiqh, sunnah" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-foreground">Cover image</label>
          <ImageUpload
            kind="blog"
            value={form.coverImage ? [form.coverImage] : []}
            onChange={(urls) => set("coverImage", urls[0] ?? "")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Reading time (min)</label>
          <input type="number" value={form.readingTime} onChange={(e) => set("readingTime", e.target.value)} min="1" className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Excerpt</label>
        <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Content (HTML/Markdown)</label>
        <textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={12} className="resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"><CheckCircle2 className="size-4" /> Saved! Redirecting…</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {pending && <BarLoader size="sm" />}
          {article ? "Save changes" : "Create draft"}
        </button>
        {article && article.status !== "published" && (
          <button type="button" onClick={handlePublish} disabled={pending} className="flex h-10 items-center gap-2 rounded-full border border-green-200 bg-green-50 px-6 text-sm font-medium text-green-700 hover:bg-green-100 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-300 dark:hover:bg-green-500/20 disabled:opacity-60">
            <Globe className="size-4" /> Publish
          </button>
        )}
        <button type="button" onClick={() => router.back()} className="h-10 rounded-full border border-border px-6 text-sm font-medium text-foreground hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  )
}
