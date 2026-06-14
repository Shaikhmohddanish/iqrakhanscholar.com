"use client"

import { useState } from "react"
import Link from "next/link"
import { OtpInput } from "@/components/auth/otp-input"
import { QrCode, Copy, CheckCircle2, ShieldCheck } from "lucide-react"

const MOCK_BACKUP_CODES = [
  "A1B2-C3D4", "E5F6-G7H8", "I9J0-K1L2",
  "M3N4-O5P6", "Q7R8-S9T0", "U1V2-W3X4",
]

export function TwoFactorSetup() {
  const [step, setStep] = useState<"intro" | "qr" | "verify" | "backup" | "done">("intro")
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [copied, setCopied] = useState(false)

  const otpString = otp.join("")

  function copyCode() {
    navigator.clipboard.writeText(MOCK_BACKUP_CODES.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === "intro") {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
          <ShieldCheck className="mt-0.5 size-8 shrink-0 text-primary" />
          <div>
            <p className="font-heading text-base font-semibold text-foreground">Authenticator app</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use an app like Google Authenticator or Authy to generate time-based one-time passwords (TOTP).
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStep("qr")}
          className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Set up authenticator
        </button>
      </div>
    )
  }

  if (step === "qr") {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-heading text-base font-semibold text-foreground">Scan QR code</p>
          <p className="mt-1 text-sm text-muted-foreground">Open your authenticator app and scan this QR code.</p>

          {/* Mock QR placeholder */}
          <div className="mx-auto mt-5 flex size-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted">
            <QrCode className="size-16 text-muted-foreground/40" />
            <p className="mt-2 text-xs text-muted-foreground">QR placeholder</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground">Or enter this key manually:</p>
            <code className="mt-1 block rounded-lg bg-muted px-3 py-2 text-sm font-mono tracking-wider text-foreground">
              JBSWY3DPEHPK3PXP
            </code>
          </div>
        </div>
        <button type="button" onClick={() => setStep("verify")} className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
          I have scanned it - continue
        </button>
      </div>
    )
  }

  if (step === "verify") {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-heading text-base font-semibold text-foreground">Verify your authenticator</p>
          <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit code shown in your app to confirm setup.</p>
          <div className="mt-5 flex justify-center">
            <OtpInput value={otp} onChange={setOtp} />
          </div>
        </div>
        <button
          type="button"
          disabled={otpString.length < 6}
          onClick={() => setStep("backup")}
          className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          Verify code
        </button>
      </div>
    )
  }

  if (step === "backup") {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-heading text-base font-semibold text-foreground">Save backup codes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Store these codes somewhere safe. Each can be used once if you lose access to your authenticator.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {MOCK_BACKUP_CODES.map((code) => (
              <code key={code} className="rounded-lg bg-muted px-3 py-1.5 text-center text-sm font-mono text-foreground">
                {code}
              </code>
            ))}
          </div>
          <button type="button" onClick={copyCode} className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            {copied ? <CheckCircle2 className="size-4 text-green-500 dark:text-green-400" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy all codes"}
          </button>
        </div>
        <button type="button" onClick={() => setStep("done")} className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
          I have saved my backup codes
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/15">
        <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
      </div>
      <p className="font-heading text-xl font-semibold text-foreground">2FA enabled!</p>
      <p className="text-sm text-muted-foreground">Your account is now protected with two-factor authentication.</p>
      <Link href="/account/settings?tab=security" className="h-10 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 inline-flex items-center">
        Back to settings
      </Link>
    </div>
  )
}
