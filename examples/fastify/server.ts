import Fastify from 'fastify';
import x402Plugin from '@x1pay/middleware/fastify';

const fastify = Fastify({ logger: true });

// Register x402 plugin
await fastify.register(x402Plugin, {
  facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.PAYTO_ADDRESS || '',
  tokenMint: process.env.WXNT_MINT || '',
  amount: '1000',
  description: 'Premium API access'
});

// Protected route using x402 preHandler
fastify.get('/premium/data', {
  preHandler: fastify.x402()
}, async (request, reply) => {
  // Payment settled successfully
  return {
    data: 'Premium content',
    payment: request.x402Payment
  };
});

// Start server
await fastify.listen({ port: 3000 });
