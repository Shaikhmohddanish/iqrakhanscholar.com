import type { Metadata } from "next"
import Link from "next/link"
import { ArticleForm } from "@/components/admin/article-form"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "New Article — Admin",
  robots: { index: false },
}

export default function NewArticlePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/blog" className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Blog
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">New article</h1>
      </div>
      <ArticleForm />
    </div>
  )
}
