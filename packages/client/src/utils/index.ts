/**
 * Utility functions for x402 payment handling
 */

/**
 * Convert wXNT amount to atomic units (6 decimals)
 * @param wXNT - Amount in wXNT (e.g., 0.001)
 * @returns Atomic units as string (e.g., "1000")
 */
export function wXNTToAtomicUnits(wXNT: number): string {
  return Math.floor(wXNT * 1_000_000).toString();
}

/**
 * Convert atomic units to wXNT (6 decimals)
 * @param atomicUnits - Atomic units as string or number
 * @returns wXNT amount (e.g., 0.001)
 */
export function atomicUnitsToWXNT(atomicUnits: string | number): number {
  const units = typeof atomicUnits === 'string' ? parseInt(atomicUnits, 10) : atomicUnits;
  return units / 1_000_000;
}

/**
 * Format atomic units as human-readable wXNT
 * @param atomicUnits - Atomic units as string or number
 * @returns Formatted string (e.g., "0.001 wXNT")
 */
export function formatWXNT(atomicUnits: string | number): string {
  const wXNT = atomicUnitsToWXNT(atomicUnits);
  return `${wXNT} wXNT`;
}

/**
 * Validate atomic units amount
 * @param amount - Amount to validate
 * @returns true if valid
 */
export function isValidAmount(amount: string | number): boolean {
  try {
    const num = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    return num > 0 && Number.isInteger(num) && num < Number.MAX_SAFE_INTEGER;
  } catch {
    return false;
  }
}
