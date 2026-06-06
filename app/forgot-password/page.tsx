import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotForm } from "@/components/auth/forgot-form"

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false },
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a secure link to reset your password."
      footer={
        <span>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </span>
      }
    >
      <ForgotForm />
    </AuthShell>
  )
}
