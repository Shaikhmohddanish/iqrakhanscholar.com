"use client"

import { useState, useTransition } from "react"
import type { PublicUser } from "@/lib/types"
import { updateProfileAction } from "@/app/actions/account"
import { CheckCircle2 } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"

export function ProfileForm({ user }: { user: PublicUser }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    startTransition(async () => {
      const result = await updateProfileAction({ name, email })
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: "Profile updated successfully." })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="profile-name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="profile-email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {pending && <BarLoader size="sm" />}
          Save changes
        </button>
        {message && (
          <span className={`flex items-center gap-1.5 text-sm ${message.type === "success" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
            {message.type === "success" && <CheckCircle2 className="size-3.5" />}
            {message.text}
          </span>
        )}
      </div>
    </form>
  )
}
