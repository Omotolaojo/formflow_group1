# ============================================================
# BUILD STAGE
# ============================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy TypeScript configuration
COPY tsconfig.json ./
COPY tsconfig.seed.json ./

# Copy Prisma
COPY prisma ./prisma

# Copy application source
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Build backend and seed
RUN npm run build:all


# ============================================================
# PRODUCTION STAGE
# ============================================================

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy compiled backend
COPY --from=builder /app/dist ./dist

# Copy compiled seed
COPY --from=builder /app/dist-seed ./dist-seed

# Copy Prisma schema
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

# Copy Prisma migrations
COPY --from=builder /app/prisma/migrations ./prisma/migrations

# Copy Prisma generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Run migrations → create admin → start API
CMD ["sh", "-c", "set -e && npx prisma migrate deploy && node dist-seed/create_admin.js && node dist/server.js"]