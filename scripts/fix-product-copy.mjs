/**
 * One-off data fix for the live `products` collection.
 *
 * lib/products.ts only holds the SEED array - it runs once, on an empty
 * collection. Editing it does nothing to documents that are already in Mongo,
 * so these two problems had to be fixed in the data as well as in the source:
 *
 *   1. "Instant download to any device" / "beautifully designed PDF" in
 *      `highlights`. E-books are read in the in-browser reader and downloading
 *      them is prohibited by the Terms (app/terms/page.tsx) and blocked in the
 *      reader layout. The copy promised customers something the product
 *      deliberately does not do.
 *
 *   2. rating: 5 with reviews: 218 / 164 / 312 ... on products that have never
 *      had a single review - there is no reviews collection anywhere in the
 *      app. Those numbers fed the Product JSON-LD aggregateRating, which is
 *      review spam under Google's guidelines and risks a manual action.
 *
 * Safe to run more than once: every update is idempotent, and it reports what
 * it changed. Dry run by default.
 *
 *   node scripts/fix-product-copy.mjs          # show what would change
 *   node scripts/fix-product-copy.mjs --apply  # write the changes
 */

import { MongoClient } from "mongodb"
import { readFileSync } from "node:fs"

// Load MONGODB_URI from .env.local without pulling in a dependency.
function loadEnv() {
  if (process.env.MONGODB_URI) return
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
      }
    }
  } catch {
    /* no .env.local - rely on the ambient environment */
  }
}

loadEnv()

const APPLY = process.argv.includes("--apply")
const uri = process.env.MONGODB_URI
if (!uri) {
  console.error("MONGODB_URI is not set (checked the environment and .env.local)")
  process.exit(1)
}

// Exact replacements for known bad highlight strings, plus a catch-all regex
// for anything else that promises a download.
const HIGHLIGHT_REPLACEMENTS = [
  [/^Instant download to any device$/i, "Instant access in your library, on any device"],
  [/^\d+-page beautifully designed PDF$/i, null], // handled below, keeps the page count
  [/^Instant,? downloadable.*$/i, "Instant access in your library, on any device"],
]

function fixHighlight(h) {
  const pageMatch = h.match(/^(\d+)-page beautifully designed PDF$/i)
  if (pageMatch) return `${pageMatch[1]}-page ebook`
  for (const [pattern, replacement] of HIGHLIGHT_REPLACEMENTS) {
    if (replacement && pattern.test(h)) return replacement
  }
  // Generic safety net: any remaining "download" promise.
  if (/\bdownload(able|s|ed)?\b/i.test(h)) {
    return "Instant access in your library, on any device"
  }
  return h
}

const client = new MongoClient(uri)

try {
  await client.connect()
  const db = client.db(process.env.MONGODB_DB || "iqra_khan")
  const col = db.collection("products")

  const products = await col.find({}).toArray()
  console.log(`Found ${products.length} products\n`)

  let copyChanges = 0
  let ratingChanges = 0

  for (const p of products) {
    const updates = {}

    const highlights = Array.isArray(p.highlights) ? p.highlights : []
    const fixed = highlights.map(fixHighlight)
    if (JSON.stringify(fixed) !== JSON.stringify(highlights)) {
      updates.highlights = fixed
      copyChanges++
      console.log(`  ${p.slug}: highlights`)
      highlights.forEach((h, i) => {
        if (h !== fixed[i]) console.log(`      - "${h}"\n      + "${fixed[i]}"`)
      })
    }

    if (p.rating !== 0 || p.reviews !== 0) {
      updates.rating = 0
      updates.reviews = 0
      ratingChanges++
      console.log(
        `  ${p.slug}: rating ${p.rating} -> 0, reviews ${p.reviews} -> 0 (no reviews exist)`,
      )
    }

    if (Object.keys(updates).length > 0 && APPLY) {
      updates.updatedAt = new Date()
      await col.updateOne({ _id: p._id }, { $set: updates })
    }
  }

  console.log(
    `\n${copyChanges} product(s) with download copy, ${ratingChanges} with invented ratings.`,
  )
  console.log(APPLY ? "Applied." : "Dry run - re-run with --apply to write.")
} finally {
  await client.close()
}
