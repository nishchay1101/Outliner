# ══════════════════════════════════════════════════════════════════════════════
# Stage 1 — Build React app with Vite
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /build

# shared/types is imported by client as ../../../shared/types
COPY shared/ ./shared/
COPY client/  ./client/

WORKDIR /build/client
RUN npm install
RUN npm run build
# Output: /build/client/dist/

# ══════════════════════════════════════════════════════════════════════════════
# Stage 2 — Serve with nginx
# ══════════════════════════════════════════════════════════════════════════════
FROM nginx:1.27-alpine AS production

# Static assets
COPY --from=builder /build/client/dist /usr/share/nginx/html

# Our config replaces the default completely
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
