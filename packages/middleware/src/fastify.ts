import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import type { X402Config, PaymentPayload } from './types.js';
import { createPaymentRequirement, validatePayment, verifyPayment, settlePayment, X402Error } from './core.js';

declare module 'fastify' {
  interface FastifyRequest {
    x402Payment?: {
      txHash: string;
      amount: string;
      network: string;
    };
  }

  interface FastifyInstance {
    x402: (config?: Partial<X402Config>) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export interface X402PluginOptions extends X402Config {}

const x402Plugin: FastifyPluginAsync<X402PluginOptions> = async (fastify, options) => {
  // Create base config from plugin options
  const baseConfig: X402Config = {
    facilitatorUrl: options.facilitatorUrl,
    network: options.network,
    payToAddress: options.payToAddress,
    tokenMint: options.tokenMint,
    amount: options.amount,
    getDynamicAmount: options.getDynamicAmount,
    description: options.description,
    resource: options.resource
  };

  // Decorate fastify instance with x402 function
  fastify.decorate('x402', (configOverride?: Partial<X402Config>) => {
    const config = { ...baseConfig, ...configOverride };

    return async (request: FastifyRequest, reply: FastifyReply) => {
      const paymentHeader = request.headers['x-payment'];

      // No payment provided - return 402 with payment requirements
      if (!paymentHeader) {
        const amount = config.getDynamicAmount
          ? await config.getDynamicAmount(request)
          : config.amount;

        const requirement = createPaymentRequirement(config, request.url, amount);

        reply.header('Cache-Control', 'no-store');
        reply.header('X-Payment-Required', JSON.stringify(requirement));
        return reply.code(402).send(requirement);
      }

      try {
        // Parse payment from header
        const payment: PaymentPayload = JSON.parse(String(paymentHeader));

        // Get required amount (dynamic or static)
        const requiredAmount = config.getDynamicAmount
          ? await config.getDynamicAmount(request)
          : config.amount;

        // Validate payment matches configuration
        validatePayment(payment, config, requiredAmount);

        // Verify payment signature with facilitator
        const verifyResult = await verifyPayment(config.facilitatorUrl || 'http://localhost:4000', payment);

        if (!verifyResult.valid) {
          throw new X402Error('Payment verification failed', 402, verifyResult);
        }

        // Settle payment on blockchain
        const settlement = await settlePayment(config.facilitatorUrl || 'http://localhost:4000', payment);

        // Store settlement details in request for access in route handler
        request.x402Payment = {
          txHash: settlement.txHash,
          amount: settlement.amount,
          network: settlement.network
        };

        // Add payment response header
        reply.header('X-Payment-Response', JSON.stringify({
          txHash: settlement.txHash,
          amount: settlement.amount,
          network: settlement.network
        }));
      } catch (error: any) {
        if (error instanceof X402Error) {
          return reply.code(error.statusCode).send({
            error: error.message,
            details: error.details
          });
        }

        return reply.code(402).send({
          error: 'Invalid or missing payment',
          details: error.message
        });
      }
    };
  });
};

export default fp(x402Plugin, {
  name: '@x1pay/fastify-x402',
  fastify: '4.x || 5.x'
});

export { x402Plugin };
