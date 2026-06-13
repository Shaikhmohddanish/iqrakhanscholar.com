import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import { getPurchasedProductIds } from "@/lib/orders"
import { getProductsByIds } from "@/lib/products"
import { getAllProgress } from "@/lib/reading-progress"
import { BookLibraryCard } from "@/components/account/book-library-card"
import { PageHeading } from "@/components/account/coming-soon"
import { BookMarked, BookOpen } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "My Library",
  robots: { index: false },
}

export default async function LibraryPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const [purchasedIds, allProgress] = await Promise.all([
    getPurchasedProductIds(user.id),
    getAllProgress(user.id),
  ])
  const products = await getProductsByIds(purchasedIds)

  // Progress docs are stored with the slug as bookId (it's the reader route param)
  const progressMap = Object.fromEntries(allProgress.map((p) => [p.bookId, p]))

  const inProgress = products.filter((p) => {
    const prog = progressMap[p.slug]
    return prog && prog.currentPage > 1 && prog.percentComplete < 100
  })

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="My Library"
        description="Your purchased digital books and resources, ready to read in the protected reader."
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
          <BookMarked className="size-10 text-muted-foreground/30" />
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">No books yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Purchase a digital book from the library to unlock it here with progress tracking.
            </p>
          </div>
          <Link href="/library" className="mt-2 flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <BookOpen className="size-4" />
            Explore the library
          </Link>
        </div>
      ) : (
        <>
          {/* Continue reading section */}
          {inProgress.length > 0 && (
            <section>
              <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Continue reading</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {inProgress.map((product) => (
                  <BookLibraryCard
                    key={product.id}
                    product={product}
                    progress={progressMap[product.slug] ?? null}
                    view="list"
                  />
                ))}
              </div>
            </section>
          )}

          {/* All books grid */}
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
              All books ({products.length})
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <BookLibraryCard
                  key={product.id}
                  product={product}
                  progress={progressMap[product.slug] ?? null}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
