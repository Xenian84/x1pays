# Changelog

All notable changes to X1Pays will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-11-05

### 🎉 Improved

#### Blockchain Memo Format Enhancement
- **Settlement Memos**: Updated from `x402v1:exact:{randomId}:{resource}:{timestamp}` to `x402v1:settle:{shortId}:{buyer}:{resource}:{timestamp}`
  - Added buyer address reference (first 8 chars)
  - Changed "exact" to "settle" for clarity
  - Better structured for forensic analysis

- **Refund Memos**: Updated from `x402v1-refund:{refundId}:unknown:{timestamp}` to `x402v1:refund:{refundId}:{originalTxHash}:{buyer}:{timestamp}`
  - Now includes original settlement transaction hash (first 16 chars)
  - Links refunds to original payments on-chain
  - Added buyer address reference
  - Consistent colon-delimited format

#### Benefits
- ✅ **Traceable**: Refunds now link to original payments via tx hash
- ✅ **Searchable**: Can find transactions on explorer by partial hash
- ✅ **Meaningful**: Every field has real blockchain significance
- ✅ **Forensic**: Full audit trail from settlement → refund
- ✅ **Backwards Compatible**: Still parses old memo formats

### 🔧 Fixed

#### Refund Routing
- Fixed refund requests to use the **same facilitator** that processed the original payment
- Previously, refunds were always routed to Alpha facilitator (port 4000) regardless of which facilitator processed the payment
- Now refunds correctly go to the selected facilitator (Alpha, Beta, or Gamma)

### 📚 Added

- Comprehensive README.md for `@x1pay/sdk` package
- Full API documentation with examples
- Security best practices guide
- Development and deployment instructions

### 🔄 Changed

- `packages/facilitator/src/index.ts`: Updated settlement and refund memo generation
- `packages/website/src/pages/Echo.tsx`: Now passes original transaction hash to refund requests
- `packages/website/src/components/TransactionHistory.tsx`: Enhanced memo parser to handle both new and legacy formats

### 📦 SDK Packages Status

All SDK packages remain **100% backwards compatible**:
- `@x1pay/client` v0.1.0 - No changes required
- `@x1pay/sdk` v0.1.0 - No changes required  
- `@x1pay/middleware` v0.1.0 - No changes required
- `@x1pay/react` v0.1.0 - No changes required

Memo format changes are internal to facilitator blockchain transactions and transparent to SDK users.

---

## [0.1.0] - 2025-11-04

### 🎉 Initial Release

- x402 payment protocol implementation on X1 blockchain
- Facilitator network (Alpha, Beta, Gamma)
- Client libraries for Axios and Fetch
- Middleware for Express, Hono, Fastify, Next.js
- React hooks and components
- TypeScript SDK
- Demo website and API
- Full x402 protocol support:
  - Off-chain payment signing
  - Facilitator-based settlement
  - Bidirectional refunds
  - Zero gas fees for users
  - Instant settlement with proofs

### 📦 Packages

- `@x1pay/client` - HTTP client libraries
- `@x1pay/sdk` - TypeScript SDK
- `@x1pay/middleware` - Server middleware
- `@x1pay/react` - React components
- `@x1pay/facilitator` - Facilitator service
- `@x1pay/api` - API server
- `@x1pay/website` - Demo website
- `@x1pay/shared` - Shared utilities

---

## Links

- [GitHub Repository](https://github.com/yourusername/x1pays)
- [Documentation](https://docs.x1pays.com)
- [Website](https://x1pays.com)

