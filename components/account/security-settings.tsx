"use client"

import { useState, useTransition } from "react"
import { changePasswordAction } from "@/app/actions/account"
import { Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react"

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function getStrength(p: string): number {
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strength = getStrength(newPassword)
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength] ?? ""
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"][strength] ?? ""

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      return
    }
    startTransition(async () => {
      const result = await changePasswordAction({ currentPassword, newPassword })
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: "Password changed successfully." })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Change Password */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-semibold text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Change password
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-2">
            <label htmlFor="current-pw" className="text-sm font-medium text-foreground">Current password</label>
            <div className="relative">
              <input
                id="current-pw"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle visibility">
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="new-pw" className="text-sm font-medium text-foreground">New password</label>
            <div className="relative">
              <input
                id="new-pw"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle visibility">
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {newPassword && (
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-muted"}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-pw" className="text-sm font-medium text-foreground">Confirm new password</label>
            <input
              id="confirm-pw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={pending}
              className="flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {pending && <Loader2 className="size-3.5 animate-spin" />}
              Update password
            </button>
            {message && (
              <span className={`flex items-center gap-1.5 text-sm ${message.type === "success" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                {message.type === "success" && <CheckCircle2 className="size-3.5" />}
                {message.text}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
