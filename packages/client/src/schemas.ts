/**
 * Zod validation schemas for x402 payment protocol (v2 only)
 */
import { z } from 'zod';

/**
 * Payment payload schema — v2 requires payload.transaction
 */
export const PaymentPayloadSchema = z.object({
  scheme: z.string(),
  network: z.string(),
  payTo: z.string().min(1, 'Payment recipient address is required'),
  asset: z.string().min(1, 'Asset address is required'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer string'),
  resource: z.string().optional(),
  buyer: z.string().min(1, 'Buyer public key is required'),
  x402Version: z.number().optional(),
  payload: z.object({
    transaction: z.string().min(1, 'Base64-encoded transaction is required'),
  }),
  signature: z.string().optional(),
  txSignature: z.string().optional(),
  memo: z.string().nullable().optional(),
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
  extra: z.object({
    feePayer: z.string().optional(),
  }).optional(),
});

export const PaymentRequirementSchema = z.object({
  x402Version: z.number(),
  info: z.string(),
  accepts: z.array(PaymentAcceptSchema),
});

export const PaymentResponseSchema = z.object({
  txHash: z.string(),
  amount: z.string(),
  simulated: z.boolean(),
});

export const VerificationResponseSchema = z.object({
  valid: z.boolean(),
  message: z.string().optional(),
  details: z.any().optional(),
});

export const MiddlewareConfigSchema = z.object({
  facilitatorUrl: z.string().url('Facilitator URL must be a valid URL'),
  network: z.enum(['x1-mainnet', 'x1-testnet'], {
    errorMap: () => ({ message: "Network must be 'x1-mainnet' or 'x1-testnet'" })
  }),
  payToAddress: z.string().min(32, 'Payment address must be at least 32 characters'),
  tokenMint: z.string().min(32, 'Token mint address must be at least 32 characters'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer string'),
  maxPaymentAmount: z.string().regex(/^\d+$/).optional(),
  getDynamicAmount: z.function().optional(),
});

export const ClientConfigSchema = z.object({
  wallet: z.any(),
  maxPaymentAmount: z.string().regex(/^\d+$/).optional(),
  timeout: z.number().positive().optional(),
  paymentTimeout: z.number().positive().optional(),
});
