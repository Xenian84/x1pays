/**
 * X1Pays Express Middleware Example
 * 
 * This example shows how to protect your Express API endpoints
 * with x402 payment requirements using @x1pay/middleware.
 */

import express from 'express';
import { x402Middleware } from '@x1pay/middleware/express';

const app = express();
app.use(express.json());

// Configure x402 middleware
const paymentConfig = {
  facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
  merchantAddress: process.env.MERCHANT_ADDRESS || 'YourMerchantAddress',
  wxntMint: process.env.WXNT_MINT || 'wXNT_Mint_Address',
  network: process.env.NETWORK || 'x1-testnet',
  
  // Payment required for these endpoints
  protectedPaths: [
    '/api/premium/*',
    '/api/data/*'
  ],
  
  // Amount in lamports (0.000001 wXNT = 1000 lamports)
  amountRequired: 1000
};

// Apply x402 middleware
app.use(x402Middleware(paymentConfig));

// Public endpoint (no payment required)
app.get('/api/public', (req, res) => {
  res.json({
    message: 'This endpoint is free!',
    timestamp: Date.now()
  });
});

// Protected endpoint (payment required)
app.get('/api/premium/data', (req, res) => {
  // Payment info is available in req.x402
  const { txHash, buyer, amount } = req.x402 || {};
  
  res.json({
    message: 'Premium data access granted!',
    data: {
      secret: 'This data costs 0.000001 wXNT',
      timestamp: Date.now(),
      value: Math.random() * 1000
    },
    payment: {
      txHash,
      buyer,
      amount
    }
  });
});

// Another protected endpoint
app.get('/api/data/analytics', (req, res) => {
  res.json({
    analytics: {
      users: 1337,
      revenue: '42.0 wXNT',
      txCount: 100
    },
    payment: req.x402
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💰 x402 payments enabled for ${paymentConfig.protectedPaths.length} path(s)`);
  console.log(`📡 Network: ${paymentConfig.network}`);
  console.log(`💵 Price: ${paymentConfig.amountRequired} lamports (0.000001 wXNT)`);
});

