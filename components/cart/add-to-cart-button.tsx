"use client"

import { useState } from "react"
import { Check, ShoppingBag } from "lucide-react"
import { BarLoader } from "@/components/ui/bar-loader"
import { cn } from "@/lib/utils"
import { useCart } from "./cart-provider"
import type { PublicProduct } from "@/lib/product-types"

interface Props {
  product: PublicProduct
  quantity?: number
  className?: string
  variant?: "pill" | "full"
  label?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  variant = "pill",
  label = "Add to Cart",
}: Props) {
  const { addItem, isPending } = useCart()
  const [added, setAdded] = useState(false)
  const soldOut = product.type === "physical" && product.stock != null && product.stock <= 0

  function handleClick() {
    if (soldOut) return
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-muted px-4 text-sm font-medium text-muted-foreground",
          variant === "full" ? "h-12 w-full" : "h-9",
          className,
        )}
      >
        Sold Out
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${product.title} to cart`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors",
        variant === "full"
          ? "h-12 w-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
          : "h-9 bg-secondary px-4 text-primary hover:bg-primary hover:text-primary-foreground",
        className,
      )}
    >
      {isPending && !added ? (
        <BarLoader size="md" />
      ) : added ? (
        <Check className="size-4" />
      ) : (
        variant === "full" && <ShoppingBag className="size-4" />
      )}
      {added ? "Added" : label}
    </button>
  )
}
