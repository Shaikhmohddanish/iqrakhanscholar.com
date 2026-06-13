import Link from "next/link"
import type { PublicUser } from "@/lib/types"
import { Bell, LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminHeaderProps {
  user: PublicUser
  title?: string
}

export function AdminHeader({ user, title }: AdminHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        {title && <h1 className="font-heading text-lg font-semibold text-foreground">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/account/notifications"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </header>
  )
}
