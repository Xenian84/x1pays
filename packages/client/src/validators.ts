/**
 * Runtime validation helpers using Zod schemas
 */
import { 
  PaymentPayloadSchema, 
  PaymentRequirementSchema, 
  PaymentResponseSchema 
} from './schemas.js';
import type { 
  PaymentPayload, 
  PaymentRequirement, 
  PaymentResponse,
  WalletSigner
} from './types.js';
import { InvalidSignatureError, InvalidAmountError } from './errors.js';
import { isValidNetwork } from './constants.js';
import bs58 from 'bs58';

/**
 * Validate payment payload structure using Zod
 * @throws InvalidSignatureError if validation fails
 */
export function validatePaymentPayload(payment: unknown): asserts payment is PaymentPayload {
  const result = PaymentPayloadSchema.safeParse(payment);
  if (!result.success) {
    throw new InvalidSignatureError(
      'Invalid payment payload structure',
      { errors: result.error.errors }
    );
  }
}

/**
 * Validate payment requirement structure using Zod
 * @throws Error if validation fails
 */
export function validatePaymentRequirement(requirement: unknown): asserts requirement is PaymentRequirement {
  const result = PaymentRequirementSchema.safeParse(requirement);
  if (!result.success) {
    throw new Error(
      `Invalid payment requirement: ${result.error.errors.map(e => e.message).join(', ')}`
    );
  }
}

/**
 * Validate payment response structure using Zod
 * @throws Error if validation fails
 */
export function validatePaymentResponse(response: unknown): asserts response is PaymentResponse {
  const result = PaymentResponseSchema.safeParse(response);
  if (!result.success) {
    throw new Error(
      `Invalid payment response: ${result.error.errors.map(e => e.message).join(', ')}`
    );
  }
}

/**
 * Check if payment payload is valid (returns boolean)
 */
export function isValidPaymentPayload(payment: unknown): payment is PaymentPayload {
  return PaymentPayloadSchema.safeParse(payment).success;
}

/**
 * Check if payment requirement is valid (returns boolean)
 */
export function isValidPaymentRequirement(requirement: unknown): requirement is PaymentRequirement {
  return PaymentRequirementSchema.safeParse(requirement).success;
}

/**
 * Check if payment response is valid (returns boolean)
 */
export function isValidPaymentResponse(response: unknown): response is PaymentResponse {
  return PaymentResponseSchema.safeParse(response).success;
}

/**
 * Verify payment signature cryptographically using Ed25519
 * @param payment - Payment payload to verify
 * @returns true if signature is valid
 * @throws InvalidSignatureError if signature cannot be verified
 */
/**
 * Check that a v2 payment payload contains a valid base64 transaction.
 * Full verification (instruction safety, simulation) is done server-side by the facilitator.
 */
export function hasValidTransaction(payment: PaymentPayload): boolean {
  try {
    if (!payment.payload?.transaction) return false;
    const buf = Buffer.from(payment.payload.transaction, 'base64');
    return buf.length > 0;
  } catch {
    return false;
  }
}

/**
 * Validate payment amount (atomic units)
 * @throws InvalidAmountError if amount is invalid
 */
export function validateAmount(amount: string | number): void {
  const amountStr = typeof amount === 'number' ? amount.toString() : amount;
  
  if (!/^\d+$/.test(amountStr)) {
    throw new InvalidAmountError('Amount must be a positive integer string');
  }
  
  const amountNum = parseInt(amountStr, 10);
  if (amountNum <= 0 || amountNum > Number.MAX_SAFE_INTEGER) {
    throw new InvalidAmountError(`Amount must be between 1 and ${Number.MAX_SAFE_INTEGER}`);
  }
}

/**
 * Extract payment from request headers
 * @param headers - HTTP headers object
 * @returns Parsed payment payload or null if not present
 */
export function extractPaymentFromHeaders(headers: Record<string, string | undefined>): PaymentPayload | null {
  const paymentHeader = headers['x-payment'] || headers['X-Payment'];
  
  if (!paymentHeader) {
    return null;
  }
  
  try {
    const payment = JSON.parse(paymentHeader);
    validatePaymentPayload(payment);
    return payment;
  } catch (error) {
    throw new InvalidSignatureError('Failed to parse payment header', { error });
  }
}

/**
 * Extract payment requirement from 402 response headers
 * @param headers - HTTP headers object
 * @returns Parsed payment requirement or null if not present
 */
export function extractPaymentRequirement(headers: Record<string, string | undefined>): PaymentRequirement | null {
  const reqHeader = headers['x-payment-required'] || headers['X-Payment-Required'];
  
  if (!reqHeader) {
    return null;
  }
  
  try {
    const requirement = JSON.parse(reqHeader);
    validatePaymentRequirement(requirement);
    return requirement;
  } catch (error) {
    throw new Error('Failed to parse payment requirement header');
  }
}

/**
 * Type guard for WalletSigner
 */
export function isWalletSigner(obj: unknown): obj is WalletSigner {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const wallet = obj as any;
  
  // Must have publicKey
  if (!wallet.publicKey) {
    return false;
  }
  
  // publicKey must have toBase58 or toString
  const hasPubKeyMethod = 
    typeof wallet.publicKey.toBase58 === 'function' ||
    typeof wallet.publicKey.toString === 'function';
  
  if (!hasPubKeyMethod) {
    return false;
  }
  
  // Must have either signMessage or (sign + secretKey)
  const canSign = 
    typeof wallet.signMessage === 'function' ||
    (typeof wallet.sign === 'function' && wallet.secretKey instanceof Uint8Array);
  
  return canSign;
}

/**
 * Assert that object is a valid WalletSigner
 */
export function assertWalletSigner(obj: unknown): asserts obj is WalletSigner {
  if (!isWalletSigner(obj)) {
    throw new Error(
      'Invalid wallet: must have publicKey and either signMessage() or sign() + secretKey'
    );
  }
}

/**
 * Validate network value
 * @throws Error if network is invalid
 */
export function validateNetwork(network: string): void {
  if (!isValidNetwork(network)) {
    throw new Error(
      `Invalid network: ${network}. Must be 'x1-mainnet' or 'x1-testnet'`
    );
  }
}
