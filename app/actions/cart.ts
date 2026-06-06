"use server"

import { revalidatePath } from "next/cache"
import { readCart, writeCart, clearCartCookie, type Cart } from "@/lib/cart"
import { getProductsByIds } from "@/lib/products"

// Re-derives the whole cart against the DB so prices/titles are always
// authoritative and any deleted products are dropped.
async function reconcile(cart: Cart): Promise<Cart> {
  const ids = cart.items.map((i) => i.productId)
  const products = await getProductsByIds(ids)
  const byId = new Map(products.map((p) => [p.id, p]))
  const items = cart.items
    .map((item) => {
      const p = byId.get(item.productId)
      if (!p) return null
      let quantity = item.quantity
      // digital products are always quantity 1
      if (p.type === "digital") quantity = 1
      // clamp physical to available stock
      if (p.type === "physical" && p.stock != null) {
        quantity = Math.min(quantity, Math.max(0, p.stock))
      }
      if (quantity < 1) return null
      return {
        productId: p.id,
        slug: p.slug,
        title: p.title,
        image: p.image,
        price: p.price,
        type: p.type,
        quantity,
      }
    })
    .filter((i): i is NonNullable<typeof i> => i !== null)
  return { items }
}

export async function addToCartAction(productId: string, quantity = 1) {
  const cart = await readCart()
  const existing = cart.items.find((i) => i.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    // placeholder; reconcile fills authoritative data
    cart.items.push({
      productId,
      slug: "",
      title: "",
      image: "",
      price: 0,
      type: "physical",
      quantity,
    })
  }
  const reconciled = await reconcile(cart)
  await writeCart(reconciled)
  revalidatePath("/cart")
  return { ok: true, count: reconciled.items.reduce((s, i) => s + i.quantity, 0) }
}

export async function updateQuantityAction(productId: string, quantity: number) {
  const cart = await readCart()
  const item = cart.items.find((i) => i.productId === productId)
  if (item) item.quantity = Math.max(0, quantity)
  const reconciled = await reconcile({
    items: cart.items.filter((i) => i.quantity > 0),
  })
  await writeCart(reconciled)
  revalidatePath("/cart")
  return { ok: true }
}

export async function removeFromCartAction(productId: string) {
  const cart = await readCart()
  const reconciled = await reconcile({
    items: cart.items.filter((i) => i.productId !== productId),
  })
  await writeCart(reconciled)
  revalidatePath("/cart")
  return { ok: true }
}

export async function clearCartAction() {
  await clearCartCookie()
  revalidatePath("/cart")
  return { ok: true }
}
