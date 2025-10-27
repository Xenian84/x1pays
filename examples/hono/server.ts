import { Hono } from 'hono';
import { x402 } from '@x1pays/middleware/hono';

const app = new Hono();

// Protected route with x402 payment middleware
app.get('/premium/data',
  x402({
    facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
    network: 'x1-mainnet',
    payToAddress: process.env.PAYTO_ADDRESS || '',
    tokenMint: process.env.WXNT_MINT || '',
    amount: '1000',
    description: 'Premium API access'
  }),
  (c) => {
    // Payment settled successfully
    return c.json({
      data: 'Premium content',
      payment: {
        txHash: c.get('txHash'),
        amount: c.get('amount'),
        simulated: c.get('simulated')
      }
    });
  }
);

export default app;
