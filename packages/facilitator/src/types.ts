export type X402Payment = {
  scheme: "exact";
  network: "x1-mainnet" | "x1-testnet";
  payTo: string;
  asset: string;
  amount: string;
  buyer: string;
  resource?: string; // API endpoint or resource path
  signature?: string;
  txSignature?: string; // Buyer's signature on the transaction (base58)
  memo?: string | null;
};

export type TransactionRecord = {
  txId: string; // 8-char unique identifier
  type: 'settlement' | 'refund';
  buyer: string;
  merchant: string;
  amount: string;
  resource?: string;
  scheme: string;
  blockchainTx: string;
  network: string;
  timestamp: number; // Unix timestamp
  originalTxId?: string; // For refunds
};
