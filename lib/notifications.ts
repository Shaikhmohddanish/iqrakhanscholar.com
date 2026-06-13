import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"
import type { NotificationType, PublicNotification } from "./notification-types"

export type { NotificationType, PublicNotification }

export interface NotificationDoc {
  _id?: ObjectId
  userId: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  link?: string
  createdAt: Date
}

function toPublic(doc: WithId<NotificationDoc>): PublicNotification {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

async function notifCol() {
  const db = await getDb()
  const col = db.collection<NotificationDoc>("notifications")
  await col.createIndex({ userId: 1, createdAt: -1 })
  return col
}

export async function listNotifications(
  userId: string,
  options: { limit?: number; type?: NotificationType } = {},
): Promise<PublicNotification[]> {
  const col = await notifCol()
  const { limit = 50, type } = options
  const filter: Record<string, unknown> = { userId }
  if (type) filter.type = type
  const docs = await col.find(filter).sort({ createdAt: -1 }).limit(limit).toArray()
  return docs.map(toPublic)
}

export async function countUnread(userId: string): Promise<number> {
  const col = await notifCol()
  return col.countDocuments({ userId, read: false })
}

export async function markRead(id: string, userId: string): Promise<void> {
  if (!ObjectId.isValid(id)) return
  const col = await notifCol()
  await col.updateOne({ _id: new ObjectId(id), userId }, { $set: { read: true } })
}

export async function markAllRead(userId: string): Promise<void> {
  const col = await notifCol()
  await col.updateMany({ userId, read: false }, { $set: { read: true } })
}

export async function createNotification(
  input: Omit<NotificationDoc, "_id" | "createdAt" | "read">,
): Promise<void> {
  const col = await notifCol()
  await col.insertOne({ ...input, read: false, createdAt: new Date() })
}

export async function deleteNotification(id: string, userId: string): Promise<void> {
  if (!ObjectId.isValid(id)) return
  const col = await notifCol()
  await col.deleteOne({ _id: new ObjectId(id), userId })
}
