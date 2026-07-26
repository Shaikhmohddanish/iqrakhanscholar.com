import type { ReactNode } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireRole } from "@/lib/session"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

// Private admin area - never index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole("admin")
  if (!user) redirect("/account?denied=1")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main id="admin-main" className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
