"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { cn } from "@/lib/utils"

export function CartButton({ className }: { className?: string }) {
  const { count } = useCart()
  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart, ${count} item${count === 1 ? "" : "s"}`}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-primary",
        className,
      )}
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-5 text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}
