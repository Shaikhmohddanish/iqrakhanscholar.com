"use server"

import { requireRole } from "@/lib/session"
import { createProduct, updateProduct, deleteProduct } from "@/lib/products-admin"
import type { ProductDoc } from "@/lib/products"
import { revalidatePath } from "next/cache"

export async function createProductAction(data: Omit<ProductDoc, "_id" | "createdAt" | "updatedAt">) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const product = await createProduct(data)
  revalidatePath("/admin/products")
  revalidatePath("/store")
  return { product }
}

export async function updateProductAction(id: string, data: Partial<ProductDoc>) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const ok = await updateProduct(id, data)
  revalidatePath("/admin/products")
  revalidatePath("/store")
  return { ok }
}

export async function deleteProductAction(id: string) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  const ok = await deleteProduct(id)
  revalidatePath("/admin/products")
  revalidatePath("/store")
  return { ok }
}
