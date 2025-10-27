import { Router, type Router as RouterType } from 'express';

const router: RouterType = Router();

router.get('/test', (_req, res) => {
  res.json({
    message: '🎉 x402 Echo Merchant - Payment Successful!',
    refundPolicy: '100% refund guaranteed',
    serviceFees: 'Zero - X1Pays covers all gas fees',
    data: {
      echo: 'Payment received and verified',
      timestamp: new Date().toISOString(),
      network: 'X1 Mainnet',
      refundStatus: 'Automatic refund initiated',
      totalReceived: '100%',
      settlement: 'Instant'
    }
  });
});

export default router;
