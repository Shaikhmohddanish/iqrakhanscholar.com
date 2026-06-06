# Complete SaaS Application — Production UI Implementation

Build every production-ready screen for **Iqra Khan** — an Islamic brand SaaS combining ecommerce, digital library, PDF book reader, booking system, and admin panel.

## Existing Stack (No Changes)

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Language | TypeScript, React 19 |
| Fonts | Inter (body), Playfair Display (headings), Geist Mono |
| Database | MongoDB |
| Auth | Custom JWT (jose + bcrypt), same system for admin (role-based) |
| Icons | Lucide React |
| Payment | Razorpay (mocked for now) |
| Books | PDF files, rendered in-browser, no download/export |

---

## Resolved Questions

| # | Question | Answer |
|---|----------|--------|
| 1 | Admin auth | Same auth system with role-based guards |
| 2 | Book format | **PDF files** — rendered in-browser after login + purchase. No download, no export |
| 3 | Payment | **Razorpay** — mocked for now, full UI ready |
| 4 | Booking calendar | **Real availability from DB** — schema + UI for live slots |

---

## Critical UX Fixes Identified

> [!IMPORTANT]
> ### Fix 1: Unified Smart Header
> **Problem:** The `SiteHeader` always shows "Sign In" even when the user is logged in. Users lose all website navigation when entering the account panel.
>
> **Solution:** Create a single **unified header** (`SmartHeader`) used across the entire site:
> - **Logged out:** Shows nav links + "Sign In" + "Book a Session"
> - **Logged in:** Shows nav links + Cart button + User avatar dropdown (with links to Account, My Books, Orders, Settings, Admin if admin, Sign Out)
> - Used on **all pages** including public, store, account, library
> - Account panel keeps sidebar nav BUT the top header retains full website navigation
> - Mobile: hamburger includes both site nav AND account links when logged in

> [!IMPORTANT]
> ### Fix 2: Navigation Continuity
> **Problem:** Account layout has its own minimal header (`Iqra Khan` + UserMenu) with no website navigation. Users feel trapped.
>
> **Solution:** Account layout will use the same `SmartHeader` with full nav. The sidebar remains for account-specific navigation. Users can always navigate back to any part of the website from the header.

> [!WARNING]
> ### Fix 3: Footer Navigation
> **Problem:** Footer links use `#` anchors — they don't work when navigating from other pages.
>
> **Solution:** Update all footer links to use proper route paths (`/about`, `/library`, `/store`, `/blog`, `/consultation`, `/contact`, `/privacy`, `/refund-policy`, `/terms`).

---

## Web Standards & Compliance

> [!IMPORTANT]
> Every page will comply with the following international standards:

### WCAG 2.1 AA Accessibility
- All interactive elements have focus-visible outlines
- Color contrast ratios ≥ 4.5:1 (text) and ≥ 3:1 (large text)
- All images have meaningful `alt` text
- Form inputs have associated `<label>` elements
- ARIA landmarks (`<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`)
- Keyboard navigation for all interactive elements
- Skip-to-content link
- Screen reader announcements for dynamic content (toasts, modals)
- Reduced motion support via `prefers-reduced-motion`

### GDPR / EU ePrivacy Compliance
- **Cookie consent banner** — shown on first visit, blocks non-essential cookies until consent
- **Privacy policy** page with full GDPR Article 13/14 disclosures
- **Data controller** contact information
- **Right to erasure** — account deletion option in settings
- **Data export** — download personal data option
- **Cookie policy** — separate or within privacy policy
- **Consent logging** — store consent timestamp and choices

### SEO Standards
- Unique `<title>` and `<meta description>` per page
- Single `<h1>` per page with proper heading hierarchy
- Semantic HTML5 elements (`<article>`, `<section>`, `<aside>`, `<nav>`)
- Open Graph and Twitter Card meta tags
- JSON-LD structured data (Organization, Product, Book, Article, BreadcrumbList, FAQPage)
- Canonical URLs on every page
- `robots.txt` and `sitemap.xml` (already exist)
- Proper `lang="en"` attribute
- Breadcrumbs on all non-home pages

### Performance
- Lazy loading for below-fold images
- Proper `loading="lazy"` and `sizes` attributes
- Skeleton loading states (no layout shifts)
- Optimistic UI updates where applicable

### Security Headers (via next.config)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (basic)

---

## Phase 1 — Design System Foundation + Critical UX Fixes

### Unified Header System

#### [MODIFY] [site-header.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/components/site-header.tsx)
Complete rewrite → `SmartHeader`:
- Accept optional `user` prop (server-side `getCurrentUser()`)
- **Logged out:** Nav links → Sign In → Book a Session
- **Logged in:** Nav links → Cart → Notifications bell → Avatar dropdown
- Avatar dropdown: Dashboard, My Books, Orders, Consultations, Wishlist, Settings, Admin Portal (if admin), Sign Out
- Sticky with scroll-aware transparency
- Mobile hamburger with full nav + auth-aware actions
- Skip-to-content link (accessibility)

#### [MODIFY] [app/page.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/page.tsx)
Pass user to SmartHeader

#### [MODIFY] [app/(shop)/layout.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/(shop)/layout.tsx)
Use SmartHeader instead of StoreHeader, pass user

#### [MODIFY] [app/account/layout.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/account/layout.tsx)
Use SmartHeader instead of custom header, keep sidebar

#### [MODIFY] [site-footer.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/components/site-footer.tsx)
- Update all links to proper routes (`/about`, `/store`, `/library`, `/blog`, `/consultation`, `/contact`, `/privacy`, `/refund-policy`, `/terms`)
- Add newsletter signup form
- Add accessibility: proper nav landmark, link focus states

---

### Cookie Consent Banner

#### [NEW] `components/cookie-consent.tsx`
- GDPR-compliant cookie consent banner
- Options: Accept All, Reject Non-Essential, Manage Preferences
- Saves consent to localStorage + cookies
- Blocks analytics until consent
- Accessible, keyboard navigable
- Persists across sessions

---

### Design Tokens & Globals

#### [MODIFY] [globals.css](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/globals.css)
- Spacing scale tokens (`--space-1` through `--space-20`)
- Elevation/shadow system (4 levels)
- Transition tokens (duration, easing)
- Update dark mode to brand-consistent teal/gold palette
- Skeleton animation keyframes
- Toast notification animations
- Modal/drawer backdrop styles
- Focus-visible ring utilities
- `prefers-reduced-motion` media query overrides
- Skip-to-content styles
- Scrollbar styling

---

### New Shared UI Components

#### [NEW] `components/ui/skeleton.tsx`
Loading skeleton primitives (rectangular, circular, text line variants)

#### [NEW] `components/ui/toast.tsx` + `components/ui/toast-provider.tsx`
Toast notification system: success/error/warning/info, auto-dismiss, stacking, screen reader announcements

#### [NEW] `components/ui/modal.tsx`
Dialog with backdrop, sizes (sm/md/lg/xl/full), trap focus, close on escape, scrollable body

#### [NEW] `components/ui/drawer.tsx`
Slide-in panel (left/right/bottom), focus trap, mobile-first

#### [NEW] `components/ui/data-table.tsx`
Reusable data table: search, sort, pagination, column toggle, bulk select, CSV export, responsive card view for mobile

#### [NEW] `components/ui/empty-state.tsx`
Icon + title + description + CTA button

#### [NEW] `components/ui/error-state.tsx`
Error display with retry action

#### [NEW] `components/ui/loading-page.tsx`
Full-page skeleton layouts (list, grid, detail page)

#### [NEW] `components/ui/status-badge.tsx`
Semantic status badges (pending, active, completed, cancelled, refunded)

#### [NEW] `components/ui/tabs.tsx`
Tab navigation: underline and pill variants

#### [NEW] `components/ui/select.tsx`
Custom select/dropdown with search

#### [NEW] `components/ui/textarea.tsx`
Styled textarea

#### [NEW] `components/ui/checkbox.tsx`
#### [NEW] `components/ui/radio-group.tsx`
#### [NEW] `components/ui/progress.tsx`
Linear and circular progress bars

#### [NEW] `components/ui/breadcrumb.tsx`
#### [NEW] `components/ui/pagination.tsx`
Page numbers, prev/next, per-page selector

#### [NEW] `components/ui/tooltip.tsx`
#### [NEW] `components/ui/switch.tsx`
#### [NEW] `components/ui/stepper.tsx`
Multi-step wizard stepper

#### [NEW] `components/ui/calendar-picker.tsx`
Date picker

#### [NEW] `components/ui/time-picker.tsx`
Time slot grid picker

#### [NEW] `components/ui/image-zoom.tsx`
Image lightbox with zoom

#### [NEW] `components/ui/star-rating.tsx`
Display and input star rating

#### [NEW] `components/ui/quantity-selector.tsx`
#### [NEW] `components/ui/tag-input.tsx`
#### [NEW] `components/ui/file-upload.tsx`
Drag-and-drop upload zone

#### [NEW] `components/ui/rich-text-editor.tsx`
Simple rich text (bold, italic, headings, lists, links)

#### [NEW] `components/ui/skip-to-content.tsx`
Accessibility skip link

---

## Phase 2 — Public Website Pages

All pages use `SmartHeader` + `SiteFooter`. Breadcrumbs on every non-home page.

### About Page

#### [NEW] `app/about/page.tsx`
- Scholar's story hero
- Mission & Vision cards
- Qualifications timeline
- Community impact stats
- Photo gallery
- CTA section
- JSON-LD: Person structured data
- SEO metadata

#### [NEW] `app/about/loading.tsx`

---

### Blog Pages

#### [NEW] `app/blog/page.tsx` — Blog list with category tabs, search, featured article, grid, pagination, sidebar
#### [NEW] `app/blog/loading.tsx`
#### [NEW] `app/blog/[slug]/page.tsx` — Article detail with TOC, author card, share, related articles, JSON-LD Article
#### [NEW] `app/blog/[slug]/loading.tsx`
#### [NEW] `components/blog/article-card.tsx`
#### [NEW] `components/blog/blog-sidebar.tsx`
#### [NEW] `components/blog/share-buttons.tsx`
#### [NEW] `components/blog/table-of-contents.tsx`

---

### Contact Page

#### [NEW] `app/contact/page.tsx`
- Form with Zod validation (name, email, subject, message)
- Success/error states
- Contact info cards
- Social links
- JSON-LD: ContactPoint

#### [NEW] `app/contact/loading.tsx`

---

### Consultation Page

#### [NEW] `app/consultation/page.tsx`
- Service tiers with pricing cards
- What to expect section
- Testimonials
- FAQ accordion
- CTA → booking flow
- JSON-LD: Service

#### [NEW] `app/consultation/loading.tsx`

---

### Legal Pages (GDPR Compliant)

#### [NEW] `app/faq/page.tsx` — Categorized accordion + JSON-LD FAQPage
#### [NEW] `app/privacy/page.tsx` — Full GDPR privacy policy with:
  - Data controller identity
  - Types of data collected
  - Purpose of processing
  - Legal basis (Article 6)
  - Data retention periods
  - Third-party processors (Razorpay, Cloudinary, MongoDB Atlas)
  - Cookie policy
  - User rights (access, rectification, erasure, portability, objection)
  - Contact for data protection
#### [NEW] `app/refund-policy/page.tsx`
#### [NEW] `app/terms/page.tsx` — Terms of Service
#### [NEW] `app/cookie-policy/page.tsx` — Dedicated cookie policy

#### [NEW] `components/legal/legal-page-layout.tsx`
Shared layout with sidebar table of contents

---

### 404 Page

#### [NEW] `app/not-found.tsx`
- Beautiful Islamic geometric animation
- Search bar
- Popular links
- Return home CTA

---

## Phase 3 — Store & Product Detail

### Store Page (Complete Redesign)

#### [MODIFY] [store page](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/(shop)/store/page.tsx)
- Desktop: sticky sidebar filters + product grid
- Mobile: filter drawer (bottom sheet)
- Search with debounce + suggestions
- Category checkboxes, price range slider, sort dropdown
- Grid/list toggle
- Quick view modal
- Wishlist toggle
- Pagination
- Recently viewed (localStorage)
- Featured products banner
- Loading skeleton grid
- Empty state
- JSON-LD: ItemList

#### [MODIFY] [store-product-card.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/components/store/store-product-card.tsx)
- Hover image scale + quick actions overlay
- Wishlist heart, quick view, sale price, stock badge, rating

#### [NEW] `components/store/store-sidebar.tsx` — Desktop sticky filter sidebar
#### [NEW] `components/store/filter-drawer.tsx` — Mobile filter drawer
#### [NEW] `components/store/quick-view-modal.tsx`
#### [NEW] `components/store/product-grid-toggle.tsx`
#### [NEW] `components/store/recently-viewed.tsx`
#### [NEW] `components/store/wishlist-button.tsx`
#### [NEW] `components/store/price-range-filter.tsx`
#### [NEW] `components/store/search-bar.tsx`

---

### Product Detail Page

#### [MODIFY] [product slug](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/(shop)/store/[slug])
- Image gallery with thumbnails + zoom
- Product info: title, price, sale price, rating, reviews
- Variant selector, stock badge, quantity selector
- Add to Cart + Buy Now (Razorpay mock)
- Wishlist button
- Tabs: Description, Reviews, Shipping, FAQ
- Related products carousel
- Recently viewed
- Sticky purchase bar (desktop) + mobile purchase footer
- Breadcrumbs
- JSON-LD: Product

#### [NEW] `components/store/product-gallery.tsx`
#### [NEW] `components/store/product-info.tsx`
#### [NEW] `components/store/product-tabs.tsx`
#### [NEW] `components/store/review-section.tsx`
#### [NEW] `components/store/related-products.tsx`
#### [NEW] `components/store/sticky-purchase-bar.tsx`
#### [NEW] `components/store/mobile-purchase-footer.tsx`

---

## Phase 4 — Digital Library & Book Detail

### Digital Library (Netflix-Style)

#### [NEW] `app/library/page.tsx`
- Featured book hero spotlight
- Sections: Featured, Recently Added, Most Popular, Continue Reading (logged in), My Purchased Books (logged in), Recommended
- Horizontal scrollable rows (Netflix-style)
- Category tabs
- Search bar
- Book cards with cover, progress indicator, owned badge
- Responsive: 5-col → 3-col → 2-col
- JSON-LD: ItemList of Books

#### [NEW] `app/library/loading.tsx`
#### [NEW] `components/library/library-hero.tsx`
#### [NEW] `components/library/book-card.tsx`
#### [NEW] `components/library/book-section.tsx`
#### [NEW] `components/library/library-search.tsx`

---

### Digital Book Detail

#### [NEW] `app/library/[slug]/page.tsx`
- Large cover image
- Title, author, category, page count
- Rating + reviews
- Expandable description
- Preview button → opens reader to first few pages (watermarked/limited)
- Purchase button (Razorpay mock) / "Start Reading" if owned
- Reading progress bar if owned
- Table of contents preview
- Related books
- Reviews section
- Access status badge (Purchased / Preview Only / Locked)
- JSON-LD: Book

#### [NEW] `app/library/[slug]/loading.tsx`
#### [NEW] `components/library/book-detail-hero.tsx`
#### [NEW] `components/library/book-toc-preview.tsx`
#### [NEW] `components/library/book-access-badge.tsx`

---

## Phase 5 — PDF Book Reader (Kindle-Style)

> [!IMPORTANT]
> Books are **PDF files**. The reader renders PDFs in-browser using a canvas-based PDF renderer (pdf.js or similar). **No download button, no export, no right-click save.** The PDF URL is never exposed to the client — it's proxied through an API route that verifies purchase.

### Reader Implementation

#### [NEW] `app/reader/[bookId]/page.tsx`
Client-side reader shell — full immersive experience, no site header/footer

#### [NEW] `app/reader/[bookId]/layout.tsx`
Minimal layout (no chrome)

#### [NEW] `app/api/reader/[bookId]/route.ts`
Server-side PDF proxy:
- Verify user is authenticated
- Verify user has purchased this book
- Stream PDF bytes from storage (never expose URL)
- Set `Content-Disposition: inline` (no download)
- Add cache headers

#### [NEW] `components/reader/reader-shell.tsx`
Main orchestrator: loads PDF, manages state, renders pages

#### [NEW] `components/reader/reader-toolbar.tsx`
Top toolbar: back button, book title, chapter/page dropdown, settings, bookmark, fullscreen toggle

#### [NEW] `components/reader/reader-content.tsx`
PDF page renderer (canvas-based), page transitions, pinch-to-zoom on mobile

#### [NEW] `components/reader/reader-sidebar.tsx`
Left sidebar: Table of contents (from PDF outline), bookmarks, notes

#### [NEW] `components/reader/reader-settings.tsx`
Settings panel: theme (light/dark/sepia), zoom level, page fit mode (width/page), scroll mode (single page/continuous)

#### [NEW] `components/reader/reader-progress.tsx`
Bottom progress bar: current page / total pages, percentage, chapter indicator

#### [NEW] `components/reader/reader-navigation.tsx`
Prev/next page buttons, keyboard arrows, swipe gestures on mobile

#### [NEW] `components/reader/bookmark-button.tsx`
Bookmark current page (saved to DB)

#### [NEW] `components/reader/reading-stats.tsx`
Reading time, pages read, progress percentage

#### [NEW] `components/reader/mobile-reader.tsx`
Mobile-optimized: bottom toolbar, swipe navigation, tap zones (left/right for prev/next)

#### [NEW] `lib/reader-store.ts`
Client-side state: current page, zoom, settings, bookmarks (synced to DB)

#### PDF Security Measures
- PDF streamed through API route (URL never exposed)
- `Content-Security-Policy` blocks `blob:` downloads
- Right-click disabled on reader canvas
- Print CSS hides content
- No download/export buttons anywhere
- Watermark overlay with user email on each page (optional, configurable)

---

## Phase 6 — Auth Pages Enhancement

#### [MODIFY] [auth-shell.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/components/auth/auth-shell.tsx)
- Split layout: left side = form, right side = testimonial carousel + Islamic geometric pattern
- Mobile: form only with pattern background

#### [MODIFY] [login-form.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/components/auth/login-form.tsx)
- Social login placeholders (Google, Apple)
- "Remember me" checkbox
- Enhanced validation messages
- Loading spinner on submit

#### [MODIFY] [register-form.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/components/auth/register-form.tsx)
- Social login placeholders
- Password strength indicator
- Terms acceptance checkbox (required, links to /terms and /privacy)
- GDPR consent checkbox

#### [NEW] `app/2fa/page.tsx` — 2FA setup with QR placeholder + backup codes + OTP input
#### [NEW] `app/account-recovery/page.tsx` — Multi-step recovery wizard
#### [NEW] `components/auth/social-login-buttons.tsx`
#### [NEW] `components/auth/password-strength.tsx`
#### [NEW] `components/auth/otp-input.tsx`

---

## Phase 7 — Customer Dashboard

All dashboard pages use `SmartHeader` (full website nav) + account sidebar.

### Layout Enhancement

#### [MODIFY] [account layout](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/account/layout.tsx)
- Use SmartHeader (full website navigation preserved)
- Mobile: sidebar becomes bottom nav or hamburger drawer
- Breadcrumbs below header
- Notification count in header

#### [MODIFY] [account-nav.tsx](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/components/account/account-nav.tsx)
- Add Wishlist, Notifications items
- Badge counts for unread notifications
- Mobile drawer version

---

### Dashboard Home

#### [MODIFY] [account page](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/app/account/page.tsx)
- Recent orders widget with status badges
- Purchased books with reading progress bars
- Upcoming consultations
- Wishlist preview
- Profile completion progress
- Activity timeline
- Quick actions

---

### My Books

#### [NEW] `app/account/library/page.tsx`
- Grid of purchased books with covers
- Reading progress bars
- Continue reading section (prominent)
- Bookmarks saved
- Favorites toggle
- Search + filter + sort
- Grid/list toggle
- Empty state: "Explore the library"

#### [NEW] `app/account/library/loading.tsx`
#### [NEW] `components/account/book-library-card.tsx`

---

### Orders

#### [NEW] `app/account/orders/page.tsx`
- Data table: date, order #, items, total, status
- Status badges
- Expandable order detail drawer
- Invoice download
- Tracking link
- Refund request button + modal
- Search, filter by status, pagination

#### [NEW] `app/account/orders/loading.tsx`
#### [NEW] `components/account/order-detail-drawer.tsx`
#### [NEW] `components/account/refund-request-modal.tsx`

---

### Consultation Booking

#### [NEW] `app/account/bookings/page.tsx`
Multi-step booking wizard + my bookings list:

**Step 1:** Select session type (cards with pricing)
**Step 2:** Choose date (calendar — **real availability from DB**)
**Step 3:** Choose time slot (**real available slots from DB**)
**Step 4:** Fill details (name, topic, notes)
**Step 5:** Payment summary (Razorpay mock)
**Step 6:** Confirmation (calendar add link)

Plus: My bookings list (upcoming/past), reschedule, cancel

#### [NEW] `app/account/bookings/loading.tsx`
#### [NEW] `components/account/booking-wizard.tsx`
#### [NEW] `components/account/session-type-cards.tsx`
#### [NEW] `components/account/date-picker-step.tsx`
#### [NEW] `components/account/time-slot-picker.tsx`
#### [NEW] `components/account/booking-details-form.tsx`
#### [NEW] `components/account/booking-payment-step.tsx` — Razorpay mock UI
#### [NEW] `components/account/booking-confirmation.tsx`
#### [NEW] `components/account/my-bookings-list.tsx`

#### [NEW] `lib/bookings.ts`
DB operations: available dates, available slots, create/update booking

#### [NEW] `app/api/bookings/availability/route.ts`
API: GET available dates and time slots from DB

---

### Wishlist

#### [NEW] `app/account/wishlist/page.tsx`
- Grid of saved products
- Remove, add to cart
- Empty state

#### [NEW] `app/account/wishlist/loading.tsx`

---

### Notifications

#### [NEW] `app/account/notifications/page.tsx`
- Notification list (orders, books, bookings)
- Mark read/unread
- Filter by type
- Empty state

#### [NEW] `app/account/notifications/loading.tsx`
#### [NEW] `components/account/notification-item.tsx`

---

### Settings

#### [NEW] `app/account/settings/page.tsx`
Tabbed: Profile, Addresses, Security, Preferences
- Profile: name, email, avatar
- Addresses: list, add/edit modal
- Security: change password, 2FA toggle, sessions
- Preferences: notification settings, reader defaults
- **GDPR:** Account deletion, data export buttons

#### [NEW] `components/account/profile-form.tsx`
#### [NEW] `components/account/address-form.tsx`
#### [NEW] `components/account/security-settings.tsx`
#### [NEW] `components/account/notification-preferences.tsx`
#### [NEW] `components/account/data-privacy-section.tsx` — GDPR rights (delete account, export data)

---

## Phase 8 — Admin Panel

Separate admin experience at `/admin`. Uses SmartHeader variant with admin branding.

### Admin Layout

#### [NEW] `app/admin/layout.tsx`
- Role guard (redirect non-admins)
- Collapsible sidebar (expanded/icon-only)
- Top header: breadcrumbs, global search (Cmd+K), notifications, user menu
- Mobile: sidebar → drawer

#### [NEW] `components/admin/admin-sidebar.tsx`
#### [NEW] `components/admin/admin-header.tsx`
#### [NEW] `components/admin/admin-search.tsx` — Global search modal

---

### Admin Dashboard

#### [NEW] `app/admin/page.tsx`
- KPI cards: Revenue, Orders, Bookings, Users, Book Sales, Conversion Rate
- Revenue chart placeholder (line/bar)
- Recent activities feed
- Top products table
- Top books table

#### [NEW] `app/admin/loading.tsx`
#### [NEW] `components/admin/kpi-card.tsx`
#### [NEW] `components/admin/chart-placeholder.tsx`
#### [NEW] `components/admin/recent-activity.tsx`

---

### Product Management

#### [NEW] `app/admin/products/page.tsx` — Data table
#### [NEW] `app/admin/products/new/page.tsx` — Create form
#### [NEW] `app/admin/products/[id]/page.tsx` — Edit form
#### [NEW] `app/admin/products/loading.tsx`
#### [NEW] `components/admin/product-form.tsx` — Full form (title, description, price, images, category, variants, inventory, SEO)
#### [NEW] `components/admin/product-table.tsx`
#### [NEW] `components/admin/media-upload-zone.tsx`
#### [NEW] `components/admin/product-variant-builder.tsx`
#### [NEW] `components/admin/inventory-manager.tsx`
#### [NEW] `components/admin/seo-fields.tsx`
#### [NEW] `components/admin/review-moderation.tsx`

---

### Digital Book Management

#### [NEW] `app/admin/books/page.tsx` — Books list
#### [NEW] `app/admin/books/new/page.tsx` — Create book
#### [NEW] `app/admin/books/[id]/page.tsx` — Edit book
#### [NEW] `app/admin/books/[id]/chapters/page.tsx` — Chapter/page builder
#### [NEW] `app/admin/books/loading.tsx`
#### [NEW] `components/admin/book-form.tsx`
#### [NEW] `components/admin/book-table.tsx`
#### [NEW] `components/admin/chapter-builder.tsx` — CMS-style: create/reorder chapters, create/reorder pages, draft/publish, auto-save
#### [NEW] `components/admin/page-editor.tsx` — Rich text page content
#### [NEW] `components/admin/book-analytics.tsx` — Readers, progress, completion
#### [NEW] `components/admin/purchasers-list.tsx`
#### [NEW] `components/admin/pdf-upload.tsx` — PDF file upload for book content

---

### Order Management

#### [NEW] `app/admin/orders/page.tsx`
#### [NEW] `app/admin/orders/[id]/page.tsx`
#### [NEW] `app/admin/orders/loading.tsx`
#### [NEW] `components/admin/order-table.tsx`
#### [NEW] `components/admin/order-detail.tsx`
#### [NEW] `components/admin/refund-workflow.tsx`
#### [NEW] `components/admin/order-status-updater.tsx`
#### [NEW] `components/admin/invoice-template.tsx`

---

### Booking Management

#### [NEW] `app/admin/bookings/page.tsx` — Calendar + table
#### [NEW] `app/admin/bookings/[id]/page.tsx`
#### [NEW] `app/admin/bookings/loading.tsx`
#### [NEW] `components/admin/booking-calendar.tsx` — Monthly/weekly view with slots
#### [NEW] `components/admin/booking-table.tsx`
#### [NEW] `components/admin/booking-detail.tsx`
#### [NEW] `components/admin/booking-approval.tsx`
#### [NEW] `components/admin/availability-manager.tsx` — Set available dates/times in DB

---

### Blog CMS

#### [NEW] `app/admin/blog/page.tsx`
#### [NEW] `app/admin/blog/new/page.tsx`
#### [NEW] `app/admin/blog/[id]/page.tsx`
#### [NEW] `app/admin/blog/loading.tsx`
#### [NEW] `components/admin/article-form.tsx` — Rich text, categories, tags, SEO, draft/publish
#### [NEW] `components/admin/article-table.tsx`
#### [NEW] `components/admin/category-manager.tsx`
#### [NEW] `components/admin/tag-manager.tsx`

---

### Media Library

#### [NEW] `app/admin/media/page.tsx`
- Folder tree sidebar
- Image grid, search, filter
- Upload, preview, delete, bulk actions

#### [NEW] `app/admin/media/loading.tsx`
#### [NEW] `components/admin/media-grid.tsx`
#### [NEW] `components/admin/media-folder-tree.tsx`
#### [NEW] `components/admin/media-preview-modal.tsx`
#### [NEW] `components/admin/media-upload-modal.tsx`

---

### Settings Module

#### [NEW] `app/admin/settings/page.tsx` — Tabbed settings
#### [NEW] `components/admin/settings-general.tsx`
#### [NEW] `components/admin/settings-seo.tsx`
#### [NEW] `components/admin/settings-payment.tsx` — Razorpay keys config
#### [NEW] `components/admin/settings-email.tsx`
#### [NEW] `components/admin/settings-cloudinary.tsx`
#### [NEW] `components/admin/settings-booking.tsx` — Session durations, buffer, max/day
#### [NEW] `components/admin/settings-users.tsx`
#### [NEW] `components/admin/settings-roles.tsx`

---

### Shared Admin Modals

#### [NEW] `components/admin/confirm-modal.tsx`
#### [NEW] `components/admin/role-assign-modal.tsx`
#### [NEW] `components/admin/coupon-create-modal.tsx`
#### [NEW] `components/admin/category-create-modal.tsx`

---

## Security Headers

#### [MODIFY] [next.config.mjs](file:///Users/admin/Documents/Danish%20work/Islamic-brand-website/next.config.mjs)
Add security headers:
```js
headers: () => [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  },
]
```

---

## Verification Plan

### Build
```bash
npm run build
```
Zero errors after each phase.

### Visual Testing (Each Phase)
- Desktop (1440px), Tablet (768px), Mobile (375px)
- Dark mode toggle on every page
- Loading states and empty states
- Skeleton → content transition

### Accessibility Audit
- Lighthouse accessibility score ≥ 95
- Keyboard navigation on all interactive elements
- Screen reader testing (VoiceOver)
- Color contrast validation

### Interaction Testing
- Modals: open/close, focus trap, escape key
- Drawers: slide animation, overlay click close
- Forms: validation, error states, success states
- Tables: sort, filter, paginate, bulk select
- Reader: page navigation, bookmarks, settings
- Booking wizard: step transitions, validation per step

### Compliance Checklist
- [ ] Cookie consent appears on first visit
- [ ] Privacy policy has all GDPR sections
- [ ] Account deletion option exists
- [ ] Data export option exists
- [ ] All forms have proper labels
- [ ] All images have alt text
- [ ] Skip-to-content link works
- [ ] Focus states visible on all interactive elements

---

## Execution Order

| Phase | Scope | Est. Files |
|-------|-------|-----------|
| 1 | Design system + UX fixes + compliance | ~35 |
| 2 | Public website pages | ~22 |
| 3 | Store + product detail | ~18 |
| 4 | Digital library + book detail | ~12 |
| 5 | PDF book reader | ~15 |
| 6 | Auth enhancement | ~8 |
| 7 | Customer dashboard | ~30 |
| 8 | Admin panel | ~50 |
| **Total** | | **~190 files** |
