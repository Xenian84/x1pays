import bs58 from 'bs58'
import type { WalletContextState } from '@solana/wallet-adapter-react'

export interface PaymentPayload {
  scheme: string
  network: string
  payTo: string
  asset: string
  amount: string
  buyer: string
  signature: string
  txSignature?: string
  memo?: string | null
}

export async function signPayment(
  payment: Omit<PaymentPayload, 'signature' | 'buyer'>,
  wallet: WalletContextState
): Promise<PaymentPayload> {
  if (!wallet.publicKey || !wallet.signMessage) {
    throw new Error('Wallet not connected or does not support signing')
  }

  const publicKey = wallet.publicKey.toBase58()

  const paymentWithBuyer = {
    ...payment,
    buyer: publicKey,
    memo: payment.memo ?? null,
  }

  // Create message to sign - must match facilitator verification
  const message = new TextEncoder().encode(JSON.stringify(paymentWithBuyer))

  // Sign message with wallet
  const signature = await wallet.signMessage(message)

  // Encode signature to base58
  const signatureB58 = bs58.encode(signature)

  return {
    ...paymentWithBuyer,
    signature: signatureB58,
  }
}

/**
 * Convert USD amount to atomic units (6 decimals for wXNT/USDC)
 * @param usd - Amount in USD as number (e.g., 2.50)
 * @returns Atomic units as string (e.g., "2500000")
 */
export function usdToAtomicUnits(usd: number): string {
  if (isNaN(usd) || !isFinite(usd) || usd < 0) {
    throw new Error(`Invalid USD amount: ${usd}`)
  }

  // Convert to string with proper precision
  const decimalStr = usd.toFixed(6)

  // Split into integer and fractional parts
  const [integerPart, fractionalPart = ''] = decimalStr.split('.')

  // Check max 6 decimal places
  if (fractionalPart.length > 6) {
    throw new Error(`USD amount has too many decimal places (max 6): ${usd}`)
  }

  // Pad fractional part to 6 digits
  const paddedFractional = fractionalPart.padEnd(6, '0')
  const atomicUnitsStr = integerPart + paddedFractional

  // Convert to BigInt and back to string to remove leading zeros
  const atomicUnits = BigInt(atomicUnitsStr)

  if (atomicUnits < 1n) {
    throw new Error(`USD amount too small (min 0.000001): ${usd}`)
  }

  return atomicUnits.toString()
}

/**
 * Verify payment with facilitator
 */
export async function verifyPayment(
  facilitatorUrl: string,
  payment: PaymentPayload
): Promise<{ valid: boolean; message?: string }> {
  const response = await fetch(`${facilitatorUrl}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Payment verification failed')
  }

  return response.json()
}

/**
 * Settle payment with facilitator
 */
export async function settlePayment(
  facilitatorUrl: string,
  payment: PaymentPayload
): Promise<{ txHash: string; amount: string; simulated: boolean }> {
  const response = await fetch(`${facilitatorUrl}/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Payment settlement failed')
  }

  return response.json()
}
