import { PublicKey, Keypair } from "@solana/web3.js";

export type Network = "x1-mainnet" | "x1-testnet";
export type AssetSymbol = "XNT" | "WXNT" | "USDX";
export type AssetType = "native" | "spl" | "token-2022";

export interface AssetInfo {
  symbol: string;
  mint: string;
  decimals: number;
  name: string;
  type: AssetType;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  mint: string;
  amount: bigint;
  decimals: number;
  uiAmount: number;
}

export interface TxResult {
  txHash: string;
  amount: string;
  asset: string;
  to: string;
  timestamp: number;
}

export interface PayResult {
  data: any;
  txHash: string;
  amount: string;
}

export interface PaymentRequirement {
  accepts: AcceptsEntry[];
  description?: string;
}

export interface AcceptsEntry {
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
    treasury?: string;
    feeBasisPoints?: number;
  };
}

export interface PayOptions {
  preferredAsset?: AssetSymbol;
}

export interface WalletConfig {
  rpcUrl?: string;
  network?: Network;
  facilitatorUrl?: string;
}

export interface WalletStats {
  address: string;
  network: string;
  totalSpent: number;
  sessionBudget: number;
  budgetRemaining: number;
  transactionCount: number;
  transactions: TxRecord[];
}

export interface TxRecord {
  txHash: string;
  amount: string;
  asset: string;
  to: string;
  timestamp: number;
}

export interface PolicyCheck {
  allowed: boolean;
  reason?: string;
}

export interface PaymentTxOpts {
  connection: import("@solana/web3.js").Connection;
  buyer: Keypair;
  merchant: PublicKey;
  mint: PublicKey;
  amount: bigint;
  decimals: number;
  feePayer: PublicKey;
  treasury?: PublicKey;
  feeBasisPoints?: number;
}

export interface SignedPayment {
  x402Version: number;
  scheme: string;
  network: string;
  payTo: string;
  asset: string;
  amount: string;
  buyer: string;
  payload: { transaction: string };
}

export interface SpendingPolicy {
  maxPerTransaction: bigint;
  sessionBudget: bigint;
  dailyBudget?: bigint;
  allowedAssets?: AssetSymbol[];
  allowedRecipients?: string[];
  requireConfirmation?: bigint;
}
