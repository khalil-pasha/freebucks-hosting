FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev for building)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production Image
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install prod dependencies
COPY package*.json ./
RUN npm install --production

# Copy compiled source & Prisma from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5000

# Start script
CMD ["npm", "start"]
