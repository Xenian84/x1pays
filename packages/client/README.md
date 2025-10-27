# @x1pays/client

x402 payment client libraries for Axios and Fetch. Automatically handles 402 Payment Required responses, signs payments, and retries with payment proof.

## Installation

```bash
npm install @x1pays/client
# or
pnpm add @x1pays/client
```

## Quick Start

### Axios Client

```typescript
import { x402Client } from '@x1pays/client/axios';
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
import { fetchX402JSON } from '@x1pays/client/fetch';
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
try {
  const response = await x402Client({ ... });
} catch (error) {
  if (error instanceof X402Error) {
    console.error(error.statusCode);  // 402, 500, etc.
    console.error(error.message);     // Error description
    console.error(error.details);     // Additional details
  }
}
```

## License

MIT
