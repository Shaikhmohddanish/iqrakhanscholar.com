import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { AccountNav } from "@/components/account/account-nav"
import { UserMenu } from "@/components/account/user-menu"

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()
  // Defense in depth: proxy already guards these routes.
  if (!user) redirect("/login?next=/account")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-primary">
            Iqra Khan
          </Link>
          <UserMenu user={user} />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <AccountNav role={user.role} />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
