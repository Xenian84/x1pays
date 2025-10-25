export type X402Payment = {
  scheme: "exact";
  network: "x1-mainnet" | "x1-devnet";
  payTo: string;
  asset: string;
  amount: string;
  buyer: string;
  signature?: string;
  memo?: string | null;
};
