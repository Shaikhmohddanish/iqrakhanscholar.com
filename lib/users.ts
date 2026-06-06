import { ObjectId, type Collection } from "mongodb"
import { getDb } from "./mongodb"
import type { UserDoc } from "./types"

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
