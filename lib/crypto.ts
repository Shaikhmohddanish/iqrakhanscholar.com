import bcrypt from "bcryptjs"
import { createHash, randomBytes } from "crypto"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate a random token and its SHA-256 hash. We email/return the raw token
// to the user but only store the hash in the database.
export function generateToken(): { raw: string; hashed: string } {
  const raw = randomBytes(32).toString("hex")
  return { raw, hashed: hashToken(raw) }
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex")
}
