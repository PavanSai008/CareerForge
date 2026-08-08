import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Standalone config: works with plain `vite`/`vite build`/`vite preview`
// commands locally and on Vercel. No Replit-specific env vars are required.
const port = Number(process.env.PORT ?? 5173);
const apiPort = Number(process.env.API_PORT ?? 3001);

export default defineConfig({
  base: '/',
  // optimize: false avoids a Vite pre-bundling issue with Clerk's CSS
  // @layer usage in dev mode.
  plugins: [react(), tailwindcss({ optimize: false })],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    host: '0.0.0.0',
    // In local dev, forward API calls to the Express server so the browser
    // sees everything as same-origin (matches Vercel's production topology,
    // where /api/* is rewritten to the serverless function on the same domain).
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
  },
});
