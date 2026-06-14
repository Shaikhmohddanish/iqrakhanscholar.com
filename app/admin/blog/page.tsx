import type { Metadata } from "next"
import Link from "next/link"
import { getAllArticles, seedArticles } from "@/lib/blog"
import { Plus, Pencil, Eye } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog - Admin",
  robots: { index: false },
}

export default async function AdminBlogPage() {
  await seedArticles()
  const { articles, total } = await getAllArticles()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">{total} article{total !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/blog/new" className="flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> New article
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No articles yet.</td></tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground line-clamp-1">{article.title}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{article.category}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${article.status === "published" ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/blog/${article.id}`} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="size-4" />
                      </Link>
                      {article.status === "published" && (
                        <Link href={`/blog/${article.slug}`} target="_blank" className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                          <Eye className="size-4" />
                        </Link>
                      )}
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
