/**
 * Permit-Based Signer (v2 only)
 * Builds and partially signs real Solana transactions without wallet extension UI.
 */

import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import type { PaymentPayload } from './types.js';
import { signPaymentV2 } from './utils.js';

export interface PermitSigner {
  publicKey: string;
  signPaymentTransaction(
    payment: Omit<PaymentPayload, 'buyer' | 'payload'>,
    feePayer: string,
    rpcUrl?: string,
    decimals?: number
  ): Promise<{ signedPayment: PaymentPayload; transaction: string }>;
}

export class KeypairPermitSigner implements PermitSigner {
  private keypair: Keypair;

  constructor(keypair: Keypair) {
    this.keypair = keypair;
  }

  get publicKey(): string {
    return this.keypair.publicKey.toBase58();
  }

  async signPaymentTransaction(
    payment: Omit<PaymentPayload, 'buyer' | 'payload'>,
    feePayer: string,
    rpcUrl?: string,
    decimals?: number,
  ): Promise<{ signedPayment: PaymentPayload; transaction: string }> {
    return signPaymentV2({ payment, keypair: this.keypair, feePayer, rpcUrl, decimals });
  }

  getKeypair(): Keypair {
    return this.keypair;
  }
}

export function createPermitSigner(keypair: Keypair): PermitSigner {
  return new KeypairPermitSigner(keypair);
}

export function createPermitSignerFromPrivateKey(privateKey: string): PermitSigner {
  const secretKey = bs58.decode(privateKey);
  if (secretKey.length !== 64) throw new Error('Invalid private key length: expected 64 bytes');
  return new KeypairPermitSigner(Keypair.fromSecretKey(secretKey));
}

export function createPermitSignerFromSecretKey(secretKey: Uint8Array): PermitSigner {
  if (secretKey.length !== 64) throw new Error('Invalid secret key length: expected 64 bytes');
  return new KeypairPermitSigner(Keypair.fromSecretKey(secretKey));
}
