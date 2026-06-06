import Link from "next/link"
import { CartButton } from "@/components/cart/cart-button"

const links = [
  { label: "All", href: "/store" },
  { label: "Digital", href: "/store?type=digital" },
  { label: "Physical", href: "/store?type=physical" },
]

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-base font-bold text-primary-foreground">
            IK
          </span>
          <span className="font-heading text-lg font-semibold text-foreground">Iqra Khan</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Store categories">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/account"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline-flex"
          >
            Account
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
