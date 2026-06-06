import { StoreHeader } from "@/components/store/store-header"
import { SiteFooter } from "@/components/site-footer"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
