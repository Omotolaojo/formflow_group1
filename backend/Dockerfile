# Stage 1: Build & Compile
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# ✅ Copy Prisma schema + migrations
COPY --from=builder /usr/src/app/prisma ./prisma

# ✅ Copy compiled app
COPY --from=builder /usr/src/app/dist ./dist

# ✅ Generate Prisma client (VERY IMPORTANT)
RUN npx prisma generate

USER node

EXPOSE 5000
ENV PORT=5000

# ✅ Run migrations BEFORE starting server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
