import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { getPurchasedProductSlugs } from '@/lib/orders'
import { getDb } from '@/lib/mongodb'
import type { ProductDoc } from '@/lib/products'
import { ReaderShell } from '@/components/reader/reader-shell'

async function findDigitalProduct(bookId: string): Promise<ProductDoc | null> {
  const db = await getDb()
  const col = db.collection<ProductDoc>('products')
  const { ObjectId } = await import('mongodb')
  if (ObjectId.isValid(bookId)) {
    const byId = await col.findOne({ _id: new ObjectId(bookId), type: 'digital' })
    if (byId) return byId
  }
  return col.findOne({ slug: bookId, type: 'digital' })
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params

  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=/reader/${bookId}`)

  const product = await findDigitalProduct(bookId)
  if (!product) redirect('/library')

  // Admins can read all books; customers must have purchased
  if (user.role !== 'admin') {
    const purchasedSlugs = await getPurchasedProductSlugs(user.id)
    if (!purchasedSlugs.includes(product.slug)) {
      redirect(`/library/${product.slug}`)
    }
  }

  return (
    <ReaderShell
      bookId={bookId}
      bookSlug={product.slug}
      bookTitle={product.title}
      bookAuthor={product.author ?? ''}
      totalPageHint={product.pageCount ?? 0}
      userEmail={user.email}
    />
  )
}
