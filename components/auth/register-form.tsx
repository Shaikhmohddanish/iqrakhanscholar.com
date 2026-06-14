"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerAction, type AuthState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton, FieldError, FormError, FormSuccess } from "./form-bits"
import { SocialLoginButtons } from "./social-login-buttons"
import { PasswordStrength } from "./password-strength"

const initial: AuthState = {}

export function RegisterForm() {
  const router = useRouter()
  const [state, action] = useActionState(registerAction, initial)
  const [password, setPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)

  useEffect(() => {
    if (state.ok && !state.devLink) {
      const t = setTimeout(() => {
        router.replace("/account")
        router.refresh()
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [state.ok, state.devLink, router])

  return (
    <div className="flex flex-col gap-5">
      <SocialLoginButtons action="Sign up" />

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-5" noValidate>
        <FormError message={state.error} />
        <FormSuccess message={state.ok ? state.message : undefined} devLink={state.devLink} />

        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Aisha Rahman" className="mt-2" required />
          <FieldError message={state.fieldErrors?.name} />
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="mt-2" required />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength password={password} />
          <FieldError message={state.fieldErrors?.password} />
        </div>

        {/* Consent checkboxes */}
        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
              className="mt-0.5 rounded border-border"
            />
            <span className="text-muted-foreground">
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              className="mt-0.5 rounded border-border"
            />
            <span className="text-muted-foreground">
              I consent to receive occasional emails about new books, consultations, and resources. You can unsubscribe at any time.
            </span>
          </label>
        </div>

        <SubmitButton disabled={!termsAccepted} loading={state.ok && !state.devLink} pendingLabel="Creating account…">
          Create account
        </SubmitButton>

        {state.ok && state.devLink ? (
          <Link href="/account" className="text-center text-sm font-medium text-primary hover:underline">
            Continue to your account
          </Link>
        ) : null}
      </form>
    </div>
  )
}
