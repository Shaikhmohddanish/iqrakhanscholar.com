import type { Metadata } from "next"
import Link from "next/link"
import { Upload, Image as ImageIcon, Folder } from "lucide-react"

export const metadata: Metadata = {
  title: "Media — Admin",
  robots: { index: false },
}

export default function AdminMediaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground">Manage images, PDFs, and other assets.</p>
        </div>
        <button
          type="button"
          disabled
          className="flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground opacity-60 cursor-not-allowed"
        >
          <Upload className="size-4" /> Upload
        </button>
      </div>

      {/* Upload zone */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <ImageIcon className="size-8" />
        </div>
        <div className="text-center">
          <p className="font-heading text-lg font-semibold text-foreground">Media library</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect Cloudinary or S3 to enable file uploads.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure storage in Admin → Settings → Cloudinary.
          </p>
        </div>
        <Link
          href="/admin/settings?tab=cloudinary"
          className="flex h-9 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Configure storage
        </Link>
      </div>
    </div>
  )
}
