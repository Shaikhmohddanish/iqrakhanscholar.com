import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable")
}

const options = {
  // Serverless functions each get their own pool, so the driver default of 100
  // multiplies by the number of warm instances and will exhaust an Atlas M0/M10
  // connection cap under traffic. Ten is plenty for this workload: requests are
  // short and mostly a single query.
  maxPoolSize: 10,
  // Fail fast instead of hanging a request for the default 30s when Atlas is
  // unreachable - a slow error is worse than a quick one behind a CDN.
  serverSelectionTimeoutMS: 5000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Use a global to preserve the connection across HMR reloads in development.
const globalForMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalForMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalForMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise
  // Database name can be embedded in the URI; fall back to "iqra_khan".
  return connectedClient.db(process.env.MONGODB_DB || "iqra_khan")
}

export default clientPromise
