import type { NextApiRequest, NextApiResponse } from 'next';
import type { X402Config, PaymentPayload } from './types.js';
import { createPaymentRequirement, validatePayment, verifyPayment, settlePayment, X402Error } from './core.js';

export interface X402HandlerConfig extends X402Config {
  handler: (
    req: NextApiRequest & { x402Payment?: { txHash: string; amount: string; simulated: boolean } },
    res: NextApiResponse
  ) => Promise<void> | void;
}

export function x402Handler(config: X402HandlerConfig) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const paymentHeader = req.headers['x-payment'];

    // No payment provided - return 402 with payment requirements
    if (!paymentHeader) {
      const amount = config.getDynamicAmount
        ? await config.getDynamicAmount(req)
        : config.amount;

      const requirement = createPaymentRequirement(config, req.url || '/', amount);

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

      // Attach payment to request object
      (req as any).x402Payment = {
        txHash: settlement.txHash,
        amount: settlement.amount,
        simulated: settlement.simulated
      };

      // Add payment response header
      res.setHeader('X-Payment-Response', JSON.stringify({
        txHash: settlement.txHash,
        amount: settlement.amount,
        simulated: settlement.simulated
      }));

      // Call the actual handler
      return await config.handler(req as any, res);
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

// Export as default and named export
export default x402Handler;
