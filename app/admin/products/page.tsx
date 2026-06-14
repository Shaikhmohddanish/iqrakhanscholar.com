import type { Metadata } from "next"
import { getAllProductsAdmin } from "@/lib/products-admin"
import { ProductTable } from "@/components/admin/product-table"

export const metadata: Metadata = {
  title: "Products - Admin",
  robots: { index: false },
}

export default async function AdminProductsPage() {
  const { products, total } = await getAllProductsAdmin()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Products</h1>
        <p className="text-sm text-muted-foreground">{total} product{total !== 1 ? "s" : ""} total</p>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
