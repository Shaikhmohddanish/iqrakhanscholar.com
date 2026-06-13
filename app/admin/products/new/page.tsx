import type { Metadata } from "next"
import Link from "next/link"
import { ProductForm } from "@/components/admin/product-form"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "New Product — Admin",
  robots: { index: false },
}

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/products" className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Products
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">New product</h1>
      </div>
      <ProductForm />
    </div>
  )
}
