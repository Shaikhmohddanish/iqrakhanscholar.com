"use server"

import { requireUser } from "@/lib/session"
import { markRead, markAllRead, deleteNotification } from "@/lib/notifications"
import { revalidatePath } from "next/cache"

export async function markNotificationReadAction(id: string) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  await markRead(id, user.id)
  revalidatePath("/account/notifications")
  return { ok: true }
}

export async function markAllNotificationsReadAction() {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  await markAllRead(user.id)
  revalidatePath("/account/notifications")
  return { ok: true }
}

export async function deleteNotificationAction(id: string) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  await deleteNotification(id, user.id)
  revalidatePath("/account/notifications")
  return { ok: true }
}
