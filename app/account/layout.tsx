import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { SmartHeader } from "@/components/smart-header"
import { AccountNav } from "@/components/account/account-nav"
import { countUnread } from "@/lib/notifications"

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login?next=/account")

  const unreadNotifications = await countUnread(user.id)

  return (
    <div className="min-h-dvh bg-background">
      <SmartHeader user={user} />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <AccountNav role={user.role} unreadNotifications={unreadNotifications} />
          </div>
        </aside>
        <main id="main-content" className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
