# ---------- deps + build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# deps
COPY package.json package-lock.json* ./
RUN npm ci

# sources
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# build
RUN npm run build
# generate prisma client (au cas où)
RUN npx prisma generate

# ---------- runtime ----------
FROM node:20-alpine
WORKDIR /app

# on garde les node_modules du builder (incluant prisma CLI)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY openapi.yaml ./openapi.yaml

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Migrations puis lancement
CMD sh -c "npx prisma migrate deploy && node dist/server.js"
