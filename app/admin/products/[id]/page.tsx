import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductAdminById } from "@/lib/products-admin"
import { ProductForm } from "@/components/admin/product-form"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Edit Product — Admin",
  robots: { index: false },
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductAdminById(id)
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/products" className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Products
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">Edit product</h1>
        <p className="text-sm text-muted-foreground">{product.title}</p>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
