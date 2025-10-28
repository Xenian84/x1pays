import type { Context, MiddlewareHandler } from 'hono';
import type { X402Config, PaymentPayload } from './types.js';
import { createPaymentRequirement, validatePayment, verifyPayment, settlePayment, X402Error } from './core.js';

export function x402(config: X402Config): MiddlewareHandler {
  return async (c: Context, next) => {
    const paymentHeader = c.req.header('X-Payment');

    // No payment provided - return 402 with payment requirements
    if (!paymentHeader) {
      const amount = config.getDynamicAmount
        ? await config.getDynamicAmount(c.req)
        : config.amount;

      const requirement = createPaymentRequirement(config, c.req.path, amount);

      c.header('Cache-Control', 'no-store');
      c.header('X-Payment-Required', JSON.stringify(requirement));
      return c.json(requirement, 402);
    }

    try {
      // Parse payment from header
      const payment: PaymentPayload = JSON.parse(paymentHeader);

      // Get required amount (dynamic or static)
      const requiredAmount = config.getDynamicAmount
        ? await config.getDynamicAmount(c.req)
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

      // Store settlement details in context for access in route handler
      c.set('txHash', settlement.txHash);
      c.set('amount', settlement.amount);
      c.set('network', settlement.network);

      // Add payment response header
      c.header('X-Payment-Response', JSON.stringify({
        txHash: settlement.txHash,
        amount: settlement.amount,
        network: settlement.network
      }));

      await next();
    } catch (error: any) {
      if (error instanceof X402Error) {
        return c.json({
          error: error.message,
          details: error.details
        }, error.statusCode as 402);
      }

      return c.json({
        error: 'Invalid or missing payment',
        details: error.message
      }, 402);
    }
  };
}

// Export as default and named export
export default x402;
