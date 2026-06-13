// Client-safe notification types (no DB/server-only imports)

export type NotificationType = "order" | "booking" | "library" | "system"

export interface PublicNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  link?: string
  createdAt: Date
}
