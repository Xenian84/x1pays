# X1Pays Website Dockerfile
# Builds a production-ready container for the documentation website

FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY packages/website/package.json ./packages/website/
COPY packages/client/package.json ./packages/client/
COPY packages/x402-x1-react/package.json ./packages/x402-x1-react/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/website ./packages/website
COPY packages/client ./packages/client
COPY packages/x402-x1-react ./packages/x402-x1-react

# Build the website
WORKDIR /app/packages/website
RUN pnpm extract-docs && pnpm build

# Production stage - use nginx to serve static files
FROM nginx:alpine

# Copy built files to nginx
COPY --from=base /app/packages/website/dist /usr/share/nginx/html

# Copy custom nginx config
COPY packages/website/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

