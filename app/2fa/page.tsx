import type { Metadata } from "next"
import Link from "next/link"
import { TwoFactorSetup } from "./two-factor-setup"

export const metadata: Metadata = {
  title: "Two-Factor Authentication",
  robots: { index: false },
}

export default function TwoFAPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-primary">
          Iqra Khan
        </Link>
        <div className="mt-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Two-Factor Authentication
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add an extra layer of security to your account.
          </p>
        </div>
        <div className="mt-8">
          <TwoFactorSetup />
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/account/settings" className="font-medium text-primary hover:underline">
            ← Back to security settings
          </Link>
        </div>
      </div>
    </main>
  )
}
