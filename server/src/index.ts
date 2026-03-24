import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import uploadRouter from './routes/upload';
import pagesRouter from './routes/pages';
import aiRouter from './routes/ai';

// Load .env (works in local dev; in Docker, env vars are injected directly)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// In production (Docker) the nginx proxy is the only caller — allow any origin.
// In dev allow Vite dev server.
const allowedOrigins = isProd
  ? true   // allow all (nginx is the gatekeeper)
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/upload', uploadRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/ai', aiRouter);

// Health check — used by Docker healthcheck and load balancers
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, ts: new Date().toISOString() });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`\n  DocToPage API  →  http://0.0.0.0:${PORT}`);
  console.log(`  Health check   →  http://0.0.0.0:${PORT}/api/health\n`);
});

export default app;
