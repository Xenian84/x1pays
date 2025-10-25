export type X402Payment = {
  scheme: "exact";
  network: "x1-mainnet" | "x1-devnet";
  payTo: string;
  asset: string;
  amount: string;
  buyer: string;
  signature?: string;
  txSignature?: string; // Buyer's signature on the transaction (base58)
  memo?: string | null;
};
