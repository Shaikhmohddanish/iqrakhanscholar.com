import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getBookAdminById } from "@/lib/books-admin"
import { BookForm } from "@/components/admin/book-form"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Edit Book - Admin",
  robots: { index: false },
}

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await getBookAdminById(id)
  if (!book) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/books" className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Books
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground">Edit book</h1>
        <p className="text-sm text-muted-foreground">{book.title}</p>
      </div>
      <BookForm book={book} />
    </div>
  )
}
