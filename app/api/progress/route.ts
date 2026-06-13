import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { saveProgress, toggleBookmarkDb, getProgress } from "@/lib/reading-progress"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("bookId")
  if (!bookId) return NextResponse.json({ error: "bookId required" }, { status: 400 })

  const progress = await getProgress(user.id, bookId)
  return NextResponse.json({ progress })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { bookId, currentPage, totalPages, toggleBookmark } = body as {
    bookId: string
    currentPage?: number
    totalPages?: number
    toggleBookmark?: number
  }

  if (!bookId) return NextResponse.json({ error: "bookId required" }, { status: 400 })

  if (typeof toggleBookmark === "number") {
    const result = await toggleBookmarkDb(user.id, bookId, toggleBookmark)
    return NextResponse.json(result)
  }

  if (typeof currentPage === "number" && typeof totalPages === "number") {
    await saveProgress(user.id, bookId, currentPage, totalPages)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 })
}
