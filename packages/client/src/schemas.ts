/**
 * Zod validation schemas for x402 payment protocol
 * These schemas mirror the TypeScript types in types.ts
 */
import { z } from 'zod';

/**
 * Payment payload schema - matches PaymentPayload from types.ts
 */
export const PaymentPayloadSchema = z.object({
  scheme: z.string(),
  network: z.string(),
  payTo: z.string().min(1, 'Payment recipient address is required'),
  asset: z.string().min(1, 'Asset address is required'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer string'),
  buyer: z.string().min(1, 'Buyer public key is required'),
  signature: z.string().min(1, 'Payment signature is required'),
  txSignature: z.string().optional(),
  memo: z.string().nullable(),
});

/**
 * Single payment acceptance schema for PaymentRequirement
 */
const PaymentAcceptSchema = z.object({
  scheme: z.string(),
  network: z.string(),
  payTo: z.string(),
  asset: z.string(),
  maxAmountRequired: z.string().optional(),
  resource: z.string(),
  description: z.string(),
  facilitatorUrl: z.string().url().optional(),
});

/**
 * Payment requirement schema - matches PaymentRequirement from types.ts
 */
export const PaymentRequirementSchema = z.object({
  x402Version: z.number(),
  info: z.string(),
  accepts: z.array(PaymentAcceptSchema),
});

/**
 * Payment response schema - matches PaymentResponse from types.ts
 */
export const PaymentResponseSchema = z.object({
  txHash: z.string(),
  amount: z.string(),
  simulated: z.boolean(),
});

/**
 * Verification response schema - facilitator verify endpoint
 */
export const VerificationResponseSchema = z.object({
  valid: z.boolean(),
  message: z.string().optional(),
  details: z.any().optional(),
});

/**
 * Middleware configuration schema
 */
export const MiddlewareConfigSchema = z.object({
  facilitatorUrl: z.string().url('Facilitator URL must be a valid URL'),
  network: z.enum(['x1-mainnet', 'x1-devnet', 'x1-testnet'], {
    errorMap: () => ({ message: "Network must be 'x1-mainnet', 'x1-devnet', or 'x1-testnet'" })
  }),
  payToAddress: z.string().min(32, 'Payment address must be at least 32 characters'),
  tokenMint: z.string().min(32, 'Token mint address must be at least 32 characters'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer string'),
  maxPaymentAmount: z.string().regex(/^\d+$/).optional(),
  getDynamicAmount: z.function().optional(),
});

/**
 * Client configuration schema
 */
export const ClientConfigSchema = z.object({
  wallet: z.any(), // WalletSigner type guard validated separately
  maxPaymentAmount: z.string().regex(/^\d+$/).optional(),
  timeout: z.number().positive().optional(),
  paymentTimeout: z.number().positive().optional(),
});

// Note: Type interfaces are exported from types.ts to avoid duplicate exports
// These Zod-inferred types match the TypeScript interfaces in types.ts
