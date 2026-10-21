# Multi-stage build. Targets:
#   runner   (default) the dashboard server: node server.js on :3000
#   migrator one-shot job that applies drizzle/*.sql, then exits

FROM docker.io/library/node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

FROM deps AS migrator
COPY drizzle ./drizzle
COPY scripts ./scripts
USER node
CMD ["node", "scripts/migrate.mjs"]

FROM docker.io/library/node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# Mount point for the uploads volume; created here so the volume starts owned by `node`.
RUN mkdir -p /app/uploads && chown node:node /app/uploads
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
