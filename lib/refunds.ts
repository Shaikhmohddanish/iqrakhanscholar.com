import "server-only"
import { ObjectId, type WithId } from "mongodb"
import { getDb } from "./mongodb"

// Refund requests raised by customers from their orders page.
//
// There was no storage for these at all: the request modal was a fake 800ms
// delay and a success message, so every reason a customer typed was thrown
// away and Iqra never learned a refund had been asked for.

export type RefundRequestStatus = "open" | "approved" | "rejected" | "refunded"

export interface RefundRequestDoc {
  _id?: ObjectId
  orderId: string
  orderReference: string
  userId: string
  userEmail: string
  userName: string
  // amount requested, in minor units of `currency`
  amount: number
  currency: string
  reason: string
  status: RefundRequestStatus
  // set when an admin resolves it
  resolvedAt?: Date
  resolutionNote?: string
  createdAt: Date
  updatedAt: Date
}

export interface PublicRefundRequest extends Omit<RefundRequestDoc, "_id"> {
  id: string
}

function toPublic(doc: WithId<RefundRequestDoc>): PublicRefundRequest {
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

let indexesEnsured = false

async function refundsCol() {
  const db = await getDb()
  const col = db.collection<RefundRequestDoc>("refund_requests")
  if (!indexesEnsured) {
    // One open request per order - the uniqueness is enforced in
    // createRefundRequest rather than by a partial index, whose operator
    // support varies by server version.
    await col.createIndex({ orderId: 1 })
    await col.createIndex({ status: 1, createdAt: -1 })
    indexesEnsured = true
  }
  return col
}

/**
 * Create a refund request, unless this order already has one outstanding.
 * `created: false` means a request already exists.
 */
export async function createRefundRequest(
  input: Omit<RefundRequestDoc, "_id" | "status" | "createdAt" | "updatedAt">,
): Promise<{ created: boolean; request: PublicRefundRequest | null }> {
  const col = await refundsCol()

  const existing = await col.findOne({
    orderId: input.orderId,
    status: { $in: ["open", "approved", "refunded"] },
  })
  if (existing) return { created: false, request: toPublic(existing) }

  const now = new Date()
  const doc: RefundRequestDoc = {
    ...input,
    status: "open",
    createdAt: now,
    updatedAt: now,
  }
  const res = await col.insertOne(doc)
  return { created: true, request: toPublic({ ...doc, _id: res.insertedId }) }
}

export async function listRefundRequests(
  status?: RefundRequestStatus,
): Promise<PublicRefundRequest[]> {
  const col = await refundsCol()
  const filter = status ? { status } : {}
  const docs = await col.find(filter).sort({ createdAt: -1 }).limit(200).toArray()
  return docs.map(toPublic)
}

export async function getRefundRequestByOrder(
  orderId: string,
): Promise<PublicRefundRequest | null> {
  const col = await refundsCol()
  const doc = await col.findOne({ orderId })
  return doc ? toPublic(doc) : null
}

export async function setRefundRequestStatus(
  orderId: string,
  status: RefundRequestStatus,
  resolutionNote?: string,
): Promise<void> {
  const col = await refundsCol()
  await col.updateOne(
    { orderId },
    {
      $set: {
        status,
        resolvedAt: new Date(),
        updatedAt: new Date(),
        ...(resolutionNote ? { resolutionNote } : {}),
      },
    },
  )
}
