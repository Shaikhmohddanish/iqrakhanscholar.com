import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getAllBooksAdmin } from "@/lib/books-admin"
import { formatPrice } from "@/lib/product-types"
import { Plus, Pencil } from "lucide-react"

export const metadata: Metadata = {
  title: "Books — Admin",
  robots: { index: false },
}

export default async function AdminBooksPage() {
  const { books, total } = await getAllBooksAdmin()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Digital Books</h1>
          <p className="text-sm text-muted-foreground">{total} book{total !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/books/new" className="flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> Add book
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Book</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Status</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">PDF</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No books yet.</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-medium text-foreground line-clamp-1">{book.title}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{book.category}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(book.price, book.currency)}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${book.status === "published" ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {book.pdfPublicId || book.pdfPath ? <span className="text-green-600">Uploaded</span> : <span className="text-muted-foreground">Missing</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/books/${book.id}`} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
