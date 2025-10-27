import type { WalletSigner, PaymentPayload } from './types.js';

// Simple base58 encode/decode (compatible with browser and node)
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(buffer: Uint8Array): string {
  let num = BigInt('0x' + Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join(''));
  let encoded = '';
  
  while (num > 0n) {
    const remainder = Number(num % 59n);
    num = num / 59n;
    encoded = ALPHABET[remainder] + encoded;
  }
  
  // Handle leading zeros
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    encoded = ALPHABET[0] + encoded;
  }
  
  return encoded;
}

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
  const signatureB58 = base58Encode(signature);

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
