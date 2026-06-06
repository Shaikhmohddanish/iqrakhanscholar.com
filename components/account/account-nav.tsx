"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookMarked,
  ShoppingBag,
  CalendarClock,
  Settings,
  ShieldCheck,
} from "lucide-react"
import type { Role } from "@/lib/types"
import { hasRole } from "@/lib/types"

const NAV = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/library", label: "My Library", icon: BookMarked },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/bookings", label: "Consultations", icon: CalendarClock },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export function AccountNav({ role }: { role: Role }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1" aria-label="Account navigation">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}

      {hasRole(role, "admin") ? (
        <Link
          href="/admin"
          className="mt-2 flex items-center gap-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <ShieldCheck className="size-4" />
          Admin Portal
        </Link>
      ) : null}
    </nav>
  )
}
