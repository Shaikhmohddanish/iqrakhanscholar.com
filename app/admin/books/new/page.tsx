import type { Metadata } from "next"
import Link from "next/link"
import { BookForm } from "@/components/admin/book-form"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "New Book — Admin",
  robots: { index: false },
}

export default function NewBookPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/books" className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Books
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">New book</h1>
      </div>
      <BookForm />
    </div>
  )
}
