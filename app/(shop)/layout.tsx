import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WishlistProvider } from "@/components/store/wishlist-provider"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    // WishlistProvider resolves the visitor's wishlist in the browser, so the
    // storefront pages don't have to read the session cookie and can be
    // prerendered instead of rendered per request.
    <WishlistProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </WishlistProvider>
  )
}
