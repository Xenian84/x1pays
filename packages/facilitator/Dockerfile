# X1Pays Facilitator Service Dockerfile
# Builds a production-ready container for the payment facilitator

FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY packages/facilitator/package.json ./packages/facilitator/
COPY packages/client/package.json ./packages/client/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY packages/facilitator ./packages/facilitator
COPY packages/client ./packages/client
COPY packages/shared ./packages/shared

# Build the facilitator
WORKDIR /app/packages/facilitator
RUN pnpm build

# Production stage
FROM node:20-alpine

RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy built files and dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/facilitator/dist ./packages/facilitator/dist
COPY --from=base /app/packages/facilitator/package.json ./packages/facilitator/
COPY --from=base /app/packages/client ./packages/client
COPY --from=base /app/packages/shared ./packages/shared

WORKDIR /app/packages/facilitator

# Expose port (default 4000, can be overridden)
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 4000) + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the facilitator
CMD ["node", "dist/index.js"]
