# ══════════════════════════════════════════════════════════════════════════════
# Stage 1 — Install deps + compile TypeScript
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

# better-sqlite3 requires native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /build

# Copy project root so tsc rootDir ".." resolves correctly
# Structure: /build/shared/  and  /build/server/
COPY shared/ ./shared/
COPY server/  ./server/

# Install all deps (includes devDeps — need tsc)
WORKDIR /build/server
RUN npm install

# Compile TypeScript
# rootDir: ".."  →  dist/server/src/index.js  (relative to /build/server)
RUN npx tsc

# ══════════════════════════════════════════════════════════════════════════════
# Stage 2 — Lean production image
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS production

# Need build tools to rebuild better-sqlite3 native bindings for this arch
RUN apk add --no-cache python3 make g++ wget

RUN addgroup -S doctopage && adduser -S doctopage -G doctopage

WORKDIR /app

# Production deps only
COPY --chown=doctopage:doctopage server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Compiled JS (dist/server/src/index.js + dist/shared/...)
COPY --from=builder --chown=doctopage:doctopage /build/server/dist ./server/dist

# Seed script + entrypoint
COPY --chown=doctopage:doctopage server/seed-page.mjs          ./server/seed-page.mjs
COPY --chown=doctopage:doctopage server/seed-page-2.mjs        ./server/seed-page-2.mjs
COPY --chown=doctopage:doctopage server/docker-entrypoint.sh   ./server/docker-entrypoint.sh
RUN chmod +x /app/server/docker-entrypoint.sh

# Data volume mount point for SQLite / JSON storage
RUN mkdir -p /app/data && chown doctopage:doctopage /app/data

USER doctopage

EXPOSE 3001

ENV NODE_ENV=production \
    PORT=3001 \
    DB_PATH=/app/data/pages.db

WORKDIR /app/server

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["/app/server/docker-entrypoint.sh"]
