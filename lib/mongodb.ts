import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable")
}

const options = {}

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
