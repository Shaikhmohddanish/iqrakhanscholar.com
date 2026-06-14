import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getArticleById } from "@/lib/blog"
import { ArticleForm } from "@/components/admin/article-form"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Edit Article - Admin",
  robots: { index: false },
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getArticleById(id)
  if (!article) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/blog" className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Blog
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">Edit article</h1>
        <p className="text-sm text-muted-foreground">{article.title}</p>
      </div>
      <ArticleForm article={article} />
    </div>
  )
}
