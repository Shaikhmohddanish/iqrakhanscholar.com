import { type NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/session"
import { uploadPdf } from "@/lib/cloudinary"

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
  const user = await requireRole("admin")
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const slug = formData.get("slug") as string | null

  if (!file || !slug) {
    return NextResponse.json({ error: "Missing file or slug" }, { status: 400 })
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 50 MB limit" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const pdfPublicId = await uploadPdf(buffer, slug)

  return NextResponse.json({ pdfPublicId })
}
