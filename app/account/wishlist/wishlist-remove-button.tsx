"use client"

import { useTransition } from "react"
import { removeFromWishlistAction } from "@/app/actions/wishlist"
import { Trash2, Loader2 } from "lucide-react"

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
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  )
}
