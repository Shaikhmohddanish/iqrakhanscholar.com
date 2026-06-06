import type { Metadata } from "next"
import Link from "next/link"
import { CircleCheck, CircleAlert } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { verifyEmailAction } from "@/app/actions/auth"

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false },
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const result = await verifyEmailAction(token ?? "")

  return (
    <AuthShell
      title={result.ok ? "Email verified" : "Verification failed"}
      subtitle={
        result.ok
          ? "Thank you for confirming your email address."
          : "We couldn't verify your email with this link."
      }
      footer={
        <span>
          Continue to{" "}
          <Link href="/account" className="font-medium text-primary hover:underline">
            your account
          </Link>
        </span>
      }
    >
      <div className="flex flex-col items-start gap-4">
        <span
          className={
            "inline-flex size-12 items-center justify-center rounded-full " +
            (result.ok ? "bg-secondary text-primary" : "bg-destructive/10 text-destructive")
          }
        >
          {result.ok ? <CircleCheck className="size-6" /> : <CircleAlert className="size-6" />}
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {result.ok ? result.message : result.error}
        </p>
        {!result.ok ? (
          <Link
            href="/account"
            className="text-sm font-medium text-primary hover:underline"
          >
            Request a new verification link from your account settings
          </Link>
        ) : null}
      </div>
    </AuthShell>
  )
}
