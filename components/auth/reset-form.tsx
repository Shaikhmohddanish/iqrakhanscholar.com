"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { resetPasswordAction, type AuthState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton, FieldError, FormError, FormSuccess } from "./form-bits"

const initial: AuthState = {}

export function ResetForm({ token }: { token: string }) {
  const router = useRouter()
  const [state, action] = useActionState(resetPasswordAction, initial)

  useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => router.replace("/login"), 1800)
      return () => clearTimeout(t)
    }
  }, [state.ok, router])

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <FormError message="This reset link is missing its token. Please request a new one." />
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Request a new reset link
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormError message={state.error} />
      <FormSuccess message={state.ok ? state.message : undefined} />

      <div>
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="mt-2"
          required
        />
        <FieldError message={state.fieldErrors?.password} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Use 8+ characters with uppercase, lowercase, and a number.
        </p>
      </div>

      <SubmitButton>Reset password</SubmitButton>
    </form>
  )
}
