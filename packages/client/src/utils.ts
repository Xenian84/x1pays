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
 * Uses string-based parsing to avoid floating-point precision issues
 * @param wXNT - Amount in wXNT as number or string (e.g., 0.001 or "0.001")
 * @returns Atomic units as string (e.g., "1000")
 * @throws Error if input has more than 6 decimal places or results in <1 atomic unit
 * @example wXNTToAtomicUnits(0.001) // "1000"
 * @example wXNTToAtomicUnits("0.000001") // "1"
 */
export function wXNTToAtomicUnits(wXNT: number | string): string {
  let decimalStr: string;
  
  if (typeof wXNT === 'number') {
    if (isNaN(wXNT) || !isFinite(wXNT) || wXNT < 0) {
      throw new Error(`Invalid wXNT amount: ${wXNT}`);
    }
    // Convert number to canonical decimal string
    // Use toString to preserve the exact number representation
    decimalStr = wXNT.toString();
    
    // Handle scientific notation (e.g., 1e-7)
    if (decimalStr.includes('e') || decimalStr.includes('E')) {
      // For very small numbers in scientific notation, use toFixed with enough precision
      // Then we'll validate the decimal places below
      decimalStr = wXNT.toFixed(20); // Use large precision, will validate below
      // Remove trailing zeros
      decimalStr = decimalStr.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    }
  } else if (typeof wXNT === 'string') {
    decimalStr = wXNT.trim();
    // Validate string format
    if (!/^(\d+\.?\d*|\.\d+)$/.test(decimalStr)) {
      throw new Error(`Invalid wXNT string format: ${wXNT}`);
    }
  } else {
    throw new Error(`Invalid wXNT type: ${typeof wXNT}`);
  }
  
  // Split into integer and fractional parts
  const parts = decimalStr.split('.');
  const integerPart = parts[0] || '0';
  const fractionalPart = parts[1] || '';
  
  // Check decimal places (max 6)
  if (fractionalPart.length > 6) {
    throw new Error(`wXNT amount has too many decimal places (max 6): ${wXNT}`);
  }
  
  // Build atomic units by combining integer and fractional parts
  // Pad fractional part to 6 digits
  const paddedFractional = fractionalPart.padEnd(6, '0');
  const atomicUnitsStr = integerPart + paddedFractional;
  
  // Remove leading zeros
  const atomicUnits = BigInt(atomicUnitsStr);
  
  if (atomicUnits < 1n) {
    throw new Error(`wXNT amount too small (min 0.000001 wXNT = 1 atomic unit): ${wXNT}`);
  }
  
  if (atomicUnits > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`wXNT amount too large: ${wXNT}`);
  }
  
  return atomicUnits.toString();
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
