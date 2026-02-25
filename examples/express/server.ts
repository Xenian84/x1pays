import express from 'express';
import { x402Middleware } from '@x1pay/middleware';

const app = express();

app.use(express.json());

// Protected route with x402 payment middleware
app.get('/premium/data',
  x402Middleware({
    facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
    network: 'x1-mainnet',
    payToAddress: process.env.PAYTO_ADDRESS || '',
    tokenMint: process.env.WXNT_MINT || '',
    amount: '1000',
    description: 'Premium API access'
  }),
  (req, res) => {
    // Payment settled successfully
    res.json({
      data: 'Premium content',
      payment: {
        txHash: res.locals.txHash,
        amount: res.locals.amount,
        simulated: res.locals.simulated
      }
    });
  }
);

app.listen(3000, () => {
  console.log('Express server running on port 3000');
});
