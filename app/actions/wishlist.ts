"use server"

import { requireUser } from "@/lib/session"
import { toggleWishlist, removeFromWishlist } from "@/lib/wishlist"
import { revalidatePath } from "next/cache"

export async function toggleWishlistAction(productId: string) {
  const user = await requireUser()
  if (!user) return { error: "Please sign in to manage your wishlist." }

  const result = await toggleWishlist(user.id, productId)
  revalidatePath("/account/wishlist")
  return result
}

export async function removeFromWishlistAction(productId: string) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  await removeFromWishlist(user.id, productId)
  revalidatePath("/account/wishlist")
  return { ok: true }
}
