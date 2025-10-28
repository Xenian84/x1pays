import type { Request, Response, NextFunction } from 'express';
import type { X402Config, PaymentPayload } from './types.js';
import { createPaymentRequirement, validatePayment, verifyPayment, settlePayment, X402Error } from './core.js';

export function x402Middleware(config: X402Config) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentHeader = req.headers['x-payment'];

    // No payment provided - return 402 with payment requirements
    if (!paymentHeader) {
      const amount = config.getDynamicAmount 
        ? await config.getDynamicAmount(req)
        : config.amount;

      const requirement = createPaymentRequirement(config, req.originalUrl, amount);
      
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Payment-Required', JSON.stringify(requirement));
      return res.status(402).json(requirement);
    }

    try {
      // Parse payment from header
      const payment: PaymentPayload = JSON.parse(String(paymentHeader));

      // Get required amount (dynamic or static)
      const requiredAmount = config.getDynamicAmount
        ? await config.getDynamicAmount(req)
        : config.amount;

      // Validate payment matches configuration
      validatePayment(payment, config, requiredAmount);

      // Verify payment signature with facilitator
      const verifyResult = await verifyPayment(config.facilitatorUrl, payment);
      
      if (!verifyResult.valid) {
        throw new X402Error('Payment verification failed', 402, verifyResult);
      }

      // Settle payment on blockchain
      const settlement = await settlePayment(config.facilitatorUrl, payment);

      // Store settlement details in res.locals for access in route handler
      res.locals.txHash = settlement.txHash;
      res.locals.amount = settlement.amount;
      res.locals.network = settlement.network;

      // Add payment response header
      res.setHeader('X-Payment-Response', JSON.stringify({
        txHash: settlement.txHash,
        amount: settlement.amount,
        network: settlement.network
      }));

      return next();
    } catch (error: any) {
      if (error instanceof X402Error) {
        return res.status(error.statusCode).json({
          error: error.message,
          details: error.details
        });
      }

      return res.status(402).json({
        error: 'Invalid or missing payment',
        details: error.message
      });
    }
  };
}

// Export as default and named export for compatibility
export default x402Middleware;
