import { x402Handler } from '@x1pays/middleware/nextjs';

export default x402Handler({
  facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.PAYTO_ADDRESS || '',
  tokenMint: process.env.WXNT_MINT || '',
  amount: '1000',
  description: 'Premium API access',
  handler: async (req, res) => {
    // Payment settled successfully
    res.status(200).json({
      data: 'Premium content',
      payment: req.x402Payment
    });
  }
});
