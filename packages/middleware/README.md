# @x1pays/middleware

x402 payment middleware for Express, Hono, Fastify, and Next.js. Automatically handles payment requirements, verification, and settlement for HTTP APIs.

## Installation

```bash
npm install @x1pays/middleware
# or
pnpm add @x1pays/middleware
```

## Quick Start

### Express

```typescript
import express from 'express';
import { x402Middleware } from '@x1pays/middleware';

const app = express();

app.get('/premium/data',
  x402Middleware({
    facilitatorUrl: 'http://localhost:4000',
    network: 'x1-mainnet',
    payToAddress: 'YOUR_WALLET_ADDRESS',
    tokenMint: 'wXNT_MINT_ADDRESS',
    amount: '1000'
  }),
  (req, res) => {
    res.json({ data: 'Premium content' });
  }
);
```

### Hono

```typescript
import { Hono } from 'hono';
import { x402 } from '@x1pays/middleware/hono';

const app = new Hono();

app.get('/premium/data',
  x402({
    facilitatorUrl: 'http://localhost:4000',
    network: 'x1-mainnet',
    payToAddress: 'YOUR_WALLET_ADDRESS',
    tokenMint: 'wXNT_MINT_ADDRESS',
    amount: '1000'
  }),
  (c) => c.json({ data: 'Premium content' })
);
```

### Fastify

```typescript
import Fastify from 'fastify';
import x402Plugin from '@x1pays/middleware/fastify';

const fastify = Fastify();

await fastify.register(x402Plugin, {
  facilitatorUrl: 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: 'YOUR_WALLET_ADDRESS',
  tokenMint: 'wXNT_MINT_ADDRESS',
  amount: '1000'
});

fastify.get('/premium/data', {
  preHandler: fastify.x402()
}, async (request) => {
  return { data: 'Premium content' };
});
```

### Next.js

```typescript
import { x402Handler } from '@x1pays/middleware/nextjs';

export default x402Handler({
  facilitatorUrl: 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: 'YOUR_WALLET_ADDRESS',
  tokenMint: 'wXNT_MINT_ADDRESS',
  amount: '1000',
  handler: async (req, res) => {
    res.status(200).json({ data: 'Premium content' });
  }
});
```

## Configuration

All middleware accepts the following configuration:

```typescript
interface X402Config {
  facilitatorUrl: string;        // URL of x402 facilitator service
  network: string;               // 'x1-mainnet' or 'x1-testnet'
  payToAddress: string;          // Merchant wallet address
  tokenMint: string;             // Token mint address (wXNT)
  amount?: string;               // Static payment amount
  getDynamicAmount?: (req) => string | Promise<string>;  // Dynamic pricing
  description?: string;          // Payment description
  resource?: string;             // Resource identifier
}
```

## Features

- 🔒 Automatic payment verification with facilitator
- ⚡ On-chain settlement handling
- 🔄 Retry logic with exponential backoff
- 📊 Payment details stored in response locals/context
- 🛡️ Built-in validation for network, amount, and signatures
- 🌐 0% protocol fees - 100% to merchants

## How It Works

1. **Client makes request** → Middleware returns 402 Payment Required
2. **Client signs payment** → Sends X-Payment header
3. **Middleware verifies** → Calls facilitator to verify signature
4. **Middleware settles** → Facilitator settles payment on-chain
5. **Request succeeds** → Handler executes with payment proof

## License

MIT
