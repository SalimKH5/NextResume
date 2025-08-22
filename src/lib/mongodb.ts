import { MongoClient, MongoClientOptions } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// MongoDB connection URI
const uri: string = process.env.MONGODB_URI!;
const options: MongoClientOptions = {}; // Add options if needed, e.g., tls=true, etc.

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process?.env?.NODE_ENV === "development") {
  // Use a global variable to preserve value across module reloads (HMR)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each build
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
