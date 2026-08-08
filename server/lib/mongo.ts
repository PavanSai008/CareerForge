import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error(
    'MONGODB_URL must be set. Provide a MongoDB connection string (e.g. from MongoDB Atlas).',
  );
}

// Cache the connection promise on the global object so serverless platforms
// (Vercel) reuse the same connection across warm invocations instead of
// opening a new one per request.
declare global {
  // eslint-disable-next-line no-var
  var __mongoConnectPromise: Promise<typeof mongoose> | undefined;
}

export function connectMongo(): Promise<typeof mongoose> {
  if (!globalThis.__mongoConnectPromise) {
    globalThis.__mongoConnectPromise = mongoose
      .connect(MONGODB_URL as string)
      .then((conn) => {
        console.log('Connected to MongoDB');
        return conn;
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        globalThis.__mongoConnectPromise = undefined;
        throw err;
      });
  }
  return globalThis.__mongoConnectPromise;
}
