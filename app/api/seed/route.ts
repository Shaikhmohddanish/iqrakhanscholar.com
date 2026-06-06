import { NextResponse } from "next/server"
import { seedProducts } from "@/lib/products"

// Idempotent catalog seed. Safe to call multiple times — only inserts when empty.
export async function POST() {
  const result = await seedProducts()
  return NextResponse.json({ ok: true, ...result })
}

export async function GET() {
  const result = await seedProducts()
  return NextResponse.json({ ok: true, ...result })
}
