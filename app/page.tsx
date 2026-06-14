import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { FeaturedCategories } from '@/components/featured-categories'
import { AboutSection } from '@/components/about-section'
import { ProductShowcase } from '@/components/product-showcase'
import { ConsultationCta } from '@/components/consultation-cta'
import { VideoGallery } from '@/components/video-gallery'
import { TestimonialsSection } from '@/components/testimonials-section'
import { BlogHub } from '@/components/blog-hub'
import { EmailCapture } from '@/components/email-capture'
import { DailyReflection } from '@/components/daily-reflection'
import { FaqSection } from '@/components/faq-section'
import { SiteFooter } from '@/components/site-footer'
import { StructuredData } from '@/components/structured-data'
import { getProductsByType } from '@/lib/products'

export default async function HomePage() {
  const [digital, physical] = await Promise.all([
    getProductsByType('digital'),
    getProductsByType('physical'),
  ])

  return (
    <>
      <StructuredData />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <HeroSection videoSrc="/video/background.mp4" />
        <FeaturedCategories />
        <AboutSection />
        <ProductShowcase
          id="digital"
          eyebrow="Digital Library"
          title="Featured digital products"
          description="Instantly downloadable ebooks, study guides, and resource packs to learn at your own pace."
          products={digital.slice(0, 3)}
          ctaLabel="Browse the full library"
          ctaHref="/library"
        />
        <ProductShowcase
          id="store"
          eyebrow="Physical Store"
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
        <TestimonialsSection />
        <BlogHub />
        <EmailCapture />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  )
}
