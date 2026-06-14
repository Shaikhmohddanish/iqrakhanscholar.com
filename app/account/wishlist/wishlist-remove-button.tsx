"use client"

import { useTransition } from "react"
import { removeFromWishlistAction } from "@/app/actions/wishlist"
import { Trash2 } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"

export function WishlistRemoveButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      aria-label="Remove from wishlist"
      disabled={pending}
      onClick={() => startTransition(() => removeFromWishlistAction(productId))}
      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
    >
      {pending ? <BarLoader size="md" /> : <Trash2 className="size-4" />}
    </button>
  )
}
