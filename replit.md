# X1Pays - x402 Payment Protocol Implementation

## Project Overview
Complete x402 payment protocol implementation for X1 blockchain with 0% protocol fee model. Provides framework-specific middleware for Express, Hono, Fastify, and Next.js, plus client libraries for Axios and Fetch.

**Goal:** Achieve feature parity with PayAI.network's facilitator service while using wXNT for settlement and $XPY for governance.

## Recent Changes (December 2024)

### 2024-12-XX: Implemented All 7 Missing Features from PayAI
Added complete feature parity with PayAI's x402-solana repository:

1. **Schema Exports** - All Zod schemas exported from @x1pays/client for runtime validation
2. **Specific Error Types** - 8 detailed error classes (InvalidSignatureError, InsufficientFundsError, NetworkError, etc.)
3. **Network Constants** - Type-safe network validation (NETWORKS, X402_VERSION, FACILITATOR_URLS, etc.)
4. **Config Validation** - Zod schemas for middleware and client configuration
5. **Validation Helpers** - Runtime validation with comprehensive error messages
6. **Verification Helpers** - Cryptographic signature verification using Ed25519
7. **Type Guards** - Complete TypeScript type safety utilities

### 2024-12-XX: Fixed Website Documentation
- Fixed wrong package names in all documentation pages (ExpressQuickstart, AxiosClient, FetchClient)
- Removed non-existent `createX402Client` API references
- Added proper multi-accept payment handling in Python examples
- All examples now use correct package names: @x1pays/client, @x1pays/middleware

### 2024-12-XX: Multi-Accept Payment Support
- Implemented client-side lowest-price selection from multiple accept options
- Added maxPaymentAmount safety limit enforcement
- String-based BigInt utilities prevent floating-point precision issues

## Project Structure

```
├── packages/
│   ├── client/           # @x1pays/client - Client libraries
│   │   ├── src/
│   │   │   ├── errors.ts        # Specific error classes
│   │   │   ├── constants.ts     # Network constants
│   │   │   ├── validators.ts    # Validation helpers & type guards
│   │   │   ├── schemas.ts       # Zod validation schemas
│   │   │   ├── utils.ts         # wXNT conversion utilities
│   │   │   ├── types.ts         # TypeScript interfaces
│   │   │   ├── axios.ts         # Axios client implementation
│   │   │   └── fetch.ts         # Fetch client implementation
│   │   └── package.json
│   ├── middleware/       # @x1pays/middleware - Server middleware
│   │   ├── src/
│   │   │   ├── core.ts          # Core payment verification
│   │   │   ├── express.ts       # Express middleware
│   │   │   ├── hono.ts          # Hono middleware
│   │   │   ├── fastify.ts       # Fastify plugin
│   │   │   └── nextjs.ts        # Next.js handler
│   │   └── package.json
│   └── website/          # Documentation website
│       ├── src/pages/
│       │   ├── Home.tsx
│       │   ├── GettingStarted.tsx
│       │   ├── ExpressQuickstart.tsx
│       │   ├── HonoQuickstart.tsx
│       │   ├── AxiosClient.tsx
│       │   ├── FetchClient.tsx
│       │   └── Examples.tsx
│       └── package.json
```

## Technology Stack

### Client Package (@x1pays/client)
- **TypeScript** - Type-safe development
- **Zod** - Runtime validation schemas
- **bs58** - Base58 encoding/decoding
- **tweetnacl** - Ed25519 cryptographic verification
- **Axios** - HTTP client (peer dependency)

### Middleware Package (@x1pays/middleware)
- **TypeScript** - Type-safe development
- **Axios** - Facilitator communication
- **Express/Hono/Fastify/Next.js** - Framework integrations

### Website
- **React** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling

## Key Implementation Details

### 1. String-Based Arithmetic
All payment amounts use string-based BigInt arithmetic to avoid floating-point precision issues:
```typescript
wXNTToAtomicUnits("0.001") // "1000"
atomicUnitsToWXNT("1000")  // 0.001
```

### 2. Multi-Accept Support
Clients automatically choose the lowest-priced option from multiple accepts:
```typescript
const selectedAccept = accepts.reduce((lowest, current) => {
  const currentAmount = BigInt(current.maxAmountRequired || '0');
  const lowestAmount = BigInt(lowest.maxAmountRequired || '0');
  return currentAmount < lowestAmount ? current : lowest;
});
```

### 3. Cryptographic Verification
Payment signatures are verified using Ed25519:
```typescript
const isValid = nacl.sign.detached.verify(
  message,
  signatureBytes,
  buyerPublicKey
);
```

### 4. Error Handling
Specific error types for better debugging:
- `InvalidSignatureError` - Invalid payment signature
- `InsufficientFundsError` - Insufficient payment amount
- `NetworkError` - Facilitator connection failed
- `PaymentTimeoutError` - Settlement timeout
- `InvalidAmountError` - Invalid amount format
- `InvalidNetworkError` - Unsupported network
- `PaymentVerificationError` - Verification failed

## Exported Features

### From @x1pays/client

**Schemas:**
- `PaymentPayloadSchema` - Payment structure validation
- `PaymentRequirementSchema` - 402 response validation
- `PaymentResponseSchema` - Settlement response validation
- `MiddlewareConfigSchema` - Middleware config validation
- `ClientConfigSchema` - Client config validation

**Constants:**
- `NETWORKS` - { X1_MAINNET, X1_DEVNET }
- `PAYMENT_SCHEME` - 'x402'
- `X402_VERSION` - 1
- `FACILITATOR_URLS` - Default URLs
- `MAX_PAYMENT_AMOUNT` - Safety limit
- `X402_HEADERS` - Protocol headers

**Validators:**
- `validatePaymentPayload()` - Validate payment structure
- `validatePaymentRequirement()` - Validate 402 response
- `validatePaymentResponse()` - Validate settlement response
- `validateAmount()` - Validate atomic units
- `validateNetwork()` - Validate network string
- `verifyPaymentSignature()` - Cryptographic verification

**Type Guards:**
- `isWalletSigner()` - Check wallet interface
- `isValidPaymentPayload()` - Check payment structure
- `isValidPaymentRequirement()` - Check requirement structure
- `isValidPaymentResponse()` - Check response structure
- `isValidNetwork()` - Check network value
- `assertWalletSigner()` - Assert wallet type
- `assertValidNetwork()` - Assert network type

**Helpers:**
- `extractPaymentFromHeaders()` - Parse X-Payment header
- `extractPaymentRequirement()` - Parse X-Payment-Required header
- `signPayment()` - Sign payment with wallet
- `wXNTToAtomicUnits()` - Convert wXNT to atomic units
- `atomicUnitsToWXNT()` - Convert atomic units to wXNT
- `formatWXNT()` - Format as human-readable

**Errors:**
- `X402Error` - Base error class
- `InvalidSignatureError` - Signature errors
- `InsufficientFundsError` - Payment amount errors
- `NetworkError` - Connection errors
- `PaymentTimeoutError` - Timeout errors
- `InvalidAmountError` - Amount format errors
- `InvalidNetworkError` - Network errors
- `PaymentVerificationError` - Verification errors
- `InvalidConfigError` - Configuration errors

## Development

### Build All Packages
```bash
pnpm build
```

### Watch Mode (Client)
```bash
cd packages/client && pnpm dev
```

### Run Website
```bash
cd packages/website && pnpm dev
```

## User Preferences
- **Code Style:** TypeScript with strict typing
- **Architecture:** Monorepo with separate client/middleware/website packages
- **Payment Token:** wXNT (6 decimals)
- **Governance Token:** $XPY
- **Protocol Fee:** 0%
- **Network:** X1 blockchain (mainnet/devnet)

## Next Steps
1. ✅ Implement all 7 missing features from PayAI
2. ✅ Fix website documentation
3. ✅ Add cryptographic signature verification
4. 🔲 Add unit tests for signature verification
5. 🔲 Publish packages to npm
6. 🔲 Deploy facilitator service
7. 🔲 Launch production

## Security Considerations
- All payment signatures cryptographically verified using Ed25519
- String-based BigInt arithmetic prevents precision loss
- Zod runtime validation prevents invalid data
- Type guards ensure type safety at runtime
- Network errors properly handled and typed
- Timeouts configured for all facilitator requests

## Notes
- Always use string format for amounts in atomic units
- Maximum 6 decimal places for wXNT amounts
- Facilitator handles all blockchain interactions
- 0% protocol fee - merchants receive 100% of payments
- Multi-accept support allows price competition
