import { type NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/session"
import { uploadImage } from "@/lib/cloudinary"

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]
const FOLDER_MAP: Record<string, "products" | "blog" | "books"> = {
  product: "products",
  blog: "blog",
  book: "books",
}

export async function POST(req: NextRequest) {
  const user = await requireRole("editor")
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const kind = formData.get("kind") as string | null

  if (!file || !kind) {
    return NextResponse.json({ error: "Missing file or kind" }, { status: 400 })
  }

  const folder = FOLDER_MAP[kind]
  if (!folder) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only image files are accepted (jpeg, png, webp, avif, gif)" }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 5 MB limit" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await uploadImage(buffer, folder)

  return NextResponse.json({ url })
}
