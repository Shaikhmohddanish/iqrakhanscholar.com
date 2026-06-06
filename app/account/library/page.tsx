import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { BookMarked, BookOpen } from "lucide-react"
import { getCurrentUser } from "@/lib/session"
import { getPurchasedProductIds } from "@/lib/orders"
import { getProductsByIds } from "@/lib/products"
import { PageHeading, ComingSoon } from "@/components/account/coming-soon"

export const metadata: Metadata = {
  title: "My Library",
  robots: { index: false },
}

export default async function LibraryPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const purchasedIds = await getPurchasedProductIds(user.id)
  const products = await getProductsByIds(purchasedIds)

  return (
    <div>
      <PageHeading
        title="My Library"
        description="Your purchased digital books and resources, ready to read in the protected reader."
      />

      {products.length === 0 ? (
        <ComingSoon
          icon={<BookMarked className="size-6" />}
          message="You haven't added any books yet. Once you purchase a digital book, it will unlock here with progress tracking and bookmarks."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {product.category}
                  </p>
                  <h3 className="mt-1 font-heading text-base font-semibold leading-snug text-foreground text-balance">
                    {product.title}
                  </h3>
                </div>
                <Link
                  href={`/account/library/${product.slug}`}
                  className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <BookOpen className="size-4" />
                  Read now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
