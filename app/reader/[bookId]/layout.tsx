import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}

// Minimal layout — no SiteHeader/SiteFooter.
// Print CSS hides the reader so PDFs can't be captured via print-to-PDF.
export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`@media print { body { display: none !important; } }`}</style>
      {children}
    </>
  )
}
