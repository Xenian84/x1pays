# X1Pays API Service Dockerfile
# Builds a production-ready container for the API registry

FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY packages/api/package.json ./packages/api/
COPY packages/middleware/package.json ./packages/middleware/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY packages/api ./packages/api
COPY packages/middleware ./packages/middleware
COPY packages/shared ./packages/shared

# Build the API
WORKDIR /app/packages/api
RUN pnpm build

# Production stage
FROM node:20-alpine

RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy built files and dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/api/dist ./packages/api/dist
COPY --from=base /app/packages/api/package.json ./packages/api/
COPY --from=base /app/packages/middleware ./packages/middleware
COPY --from=base /app/packages/shared ./packages/shared

WORKDIR /app/packages/api

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the API
CMD ["node", "dist/index.js"]
