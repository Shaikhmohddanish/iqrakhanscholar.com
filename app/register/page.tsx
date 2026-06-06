import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create your account",
  description: "Join the Iqra Khan community to access digital books, courses, resources, and consultations.",
  robots: { index: false },
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Begin your journey with authentic knowledge, curated resources, and personal mentorship."
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthShell>
  )
}
