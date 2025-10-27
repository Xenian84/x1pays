# X1Pays - x402 Payment Protocol Implementation

## Project Overview
Complete x402 payment protocol implementation for X1 blockchain with 0% protocol fee model. Provides framework-specific middleware for Express, Hono, Fastify, and Next.js, plus client libraries for Axios and Fetch.

**Goal:** Achieve feature parity with PayAI.network's facilitator service while using wXNT for settlement and $XPY for governance.

## Recent Changes (October 2025)

### 2025-10-27: NEW x402-x1-react Package for X1 Blockchain
Created complete React component library for X1 blockchain paywall integration:

**Package: x402-x1-react (v0.1.0-beta.1)**
- **Drop-in React Components** - `<X402Paywall>` component for easy integration
- **X1 Blockchain Native** - Built specifically for X1 blockchain using Solana wallet adapter
- **Multi-Wallet Support** - Backpack, Phantom, Solflare via Solana wallet adapter
- **Proper x402 Protocol** - Full implementation with facilitator /verify and /settle endpoints
- **Material-UI Styled** - MUI components with X1Pays dark theme (midnight blue + cyan/lime)
- **TypeScript** - Full type safety with exported types and utilities
- **LocalStorage Persistence** - Paywall unlock state persists across page reloads
- **USD to Atomic Units** - Proper 6-decimal conversion for wXNT/USDC payments

**Technical Implementation:**
- `useX402Payment` hook with internal useWallet() call (no wallet prop required)
- `signPayment()` utility using wallet.signMessage + bs58 encoding
- `verifyPayment()` and `settlePayment()` helpers for facilitator integration
- Payment flow: sign → verify → settle → unlock (matches x402 protocol)
- Build: 241KB bundle, zero TypeScript errors

**Documentation:**
- Complete README with setup, API reference, and examples
- Added React example to website Examples page
- Three usage examples: basic, custom styling, validation

### 2025-10-27: Complete MUI + SORA Font Redesign
Redesigned documentation website with modern Material-UI components, SORA typography, and custom dark theme:

**Design System:**
- **MUI v7.3.4** - Modern component library with proper Grid2 API (`size` prop)
- **SORA Font** - Professional Google Font loaded from CDN for clean typography
- **Custom Dark Theme** - Midnight blue (#0A1929) with electric cyan (#00E5FF) and lime (#76FF03) accents
- **Hybrid Approach** - MUI components + Tailwind utilities for spacing/responsive design

**UI Components:**
- Replaced all Lucide icons with Material-UI icons across entire website
- MUI AppBar for clean, professional navigation
- MUI Cards, Typography, Buttons, and Paper components
- Custom gradient text effects on hero section
- Asymmetric layouts for modern, hand-crafted aesthetic

**Technical Implementation:**
- ThemeProvider wraps entire app with custom midnight theme
- SORA font integrated via Google Fonts and applied through MUI theme
- Proper MUI v7 Grid API with `size` prop for responsive layouts
- Zero console errors, production build passes TypeScript + Vite validation
- All dependencies properly installed: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, @mui/system

**Result:** Professional, modern UI that avoids AI-generated aesthetic while maintaining full functionality.

### 2024-12-XX: Comprehensive Codebase Audit for Parity
Audited and updated ALL code (facilitator, documentation, examples) to use recent improvements:

**Facilitator Service:**
- Now uses PaymentPayloadSchema from @x1pays/client (removed local schema duplication)
- Throws specific error types: InvalidSignatureError, InvalidNetworkError
- Uses constants: X402_VERSION, NETWORKS.X1_MAINNET
- Returns structured error responses with error name, message, and details

**Documentation:**
- Created comprehensive Advanced Usage page (/docs/advanced) covering:
  - Constants usage (NETWORKS, FACILITATOR_URLS, X402_VERSION, etc.)
  - Validation helpers (validatePaymentPayload, verifyPaymentSignature, etc.)
  - Error handling with all 8 specific error types
  - Type guards for runtime type safety
  - Zod schemas for custom validation
  - Production-ready complete example
  - Best practices DO/DON'T section

**Client README:**
- Added comprehensive documentation for all 40+ new exports
- Error handling section with all specific error types
- Constants, validators, type guards, and schemas sections
- Complete exports reference organized by category

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
│   ├── x402-x1-react/    # x402-x1-react - React components for X1
│   │   ├── src/
│   │   │   ├── components/      # X402Paywall component
│   │   │   ├── hooks/           # useX402Payment hook
│   │   │   ├── utils/           # x402 protocol utilities
│   │   │   └── types/           # TypeScript types
│   │   ├── examples/            # Usage examples
│   │   └── package.json
│   └── website/          # Documentation website
│       ├── src/pages/
│       │   ├── Home.tsx
│       │   ├── GettingStarted.tsx
│       │   ├── ExpressQuickstart.tsx
│       │   ├── HonoQuickstart.tsx
│       │   ├── AxiosClient.tsx
│       │   ├── FetchClient.tsx
│       │   └── Examples.tsx     # Now includes React/X1 example
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
- **Material-UI v7** - Component library with custom dark theme
- **SORA Font** - Professional Google Font typography
- **TailwindCSS** - Utility-first styling (hybrid with MUI)
- **Emotion** - CSS-in-JS for MUI styling

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
