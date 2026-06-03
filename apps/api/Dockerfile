FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/
RUN npm install --legacy-peer-deps
RUN npm install prisma@^5.22.0 @prisma/client@^5.22.0 --legacy-peer-deps
COPY apps/api ./apps/api
RUN rm -f prisma.config.ts && npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN cd apps/api && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
RUN npx prisma generate --schema=prisma/schema.prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
