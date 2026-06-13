"use server"

import { requireRole } from "@/lib/session"
import { createBook, updateBook, deleteBook } from "@/lib/books-admin"
import type { BookDoc } from "@/lib/books-admin"
import { revalidatePath } from "next/cache"

export async function createBookAction(data: Omit<BookDoc, "_id" | "createdAt" | "updatedAt">) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const book = await createBook(data)
  revalidatePath("/admin/books")
  revalidatePath("/library")
  return { book }
}

export async function updateBookAction(id: string, data: Partial<BookDoc>) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const ok = await updateBook(id, data)
  revalidatePath("/admin/books")
  revalidatePath("/library")
  return { ok }
}

export async function deleteBookAction(id: string) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const ok = await deleteBook(id)
  revalidatePath("/admin/books")
  return { ok }
}
