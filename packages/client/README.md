# @x1pay/client

x402 payment client libraries for Axios and Fetch. Automatically handles 402 Payment Required responses, signs payments, and retries with payment proof.

## Installation

```bash
npm install @x1pay/client
# or
pnpm add @x1pay/client
```

## Quick Start

### Axios Client

```typescript
import { x402Client } from '@x1pay/client/axios';
import { Keypair } from '@solana/web3.js';

const wallet = Keypair.fromSecretKey(/* your secret key */);

const response = await x402Client({
  method: 'GET',
  url: 'http://localhost:3000/premium/data',
  wallet: wallet,
  retry: {
    maxRetries: 3,
    retryDelay: 1000
  }
});

console.log(response.data);      // API response
console.log(response.payment);   // Payment details
```

### Fetch Client

```typescript
import { fetchX402JSON } from '@x1pay/client/fetch';
import { Keypair } from '@solana/web3.js';

const wallet = Keypair.fromSecretKey(/* your secret key */);

const response = await fetchX402JSON('http://localhost:3000/premium/data', {
  method: 'GET',
  wallet: wallet,
  paymentTimeout: 10000
});

console.log(response.data);      // API response
console.log(response.payment);   // Payment details
```

## API Reference

### Axios Client

```typescript
x402Client(config: X402AxiosConfig): Promise<X402Response>

interface X402AxiosConfig extends AxiosRequestConfig {
  wallet: WalletSigner;
  retry?: {
    maxRetries?: number;      // Default: 3
    retryDelay?: number;      // Default: 1000ms
    retryOn?: number[];       // Default: [408, 429, 500, 502, 503, 504]
  };
  paymentTimeout?: number;    // Default: 10000ms
}
```

### Fetch Client

```typescript
fetchX402(url: string, config: X402FetchConfig): Promise<Response>
fetchX402JSON(url: string, config: X402FetchConfig): Promise<X402Response>

interface X402FetchConfig extends RequestInit {
  wallet: WalletSigner;
  paymentTimeout?: number;    // Default: 10000ms
}
```

### Response Format

```typescript
interface X402Response<T = any> {
  data: T;                    // API response data
  payment?: {
    txHash: string;           // Transaction hash
    amount: string;           // Payment amount
    simulated: boolean;       // Whether transaction was simulated
  };
  headers: Record<string, string>;
}
```

## How It Works

1. **Initial request** → Returns 402 Payment Required with payment details
2. **Extract requirements** → Parses X-Payment-Required header
3. **Sign payment** → Uses wallet to sign payment message
4. **Verify & settle** → Calls facilitator to verify signature and settle on-chain
5. **Retry with proof** → Sends original request with X-Payment header
6. **Return response** → Includes both data and payment details

## Wallet Support

The client supports any wallet implementing:

```typescript
interface WalletSigner {
  publicKey: { toBase58(): string } | { toString(): string };
  signMessage?(message: Uint8Array): Promise<Uint8Array>;
  sign?(message: Uint8Array): Uint8Array;
  secretKey?: Uint8Array;
}
```

Compatible with:
- `@solana/web3.js` Keypair
- Phantom wallet adapter
- Solflare wallet adapter
- Any Solana wallet adapter

## Features

- 🔐 Automatic payment signing with ed25519
- 🔄 Built-in retry logic with configurable backoff
- 🛡️ Signature verification via facilitator
- ⚡ On-chain settlement handling
- 📊 Payment proof in response
- 🌐 Works with any x402-compatible API

## Error Handling

```typescript
import { 
  InvalidSignatureError,
  InsufficientFundsError,
  NetworkError,
  PaymentTimeoutError,
  InvalidAmountError,
  InvalidNetworkError,
  PaymentVerificationError
} from '@x1pay/client'

try {
  const response = await x402Client({ ... });
} catch (error) {
  if (error instanceof InvalidSignatureError) {
    console.error('Signature validation failed:', error.message)
  } else if (error instanceof InsufficientFundsError) {
    console.error('Insufficient funds:', error.message)
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message)
  } else if (error instanceof PaymentTimeoutError) {
    console.error('Payment timed out:', error.message)
  } else if (error instanceof InvalidAmountError) {
    console.error('Invalid amount:', error.message)
  } else if (error instanceof InvalidNetworkError) {
    console.error('Invalid network:', error.message)
  } else if (error instanceof PaymentVerificationError) {
    console.error('Verification failed:', error.message)
  }
}
```

## Constants

Use type-safe constants instead of hardcoding values:

```typescript
import { 
  NETWORKS,
  FACILITATOR_URLS,
  X402_VERSION,
  PAYMENT_SCHEME,
  MAX_PAYMENT_AMOUNT,
  X402_HEADERS
} from '@x1pay/client'

// Network constants
const network = NETWORKS.X1_MAINNET  // 'x1-mainnet'
const testNetwork = NETWORKS.X1_TESTNET  // 'x1-testnet'

// Facilitator URLs
const facilitatorUrl = FACILITATOR_URLS.MAINNET
// 'https://facilitator.x1pays.xyz'

// Protocol version
console.log(X402_VERSION)  // 1
console.log(PAYMENT_SCHEME)  // 'x402'
console.log(MAX_PAYMENT_AMOUNT)  // 1000000000

// Header names
console.log(X402_HEADERS.PAYMENT)  // 'X-Payment'
console.log(X402_HEADERS.PAYMENT_REQUIRED)  // 'X-Payment-Required'
console.log(X402_HEADERS.PAYMENT_RESPONSE)  // 'X-Payment-Response'
```

## Validation Helpers

Use built-in validation functions for runtime validation:

```typescript
import { 
  validatePaymentPayload,
  validatePaymentRequirement,
  validatePaymentResponse,
  validateAmount,
  validateNetwork,
  verifyPaymentSignature
} from '@x1pay/client'

// Validate payment structure
validatePaymentPayload(paymentData)  // Throws if invalid

// Validate 402 response
const requirement = validatePaymentRequirement(data)

// Validate atomic units (integer strings)
validateAmount('1000')  // ✓ Valid
validateAmount('1000.5')  // ✗ Throws InvalidAmountError

// Validate network
validateNetwork('x1-mainnet')  // ✓ Valid
validateNetwork('ethereum')  // ✗ Throws InvalidNetworkError

// Cryptographically verify payment signature
const isValid = await verifyPaymentSignature(payment)
```

## Type Guards

Use type guards for runtime type checking:

```typescript
import { 
  isWalletSigner,
  isValidPaymentPayload,
  isValidPaymentRequirement,
  isValidPaymentResponse,
  isValidNetwork,
  assertWalletSigner,
  assertValidNetwork
} from '@x1pay/client'

// Check if object is a valid wallet
if (isWalletSigner(wallet)) {
  const signature = await wallet.signMessage(message)
}

// Validate payment data
if (isValidPaymentPayload(data)) {
  console.log(data.buyer, data.amount, data.signature)
}

// Validate 402 response
if (isValidPaymentRequirement(response)) {
  response.accepts.forEach(accept => {
    console.log(accept.payTo, accept.maxAmountRequired)
  })
}

// Assertion helpers (throw if invalid)
assertWalletSigner(wallet)  // Throws if not a wallet
assertValidNetwork(network)  // Throws InvalidNetworkError
```

## Zod Schemas

Import Zod schemas for custom validation:

```typescript
import { 
  PaymentPayloadSchema,
  PaymentRequirementSchema,
  PaymentResponseSchema,
  MiddlewareConfigSchema,
  ClientConfigSchema
} from '@x1pay/client'

// Parse and validate
const result = PaymentPayloadSchema.safeParse(data)
if (result.success) {
  const payment = result.data
}

// Or throw on error
const payment = PaymentPayloadSchema.parse(data)
```

## Complete Exports

**Types:**
- `PaymentPayload`, `PaymentRequirement`, `PaymentResponse`
- `WalletSigner`, `X402Config`, `Network`
- `X402AxiosConfig`, `X402FetchConfig`, `X402Response`

**Constants:**
- `NETWORKS` - Network identifiers
- `FACILITATOR_URLS` - Default facilitator URLs
- `X402_VERSION` - Protocol version
- `PAYMENT_SCHEME` - Payment scheme identifier
- `MAX_PAYMENT_AMOUNT` - Maximum payment limit
- `X402_HEADERS` - Header name constants

**Schemas (Zod):**
- `PaymentPayloadSchema`
- `PaymentRequirementSchema`
- `PaymentResponseSchema`
- `MiddlewareConfigSchema`
- `ClientConfigSchema`

**Validators:**
- `validatePaymentPayload()`
- `validatePaymentRequirement()`
- `validatePaymentResponse()`
- `validateAmount()`
- `validateNetwork()`
- `verifyPaymentSignature()`
- `extractPaymentFromHeaders()`
- `extractPaymentRequirement()`

**Type Guards:**
- `isWalletSigner()`
- `isValidPaymentPayload()`
- `isValidPaymentRequirement()`
- `isValidPaymentResponse()`
- `isValidNetwork()`
- `assertWalletSigner()`
- `assertValidNetwork()`

**Errors:**
- `X402Error` (base class)
- `InvalidSignatureError`
- `InsufficientFundsError`
- `NetworkError`
- `PaymentTimeoutError`
- `InvalidAmountError`
- `InvalidNetworkError`
- `PaymentVerificationError`
- `InvalidConfigError`

**Utilities:**
- `signPayment()`
- `wXNTToAtomicUnits()`
- `atomicUnitsToWXNT()`
- `formatWXNT()`

**Clients:**
- `x402Client` (Axios)
- `fetchX402`, `fetchX402JSON` (Fetch)

## License

MIT
