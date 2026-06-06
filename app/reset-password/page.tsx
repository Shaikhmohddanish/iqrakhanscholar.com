import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { ResetForm } from "@/components/auth/reset-form"

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false },
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong new password for your account."
      footer={
        <span>
          Back to{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            sign in
          </Link>
        </span>
      }
    >
      <ResetForm token={token ?? ""} />
    </AuthShell>
  )
}
