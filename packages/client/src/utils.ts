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
