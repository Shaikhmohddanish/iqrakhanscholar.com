"use client"

import { useActionState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { loginAction, type AuthState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton, FieldError, FormError } from "./form-bits"

const initial: AuthState = {}

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/account"
  const [state, action] = useActionState(loginAction, initial)

  useEffect(() => {
    if (state.ok) {
      router.replace(next)
      router.refresh()
    }
  }, [state.ok, next, router])

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormError message={state.error} />

      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-2"
          required
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="mt-2"
          required
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>

      <SubmitButton>Sign in</SubmitButton>
    </form>
  )
}
