export interface X402Config {
  allowedNetworks?: string[];  // Optional: allow multiple networks (e.g., ['x1-testnet', 'x1-mainnet'])
  facilitatorUrl?: string;  // Single facilitator (backward compatible)
  facilitatorRegistryUrl?: string;  // Registry endpoint for multiple facilitators
  facilitators?: Array<{
    id: string
    name: string
    url: string
    fee: number
    status: 'active' | 'inactive' | 'offline'
    network: 'x1-testnet' | 'x1-mainnet'
    address?: string
  }>;  // Multiple facilitators (new)
  network: string;
  payToAddress: string;
  tokenMint: string;
  acceptedAssets?: string[];
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
  x402Version?: number;
  payload: {
    transaction: string;
  };
  signature?: string;
  txSignature?: string;
  txHash?: string;
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
    facilitatorUrl?: string;
    extra?: {
      feePayer?: string;
    };
  }>;
}

export interface SettlementResponse {
  txHash: string;
  amount: string;
  network: string;
}

export interface VerifyResponse {
  valid: boolean;
  message?: string;
}
