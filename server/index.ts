// Local/standalone dev & production entry point (not used on Vercel — see
// api/index.ts for the serverless entry point there).
import 'dotenv/config';
import app from './app.js';
import { connectMongo } from './lib/mongo.js';

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);

connectMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB, exiting', err);
    process.exit(1);
  });
