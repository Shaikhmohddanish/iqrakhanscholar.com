"use client"

import { useState } from "react"
import Link from "next/link"
import { OtpInput } from "@/components/auth/otp-input"
import { CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react"

type Step = "email" | "verify" | "reset" | "done"

export default function AccountRecoveryPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  async function simulate(next: Step) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setStep(next)
  }

  const STEPS = [
    { id: "email", label: "Email" },
    { id: "verify", label: "Verify" },
    { id: "reset", label: "New password" },
    { id: "done", label: "Done" },
  ]

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-primary">
          Iqra Khan
        </Link>

        <div className="mt-8">
          <h1 className="font-heading text-3xl font-semibold text-foreground">Account recovery</h1>
          <p className="mt-2 text-sm text-muted-foreground">Regain access to your account in three steps.</p>
        </div>

        {/* Step indicator */}
        <div className="mt-6 flex items-center gap-2">
          {STEPS.slice(0, 3).map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < stepIndex ? "✓" : i + 1}
              </div>
              {i < 2 && <div className={`h-px w-8 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="mt-8">
          {step === "email" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <Mail className="size-5 text-primary" />
                <p className="text-sm text-muted-foreground">Enter your account email to receive a verification code.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="recovery-email" className="text-sm font-medium text-foreground">Email address</label>
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={() => simulate("verify")}
                disabled={loading || !email.includes("@")}
                className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send verification code"}
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <ShieldCheck className="size-5 text-primary" />
                <p className="text-sm text-muted-foreground">Enter the 6-digit code we sent to {email}.</p>
              </div>
              <div className="flex justify-center">
                <OtpInput value={otp} onChange={setOtp} />
              </div>
              <button
                type="button"
                onClick={() => simulate("reset")}
                disabled={loading || otp.join("").length < 6}
                className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify code"}
              </button>
              <button type="button" onClick={() => simulate("verify")} className="text-sm text-primary hover:underline">
                Resend code
              </button>
            </div>
          )}

          {step === "reset" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <KeyRound className="size-5 text-primary" />
                <p className="text-sm text-muted-foreground">Choose a strong new password for your account.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="new-pw" className="text-sm font-medium text-foreground">New password</label>
                <input
                  id="new-pw"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="confirm-pw" className="text-sm font-medium text-foreground">Confirm password</label>
                <input
                  id="confirm-pw"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              {newPassword && confirm && newPassword !== confirm && (
                <p className="text-sm text-destructive">Passwords do not match.</p>
              )}
              <button
                type="button"
                onClick={() => simulate("done")}
                disabled={loading || newPassword.length < 8 || newPassword !== confirm}
                className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {loading ? "Saving…" : "Reset password"}
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/15">
                <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-heading text-xl font-semibold text-foreground">Password reset!</p>
              <p className="text-sm text-muted-foreground">Your password has been reset. You can now sign in with your new password.</p>
              <Link href="/login" className="h-10 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 inline-flex items-center">
                Sign in
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    </main>
  )
}
