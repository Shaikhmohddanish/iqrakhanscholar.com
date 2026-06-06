"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registerAction, type AuthState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton, FieldError, FormError, FormSuccess } from "./form-bits"

const initial: AuthState = {}

export function RegisterForm() {
  const router = useRouter()
  const [state, action] = useActionState(registerAction, initial)

  useEffect(() => {
    if (state.ok && !state.devLink) {
      // In production (no dev link surfaced) send the user into the app.
      const t = setTimeout(() => {
        router.replace("/account")
        router.refresh()
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [state.ok, state.devLink, router])

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormError message={state.error} />
      <FormSuccess message={state.ok ? state.message : undefined} devLink={state.devLink} />

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Aisha Rahman"
          className="mt-2"
          required
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>

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
        <Label htmlFor="password">Password</Label>
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

      <SubmitButton>Create account</SubmitButton>

      {state.ok && state.devLink ? (
        <a
          href="/account"
          className="text-center text-sm font-medium text-primary hover:underline"
        >
          Continue to your account
        </a>
      ) : null}
    </form>
  )
}
