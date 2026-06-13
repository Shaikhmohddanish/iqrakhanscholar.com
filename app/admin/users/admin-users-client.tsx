"use client"

import { useTransition } from "react"
import { updateUserRoleAction } from "@/app/actions/admin/users"
import type { Role } from "@/lib/types"
import { ROLES } from "@/lib/types"
import { Search } from "lucide-react"
import { useState } from "react"

type UserRow = {
  _id?: unknown
  name: string
  email: string
  role: Role
  emailVerified: boolean
  createdAt: Date
}

export function AdminUsersClient({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("")
  const [pending, startTransition] = useTransition()

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  function handleRoleChange(userId: string, role: string) {
    startTransition(() => updateUserRoleAction(userId, role))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">User</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Verified</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No users found.</td></tr>
            ) : (
              filtered.map((user) => {
                const id = String(user._id)
                return (
                  <tr key={id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(id, e.target.value)}
                        disabled={pending}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs capitalize focus:outline-none"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.emailVerified ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
