import type { ObjectId } from "mongodb"

// Role-based access control. Higher index = more privileges.
export const ROLES = ["customer", "editor", "admin"] as const
export type Role = (typeof ROLES)[number]

export const ROLE_RANK: Record<Role, number> = {
  customer: 0,
  editor: 1,
  admin: 2,
}

export function hasRole(userRole: Role, required: Role): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[required]
}

export interface UserDoc {
  _id?: ObjectId
  name: string
  email: string
  // bcrypt hash; never returned to the client
  passwordHash: string
  role: Role
  emailVerified: boolean
  // hashed token for email verification / password reset
  verificationToken?: string | null
  verificationExpires?: Date | null
  resetToken?: string | null
  resetExpires?: Date | null
  // hashed refresh tokens currently valid for this user (supports multiple devices)
  refreshTokens?: string[]
  createdAt: Date
  updatedAt: Date
}

// Shape safe to expose to the client / store in the access token.
export interface PublicUser {
  id: string
  name: string
  email: string
  role: Role
  emailVerified: boolean
}

export function toPublicUser(doc: UserDoc): PublicUser {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    emailVerified: doc.emailVerified,
  }
}
