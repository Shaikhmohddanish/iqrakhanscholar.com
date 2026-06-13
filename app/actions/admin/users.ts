"use server"

import { requireRole } from "@/lib/session"
import { updateUserRole } from "@/lib/users"
import { revalidatePath } from "next/cache"

export async function updateUserRoleAction(userId: string, role: string) {
  const user = await requireRole("admin")
  if (!user) return { error: "Unauthorized" }
  if (userId === user.id) return { error: "You cannot change your own role." }
  await updateUserRole(userId, role)
  revalidatePath("/admin/users")
  return { ok: true }
}
