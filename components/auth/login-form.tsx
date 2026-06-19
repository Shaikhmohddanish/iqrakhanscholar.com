"use client"

import { useActionState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { loginAction, type AuthState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton, FieldError, FormError } from "./form-bits"
import { SocialLoginButtons } from "./social-login-buttons"

const initial: AuthState = {}

function googleErrorMessage(code: string): string {
  switch (code) {
    case "google_denied":
      return "Google sign-in was cancelled."
    case "google_unavailable":
      return "Google sign-in isn't available right now. Please use email instead."
    default:
      return "Google sign-in failed. Please try again or sign in with email."
  }
}

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/account"
  const oauthError = params.get("error")
  const [state, action] = useActionState(loginAction, initial)

  useEffect(() => {
    if (state.ok) {
      router.replace(next)
      router.refresh()
    }
  }, [state.ok, next, router])

  return (
    <div className="flex flex-col gap-5">
      {oauthError ? <FormError message={googleErrorMessage(oauthError)} /> : null}

      <SocialLoginButtons action="Sign in" next={next} />

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-5" noValidate>
        <FormError message={state.error} />

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="mt-2" required />
          <FieldError message={state.fieldErrors?.email} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" className="mt-2" required />
          <FieldError message={state.fieldErrors?.password} />
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <input type="checkbox" name="rememberMe" className="rounded border-border" />
          Keep me signed in for 30 days
        </label>

        <SubmitButton loading={state.ok} pendingLabel="Signing in…">Sign in</SubmitButton>
      </form>
    </div>
  )
}
