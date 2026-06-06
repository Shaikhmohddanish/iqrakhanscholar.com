"use client"

import { useActionState } from "react"
import { forgotPasswordAction, type AuthState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton, FieldError, FormSuccess } from "./form-bits"

const initial: AuthState = {}

export function ForgotForm() {
  const [state, action] = useActionState(forgotPasswordAction, initial)

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormSuccess message={state.ok ? state.message : undefined} devLink={state.devLink} />

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

      <SubmitButton>Send reset link</SubmitButton>
    </form>
  )
}
