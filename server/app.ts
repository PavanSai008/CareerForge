import express, { type Express } from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import router from './routes/index.js';

const app: Express = express();

// In production the frontend and this API are served from the same domain
// (Vercel rewrites `/api/*` to this app), so cookies flow same-origin and
// permissive CORS below is mainly relevant for local development, where the
// Vite dev server proxies `/api/*` to this server anyway.
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reads CLERK_SECRET_KEY / CLERK_PUBLISHABLE_KEY from process.env by default.
app.use(clerkMiddleware());

app.use('/api', router);

export default app;
