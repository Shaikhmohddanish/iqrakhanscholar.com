import type { Metadata } from "next"
import { getAllUsers } from "@/lib/users"
import { AdminUsersClient } from "./admin-users-client"

export const metadata: Metadata = {
  title: "Users — Admin",
  robots: { index: false },
}

export default async function AdminUsersPage() {
  const { users, total } = await getAllUsers({ limit: 100 })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground">{total} registered user{total !== 1 ? "s" : ""}</p>
      </div>
      <AdminUsersClient users={users} />
    </div>
  )
}
