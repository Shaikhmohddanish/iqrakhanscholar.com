"use client"

import { useState, useTransition } from "react"
import { MailWarning, CircleCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { resendVerificationAction } from "@/app/actions/auth"

// Shown to signed-in users whose email isn't verified yet. Lets them re-send
// the verification link. Used on the account overview and checkout.
export function VerifyEmailBanner({ email }: { email: string }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function resend() {
    setMessage(null)
    setError(null)
    startTransition(async () => {
      const res = await resendVerificationAction()
      if (res.ok) setMessage(res.message ?? "Verification email sent.")
      else setError(res.error ?? "Could not send the email. Please try again.")
    })
  }

  return (
    <Alert className="border-accent/40 bg-accent/10">
      <MailWarning className="size-4" />
      <AlertTitle>Verify your email address</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-2">
        <span>
          We sent a verification link to {email}. Please confirm it to make purchases and open your library.
        </span>
        {message ? (
          <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400">
            <CircleCheck className="size-3.5" /> {message}
          </span>
        ) : null}
        {error ? <span className="text-destructive">{error}</span> : null}
        <button
          type="button"
          onClick={resend}
          disabled={pending}
          className="text-sm font-medium text-primary hover:underline disabled:opacity-60"
        >
          {pending ? "Sending…" : "Resend verification email"}
        </button>
      </AlertDescription>
    </Alert>
  )
}
