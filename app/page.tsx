import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { FeaturedCategories } from '@/components/featured-categories'
import { ShippingStrip } from '@/components/shipping-strip'
import { AboutSection } from '@/components/about-section'
import { ProductShowcase } from '@/components/product-showcase'
import { ConsultationCta } from '@/components/consultation-cta'
import { VideoGallery } from '@/components/video-gallery'
import { TopicsSection } from '@/components/topics-section'
import { BlogHub } from '@/components/blog-hub'
import { EmailCapture } from '@/components/email-capture'
import { DailyReflection } from '@/components/daily-reflection'
import { FaqSection } from '@/components/faq-section'
import { SiteFooter } from '@/components/site-footer'
import { StructuredData } from '@/components/structured-data'
import { getProductsByType } from '@/lib/products'
import { getPublishedArticles, toBlogListItem } from '@/lib/blog'

export const revalidate = 3600

export default async function HomePage() {
  const [digital, physical, { articles }] = await Promise.all([
    getProductsByType('digital'),
    getProductsByType('physical'),
    getPublishedArticles({ page: 1, limit: 3 }),
  ])
  const blogPosts = articles.map(toBlogListItem)

  // Hero e-book. Points at the E-books listing rather than a product page: this
  // title isn't in the catalogue yet (no price or file), so there is nothing
  // purchasable to link to. Swap `href` to /store/<slug> once it is a product.
  const heroEbook = {
    title: 'The Halal Income Blueprint',
    image: '/ebook-halal-income-blueprint.webp',
    href: '/library',
  }

  return (
    <>
      <StructuredData />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <HeroSection videoSrc="/video/background.mp4" ebook={heroEbook} />
        <FeaturedCategories />
        <ShippingStrip />
        <AboutSection />
        <ProductShowcase
          id="digital"
          eyebrow="E-books"
          title="Featured digital products"
          description="Instantly downloadable ebooks, study guides, and resource packs to learn at your own pace."
          products={digital.slice(0, 3)}
          ctaLabel="Browse the full library"
          ctaHref="/library"
        />
        <ProductShowcase
          id="store"
          eyebrow="Abayas & More"
          title="Featured books & journals"
          description="Lovingly crafted books, journals, and planners to bring your practice into everyday life."
          products={physical.slice(0, 3)}
          ctaLabel="Visit the store"
          ctaHref="/store"
          variant="muted"
        />
        <ConsultationCta />
        <VideoGallery />
        <DailyReflection />
        {/* Testimonials are hidden until Iqra supplies real client quotes,
            names/photos and consent to publish them. The three that shipped
            with the template were placeholder copy with stock avatars.
            Re-enable by restoring <TestimonialsSection /> once real data is in
            `testimonials` in lib/site-data.ts. */}
        <TopicsSection />
        <BlogHub posts={blogPosts} />
        <EmailCapture />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  )
}
