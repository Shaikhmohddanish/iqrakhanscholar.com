import "server-only"
import { ObjectId, type Collection } from "mongodb"
import { getDb } from "./mongodb"
import type { UserDoc, AdminUserRow, Role } from "./types"

export interface AddressDoc {
  id: string
  label: string // "Home", "Work", etc.
  fullName: string
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  isDefault: boolean
}

let indexesEnsured = false

export async function usersCollection(): Promise<Collection<UserDoc>> {
  const db = await getDb()
  const col = db.collection<UserDoc>("users")
  if (!indexesEnsured) {
    // Unique, case-insensitive email index.
    await col.createIndex(
      { email: 1 },
      { unique: true, collation: { locale: "en", strength: 2 } },
    )
    indexesEnsured = true
  }
  return col
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const col = await usersCollection()
  return col.findOne({ email: normalizeEmail(email) })
}

export async function findUserById(id: string): Promise<UserDoc | null> {
  if (!ObjectId.isValid(id)) return null
  const col = await usersCollection()
  return col.findOne({ _id: new ObjectId(id) })
}

export interface GoogleProfile {
  googleId: string
  email: string
  name: string
  emailVerified: boolean
  image?: string
}

// Find a user by their Google identity, link Google to an existing account with
// the same email, or create a new password-less account. Returns the user doc.
export async function findOrCreateGoogleUser(
  profile: GoogleProfile,
): Promise<UserDoc & { _id: ObjectId }> {
  const col = await usersCollection()
  const email = normalizeEmail(profile.email)

  // 1. Already linked to this Google identity.
  const byGoogle = await col.findOne({ googleId: profile.googleId })
  if (byGoogle) return byGoogle as UserDoc & { _id: ObjectId }

  // 2. Existing account with the same email — link Google to it. Google has
  //    already verified the address, so it's safe to merge identities.
  const byEmail = await col.findOne({ email })
  if (byEmail) {
    const update: Partial<UserDoc> = { googleId: profile.googleId, updatedAt: new Date() }
    if (profile.emailVerified && !byEmail.emailVerified) update.emailVerified = true
    if (profile.image && !byEmail.image) update.image = profile.image
    await col.updateOne({ _id: byEmail._id }, { $set: update })
    return { ...byEmail, ...update } as UserDoc & { _id: ObjectId }
  }

  // 3. New Google-only account (no password).
  const now = new Date()
  const doc: UserDoc = {
    name: profile.name || email.split("@")[0],
    email,
    role: "customer",
    authProvider: "google",
    googleId: profile.googleId,
    emailVerified: profile.emailVerified,
    refreshTokens: [],
    createdAt: now,
    updatedAt: now,
  }
  if (profile.image) doc.image = profile.image
  const result = await col.insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function addRefreshToken(userId: string, hashedToken: string): Promise<void> {
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    {
      // keep at most the 10 most recent refresh tokens (devices)
      $push: { refreshTokens: { $each: [hashedToken], $slice: -10 } },
      $set: { updatedAt: new Date() },
    },
  )
}

export async function removeRefreshToken(userId: string, hashedToken: string): Promise<void> {
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { refreshTokens: hashedToken }, $set: { updatedAt: new Date() } },
  )
}

export async function hasRefreshToken(userId: string, hashedToken: string): Promise<boolean> {
  const col = await usersCollection()
  const user = await col.findOne(
    { _id: new ObjectId(userId), refreshTokens: hashedToken },
    { projection: { _id: 1 } },
  )
  return Boolean(user)
}

export async function rotateRefreshToken(
  userId: string,
  oldHashed: string,
  newHashed: string,
): Promise<void> {
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    {
      $pull: { refreshTokens: oldHashed },
      $set: { updatedAt: new Date() },
    },
  )
  await col.updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: { refreshTokens: { $each: [newHashed], $slice: -10 } },
    },
  )
}

export async function updateProfile(
  userId: string,
  data: { name?: string; email?: string },
): Promise<void> {
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
  )
}

export async function updateAddresses(userId: string, addresses: AddressDoc[]): Promise<void> {
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { addresses, updatedAt: new Date() } as Partial<UserDoc & { addresses: AddressDoc[] }> },
  )
}

export async function getAddresses(userId: string): Promise<AddressDoc[]> {
  const col = await usersCollection()
  const doc = await col.findOne(
    { _id: new ObjectId(userId) },
    { projection: { addresses: 1 } },
  )
  return (doc as unknown as { addresses?: AddressDoc[] })?.addresses ?? []
}

export async function deleteAccount(userId: string): Promise<void> {
  const col = await usersCollection()
  await col.deleteOne({ _id: new ObjectId(userId) })
}

export async function exportUserData(userId: string): Promise<Record<string, unknown> | null> {
  if (!ObjectId.isValid(userId)) return null
  const col = await usersCollection()
  const doc = await col.findOne({ _id: new ObjectId(userId) })
  if (!doc) return null
  // Strip sensitive fields before export
  const { passwordHash: _pw, refreshTokens: _rt, verificationToken: _vt, resetToken: _rs, ...safe } = doc
  return { ...safe, _id: userId }
}

function toAdminUserRow(doc: UserDoc & { _id: ObjectId }): AdminUserRow {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    emailVerified: doc.emailVerified,
    createdAt: doc.createdAt,
  }
}

// Admin: list all users
export async function getAllUsers(
  options: { page?: number; limit?: number } = {},
): Promise<{ users: AdminUserRow[]; total: number }> {
  const col = await usersCollection()
  const { page = 1, limit = 20 } = options
  const [docs, total] = await Promise.all([
    col
      .find({}, { projection: { passwordHash: 0, refreshTokens: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    col.countDocuments(),
  ])
  return { users: docs.map((d) => toAdminUserRow(d as UserDoc & { _id: ObjectId })), total }
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  if (!ObjectId.isValid(userId)) return
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: role as Role, updatedAt: new Date() } },
  )
}
