export interface X402Config {
  facilitatorUrl: string;
  network: string;
  payToAddress: string;
  tokenMint: string;
  amount?: string;
  getDynamicAmount?: (req: any) => string | Promise<string>;
  description?: string;
  resource?: string;
}

export interface PaymentPayload {
  scheme: string;
  network: string;
  payTo: string;
  asset: string;
  amount: string;
  buyer: string;
  signature?: string;
  txSignature?: string;
  memo?: string | null;
}

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
  }>;
}

export interface SettlementResponse {
  txHash: string;
  amount: string;
  simulated: boolean;
}

export interface VerifyResponse {
  valid: boolean;
  message?: string;
}
