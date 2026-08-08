// Vercel serverless entry point. Vercel routes `/api/*` requests here (see
// vercel.json rewrites). Mongo connections are cached across warm
// invocations in server/lib/mongo.ts.
import app from '../server/app.js';
import { connectMongo } from '../server/lib/mongo.js';
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await connectMongo();
  // Express apps are valid (req, res) request listeners.
  (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
