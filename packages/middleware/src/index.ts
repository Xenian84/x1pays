// Export all types
export * from './types.js';

// Export core utilities and errors
export { 
  X402Error,
  InvalidSignatureError,
  InsufficientFundsError,
  NetworkError,
  PaymentTimeoutError,
  InvalidAmountError,
  InvalidNetworkError,
  PaymentVerificationError,
  verifyPayment, 
  settlePayment, 
  createPaymentRequirement, 
  validatePayment 
} from './core.js';

// Express is the primary middleware — `x402` is the main export
export { x402, x402Middleware, default as express } from './express.js';

// Additional framework support (kept for compatibility)
export { x402 as honoX402, default as hono } from './hono.js';
export { x402Plugin, default as fastify } from './fastify.js';
export { x402Handler, default as nextjs } from './nextjs.js';
