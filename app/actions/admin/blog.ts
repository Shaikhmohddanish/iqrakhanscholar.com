"use server"

import { requireRole } from "@/lib/session"
import { createArticle, updateArticle, deleteArticle } from "@/lib/blog"
import type { ArticleDoc } from "@/lib/blog"
import { revalidatePath } from "next/cache"

export async function createArticleAction(data: Omit<ArticleDoc, "_id" | "createdAt" | "updatedAt">) {
  const user = await requireRole("editor")
  if (!user) return { error: "Unauthorized" }
  const article = await createArticle({ ...data, author: user.name, authorId: user.id })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return { article }
}

export async function updateArticleAction(id: string, data: Partial<ArticleDoc>) {
  const user = await requireRole("editor")
  if (!user) return { error: "Unauthorized" }
  const ok = await updateArticle(id, data)
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return { ok }
}

export async function deleteArticleAction(id: string) {
  const user = await requireRole("editor")
  if (!user) return { error: "Unauthorized" }
  const ok = await deleteArticle(id)
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return { ok }
}

export async function publishArticleAction(id: string) {
  const user = await requireRole("editor")
  if (!user) return { error: "Unauthorized" }
  const ok = await updateArticle(id, { status: "published", publishedAt: new Date() })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return { ok }
}
