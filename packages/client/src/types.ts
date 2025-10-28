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
  }>;
}

export interface PaymentPayload {
  scheme: string;
  network: string;
  payTo: string;
  asset: string;
  amount: string;
  resource?: string; // API endpoint or resource path
  buyer: string;
  signature: string;
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
