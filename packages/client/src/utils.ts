import bs58 from 'bs58';
import type { WalletSigner, PaymentPayload } from './types.js';

export async function signPayment(
  payment: Omit<PaymentPayload, 'signature' | 'buyer'>,
  wallet: WalletSigner
): Promise<PaymentPayload> {
  // Get public key as string
  const publicKey = 'toBase58' in wallet.publicKey
    ? wallet.publicKey.toBase58()
    : wallet.publicKey.toString();

  const paymentWithBuyer = {
    ...payment,
    buyer: publicKey,
    memo: payment.memo ?? null
  };

  // Create message to sign
  const message = new TextEncoder().encode(JSON.stringify(paymentWithBuyer));

  // Sign message
  let signature: Uint8Array;
  
  if (wallet.signMessage) {
    signature = await wallet.signMessage(message);
  } else if (wallet.sign && wallet.secretKey) {
    // Use ed25519 signature from secretKey
    signature = wallet.sign(message);
  } else {
    throw new Error('Wallet must implement signMessage or sign method');
  }

  // Encode signature
  const signatureB58 = bs58.encode(signature);

  return {
    ...paymentWithBuyer,
    signature: signatureB58
  };
}

export class X402Error extends Error {
  constructor(
    message: string,
    public statusCode: number = 402,
    public details?: any
  ) {
    super(message);
    this.name = 'X402Error';
  }
}

/**
 * Convert wXNT amount to atomic units (6 decimals)
 * Rejects inputs with excess precision to prevent underpayment
 * @param wXNT - Amount in wXNT (e.g., 0.001)
 * @returns Atomic units as string (e.g., "1000")
 * @throws Error if input has more than 6 decimal places or results in <1 atomic unit
 * @example wXNTToAtomicUnits(0.001) // "1000"
 * @example wXNTToAtomicUnits(0.000001) // "1"
 */
export function wXNTToAtomicUnits(wXNT: number): string {
  if (typeof wXNT !== 'number' || isNaN(wXNT) || !isFinite(wXNT) || wXNT < 0) {
    throw new Error(`Invalid wXNT amount: ${wXNT}`);
  }
  
  // Multiply first to get atomic units, then check if it's a clean integer
  // This prevents rounding during decimal checking
  const atomicUnitsExact = wXNT * 1_000_000;
  
  // Check if the result is an integer (no fractional atomic units)
  // If it has fractional parts, it means input had > 6 decimals
  if (!Number.isInteger(atomicUnitsExact)) {
    throw new Error(`wXNT amount has too many decimal places (max 6): ${wXNT}`);
  }
  
  if (atomicUnitsExact < 1) {
    throw new Error(`wXNT amount too small (min 0.000001 wXNT = 1 atomic unit): ${wXNT}`);
  }
  
  if (atomicUnitsExact > Number.MAX_SAFE_INTEGER) {
    throw new Error(`wXNT amount too large: ${wXNT}`);
  }
  
  return atomicUnitsExact.toString();
}

/**
 * Convert atomic units to wXNT (6 decimals)
 * @param atomicUnits - Atomic units as string or number
 * @returns wXNT amount (e.g., 0.001)
 * @example atomicUnitsToWXNT("1000") // 0.001
 */
export function atomicUnitsToWXNT(atomicUnits: string | number): number {
  const units = typeof atomicUnits === 'string' ? parseInt(atomicUnits, 10) : atomicUnits;
  
  if (isNaN(units) || units < 0 || !Number.isInteger(units)) {
    throw new Error(`Invalid atomic units: ${atomicUnits}`);
  }
  
  return units / 1_000_000;
}

/**
 * Format atomic units as human-readable wXNT
 * @param atomicUnits - Atomic units as string or number
 * @returns Formatted string (e.g., "0.001 wXNT")
 * @example formatWXNT("1000") // "0.001 wXNT"
 */
export function formatWXNT(atomicUnits: string | number): string {
  const wXNT = atomicUnitsToWXNT(atomicUnits);
  return `${wXNT.toFixed(6).replace(/\.?0+$/, '')} wXNT`;
}

/**
 * Validate atomic units amount
 * @param amount - Amount to validate (must be positive integer)
 * @returns true if valid positive integer with no decimal places
 */
export function isValidAmount(amount: string | number): boolean {
  try {
    if (typeof amount === 'string') {
      // Must be all digits, no decimals, no negative
      if (!/^\d+$/.test(amount)) {
        return false;
      }
      const num = parseInt(amount, 10);
      return num > 0 && num <= Number.MAX_SAFE_INTEGER;
    } else if (typeof amount === 'number') {
      return Number.isInteger(amount) && amount > 0 && amount <= Number.MAX_SAFE_INTEGER;
    }
    return false;
  } catch {
    return false;
  }
}
