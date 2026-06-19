"use server"

import { requireUser } from "@/lib/session"
import { updateProfile, getAddresses, updateAddresses, deleteAccount, exportUserData, type AddressDoc } from "@/lib/users"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/tokens"
import { hashPassword, verifyPassword } from "@/lib/crypto"
import { findUserById } from "@/lib/users"
import { usersCollection } from "@/lib/users"
import { ObjectId } from "mongodb"

export async function updateProfileAction(data: { name: string; email: string }) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.name.trim()) return { error: "Name is required." }
  if (!data.email.trim()) return { error: "Email is required." }

  await updateProfile(user.id, { name: data.name.trim(), email: data.email.trim().toLowerCase() })
  revalidatePath("/account/settings")
  return { ok: true }
}

export async function saveAddressAction(address: AddressDoc) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  const current = await getAddresses(user.id)
  const idx = current.findIndex((a) => a.id === address.id)

  let updated: AddressDoc[]
  if (idx >= 0) {
    updated = current.map((a, i) => (i === idx ? address : a))
  } else {
    updated = [...current, { ...address, id: crypto.randomUUID() }]
  }

  // Ensure only one default
  if (address.isDefault) {
    updated = updated.map((a) => ({ ...a, isDefault: a.id === address.id }))
  }

  await updateAddresses(user.id, updated)
  revalidatePath("/account/settings")
  return { ok: true }
}

export async function deleteAddressAction(addressId: string) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  const current = await getAddresses(user.id)
  const updated = current.filter((a) => a.id !== addressId)
  await updateAddresses(user.id, updated)
  revalidatePath("/account/settings")
  return { ok: true }
}

export async function changePasswordAction(data: {
  currentPassword?: string
  newPassword: string
}) {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  const dbUser = await findUserById(user.id)
  if (!dbUser) return { error: "User not found." }

  // Accounts created via Google have no password yet. Such users are setting a
  // password for the first time (they're already authenticated via their
  // session), so we skip the current-password check rather than running
  // bcrypt.compare against a null hash.
  if (dbUser.passwordHash) {
    if (!data.currentPassword) return { error: "Current password is required." }
    const valid = await verifyPassword(data.currentPassword, dbUser.passwordHash)
    if (!valid) return { error: "Current password is incorrect." }
  }

  if (data.newPassword.length < 8) return { error: "Password must be at least 8 characters." }

  const newHash = await hashPassword(data.newPassword)
  const col = await usersCollection()
  await col.updateOne(
    { _id: new ObjectId(user.id) },
    { $set: { passwordHash: newHash, updatedAt: new Date() } },
  )

  return { ok: true }
}

export async function exportDataAction() {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  const data = await exportUserData(user.id)
  return { data }
}

export async function deleteAccountAction() {
  const user = await requireUser()
  if (!user) return { error: "Unauthorized" }

  await deleteAccount(user.id)

  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_COOKIE)
  cookieStore.delete(REFRESH_COOKIE)

  redirect("/")
}
