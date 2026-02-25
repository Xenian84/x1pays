# @x1pay/middleware

Express middleware for x402 paywalled API endpoints on X1 blockchain.

## Install

```bash
npm install @x1pay/middleware
```

## Usage (Express)

```typescript
import express from 'express'
import { x402 } from '@x1pay/middleware'

const app = express()

app.use('/api/premium', x402({
  payTo: 'YOUR_WALLET_ADDRESS',
  amount: '100000',
  tokenMint: 'USDC.x',
  network: 'x1-mainnet',
  facilitatorUrl: 'https://x1pays.xyz/facilitator-alpha-mainnet',
}))

app.get('/api/premium/data', (req, res) => {
  res.json({ data: 'premium content' })
})

app.listen(3000)
```

Clients without a valid payment header receive HTTP 402 with payment terms. Clients with `@x1pay/sdk` pay automatically.

## License

MIT
