import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Star,
  BookOpen,
  FileText,
  Eye,
  ShoppingBag,
  ArrowLeft,
  Clock,
  Users,
  Award,
  Lock,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BookTocPreview } from '@/components/library/book-toc-preview'
import { BookCard } from '@/components/library/book-card'
import { BookSection } from '@/components/library/book-section'
import { ReviewSection } from '@/components/store/review-section'
import { getProductBySlug, queryProducts } from '@/lib/products'
import { getCurrentUser } from '@/lib/session'
import { getPurchasedProductIds } from '@/lib/orders'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || product.type !== 'digital') return { title: 'Book not found' }
  return {
    title: `${product.title} - Digital Library`,
    description: product.description,
    alternates: { canonical: `/library/${product.slug}` },
  }
}

export default async function BookDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || product.type !== 'digital') notFound()

  // Fetch related digital books
  const allDigital = await queryProducts({ page: 1, limit: 20, type: 'digital' })
  const related = allDigital.items
    .filter((b) => b.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4)

  // Check ownership
  const user = await getCurrentUser()
  let owns = false
  if (user) {
    const purchasedIds = await getPurchasedProductIds(user.id)
    owns = purchasedIds.includes(product.id)
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency,
    minimumFractionDigits: product.price % 100 === 0 ? 0 : 2,
  }).format(product.price / 100)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: product.title,
    author: { '@type': 'Person', name: product.author ?? '' },
    image: product.image,
    description: product.description,
    numberOfPages: product.pageCount,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <Breadcrumb
            items={[
              { label: 'Library', href: '/library' },
              { label: product.title },
            ]}
          />

          <Link
            href="/library"
            className="mt-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 size-4" />
            Back to Library
          </Link>

          {/* Hero */}
          <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Cover */}
            <div className="mx-auto w-56 lg:mx-0 lg:w-full">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-[var(--shadow-lg)]">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  {product.category}
                </span>
                {owns && (
                  <span className="rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                    Owned
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {product.title}
              </h1>
              {product.author && (
                <p className="mt-2 text-muted-foreground">by {product.author}</p>
              )}

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating}.0 · {product.reviews} reviews
                </span>
              </div>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-4">
                {product.pageCount && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FileText className="size-4" />
                    {product.pageCount} pages
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  {product.reviews}+ readers
                </div>
                {product.pageCount && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    ~{Math.ceil(product.pageCount / 30)} hour read
                  </div>
                )}
              </div>

              <p className="mt-5 leading-relaxed text-foreground">{product.description}</p>

              {/* Price + CTA */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {!owns && (
                  <span className="font-heading text-3xl font-bold text-foreground">
                    {formattedPrice}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {owns ? (
                  <Link
                    href={`/reader/${product.slug}`}
                    className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <BookOpen className="size-4" />
                    Read Now
                  </Link>
                ) : (
                  <>
                    {!user && (
                      <Link
                        href={`/login?next=/library/${product.slug}`}
                        className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Lock className="size-4" />
                        Sign in to Purchase
                      </Link>
                    )}
                    {user && (
                      <AddToCartButton product={product} label="Purchase & Read" variant="full" className="h-12 rounded-lg px-6" />
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
                  <BookOpen className="size-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">In-Browser Reader</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
                  <Award className="size-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
                  <Clock className="size-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Read Anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of contents */}
          <div className="mt-12">
            <BookTocPreview />
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Reader Reviews</h2>
            <ReviewSection rating={product.rating} reviewCount={product.reviews} />
          </div>

          {/* Related books */}
          {related.length > 0 && (
            <div className="mt-16">
              <BookSection title="You May Also Like">
                {related.map((b) => (
                  <BookCard
                    key={b.id}
                    id={b.id}
                    slug={b.slug}
                    title={b.title}
                    author={b.author ?? ''}
                    coverImage={b.image}
                    rating={b.rating}
                    reviews={b.reviews}
                    price={b.price}
                    currency={b.currency}
                    category={b.category}
                    className="w-44 shrink-0 sm:w-48"
                  />
                ))}
              </BookSection>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
