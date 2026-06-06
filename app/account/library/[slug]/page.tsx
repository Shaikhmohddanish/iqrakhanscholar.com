import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react"
import { getCurrentUser } from "@/lib/session"
import { getPurchasedProductIds } from "@/lib/orders"
import { getProductBySlug } from "@/lib/products"

export const metadata: Metadata = {
  title: "Reader",
  robots: { index: false },
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=/account/library/${slug}`)

  const product = await getProductBySlug(slug)
  if (!product || product.type !== "digital") notFound()

  // Entitlement check — never render the reader unless the user paid for it.
  const purchasedIds = await getPurchasedProductIds(user.id)
  const owns = purchasedIds.includes(product.id)

  if (!owns) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Lock className="size-6" />
        </span>
        <h1 className="font-heading text-2xl font-semibold text-foreground">This book is locked</h1>
        <p className="text-sm text-muted-foreground">
          You don&apos;t own &ldquo;{product.title}&rdquo; yet. Purchase it from the store to unlock the reader.
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View in store
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/account/library"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to library
      </Link>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="relative mx-auto aspect-[3/4] w-48 overflow-hidden rounded-xl border border-border bg-muted lg:mx-0 lg:w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="260px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance">
              {product.title}
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">What&apos;s inside</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              The in-browser reader for this title is being prepared. Your access is confirmed and
              your purchase is saved to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
