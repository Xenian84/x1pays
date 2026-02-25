import { Router, type Router as RouterType } from 'express';

const router: RouterType = Router();

router.get('/test', (req, res) => {
  // Get settlement info from middleware (stored in res.locals)
  const txHash = res.locals.txHash;
  const amount = res.locals.amount;
  const network = res.locals.network;
  
  res.json({
    message: '🎉 x402 Echo Merchant - Payment Successful!',
    refundPolicy: '100% refund guaranteed',
    serviceFees: 'Zero - X1Pays covers all gas fees',
    // Include settlement info in response body - ALWAYS include payment even if txHash is undefined
    payment: {
      txHash: txHash || null,
      amount: amount || null,
      network: network || null
    },
    data: {
      echo: 'Payment received and verified',
      timestamp: new Date().toISOString(),
      network: network || 'X1 Testnet',
      refundStatus: 'Automatic refund initiated',
      totalReceived: '100%',
      settlement: 'Instant',
      txHash: txHash || null
    }
  });
});

export default router;
