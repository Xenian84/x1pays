export interface PaymentRequirement {
  x402Version: number;
  info: string;
  accepts: Array<{
    scheme: string;
    network: string;
    payTo: string;
    asset: string;
    maxAmountRequired?: string;
    resource: string;
    description: string;
    facilitatorUrl?: string;
    extra?: {
      feePayer?: string;
    };
  }>;
}

export interface PaymentPayload {
  scheme: string;
  network: string;
  payTo: string;
  asset: string;
  amount: string;
  resource?: string;
  buyer: string;
  x402Version?: number;
  payload: {
    transaction: string;
  };
  signature?: string;
  txSignature?: string;
  memo?: string | null;
}

export interface PaymentResponse {
  txHash: string;
  amount: string;
  simulated: boolean;
}

export interface X402Response<T = any> {
  data: T;
  payment?: PaymentResponse;
  headers: Record<string, string>;
}

export interface WalletSigner {
  publicKey: { toBase58(): string } | { toString(): string };
  secretKey?: Uint8Array;
  signMessage?(message: Uint8Array): Promise<Uint8Array>;
  sign?(message: Uint8Array): Uint8Array;
}

export interface PermitSigner {
  publicKey: string;
  signPaymentTransaction(
    payment: Omit<PaymentPayload, 'buyer' | 'payload'>,
    feePayer: string,
    rpcUrl?: string,
    decimals?: number
  ): Promise<{ signedPayment: PaymentPayload; transaction: string }>;
}
