import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Check, Shield, Truck, Download, RotateCcw } from 'lucide-react'
import { getProductBySlug, getAllProducts } from '@/lib/products'
import { formatPrice } from '@/lib/product-types'
import { getCurrentUser } from '@/lib/session'
import { getWishlist } from '@/lib/wishlist'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductGallery } from '@/components/store/product-gallery'
import { ProductBuyPanel } from '@/components/store/product-buy-panel'
import { ProductTabs } from '@/components/store/product-tabs'
import { ReviewSection } from '@/components/store/review-section'
import { RelatedProducts } from '@/components/store/related-products'
import { WishlistButton } from '@/components/store/wishlist-button'
import { StickyPurchaseBar } from '@/components/store/mobile-purchase-footer'
import { RecentlyViewed } from '@/components/store/recently-viewed'
import { ProductViewTracker } from '@/components/store/product-view-tracker'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/store/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const [product, user] = await Promise.all([getProductBySlug(slug), getCurrentUser()])
  if (!product) notFound()

  const [all, wishlistIds] = await Promise.all([
    getAllProducts(),
    user ? getWishlist(user.id) : Promise.resolve([] as string[]),
  ])
  const related = all.filter((p) => p.id !== product.id && p.type === product.type).slice(0, 3)
  const initialWishlisted = wishlistIds.includes(product.id)

  const isDigital = product.type === 'digital'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    description: product.shortDescription,
    category: product.category,
    brand: { '@type': 'Brand', name: 'Iqra Khan' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: product.currency,
      availability:
        isDigital || (product.stock ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  const tabs = [
    {
      id: 'description',
      label: 'Description',
      content: (
        <div className="prose max-w-none">
          <p>{product.description}</p>
          <h3>What&apos;s Included</h3>
          <ul>
            {product.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'reviews',
      label: `Reviews (${product.reviews})`,
      content: <ReviewSection rating={product.rating} reviewCount={product.reviews} />,
    },
    {
      id: 'shipping',
      label: isDigital ? 'Delivery' : 'Shipping',
      content: (
        <div className="space-y-4">
          {isDigital ? (
            <>
              <div className="flex items-start gap-3">
                <Download className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Instant Digital Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Your purchase will be available immediately in your account library and via email.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Lifetime Access</p>
                  <p className="text-sm text-muted-foreground">
                    Once purchased, you have lifetime access including all future updates.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Worldwide Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    We ship to over 50 countries. Standard delivery takes 5–10 business days.
                    Express options available at checkout.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">14-Day Returns</p>
                  <p className="text-sm text-muted-foreground">
                    Not satisfied? Return unused items within 14 days for a full refund.
                    See our <Link href="/refund-policy" className="text-primary hover:underline">refund policy</Link>.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductViewTracker product={product} />

      <Breadcrumb
        items={[
          { label: 'Store', href: '/store' },
          { label: product.title },
        ]}
      />

      {/* Product main grid */}
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Left — Gallery */}
        <ProductGallery
          images={product.images.length > 0 ? product.images : [product.image]}
          title={product.title}
        />

        {/* Right — Product info */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {product.category}
              </p>
              <h1 className="mt-2 text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                {product.title}
              </h1>
            </div>
            <WishlistButton productId={product.id} initialWishlisted={initialWishlisted} />
          </div>

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

          {/* Description */}
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Highlights */}
          <ul className="mt-6 space-y-2.5">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {/* Buy panel */}
          <div className="mt-8">
            <ProductBuyPanel product={product} />
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
              <Shield className="size-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
              {isDigital ? (
                <Download className="size-4 text-primary" />
              ) : (
                <Truck className="size-4 text-primary" />
              )}
              <span className="text-xs font-medium text-foreground">
                {isDigital ? 'Instant Access' : 'Free Shipping'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
              <RotateCcw className="size-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                {isDigital ? 'Lifetime Updates' : '14-Day Returns'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <ProductTabs tabs={tabs} />
      </div>

      {/* Related products */}
      <RelatedProducts products={related} />

      {/* Recently viewed */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Mobile sticky bar */}
      <StickyPurchaseBar product={product} />
    </article>
  )
}
