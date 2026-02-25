import { PublicKey } from "@solana/web3.js";
import type { AssetInfo, Network } from "@x1pay/sdk";

export interface PoolState {
  ammConfig: PublicKey;
  poolCreator: PublicKey;
  token0Vault: PublicKey;
  token1Vault: PublicKey;
  lpMint: PublicKey;
  token0Mint: PublicKey;
  token1Mint: PublicKey;
  token0Program: PublicKey;
  token1Program: PublicKey;
  observationKey: PublicKey;
  authBump: number;
  status: number;
  lpMintDecimals: number;
  mint0Decimals: number;
  mint1Decimals: number;
  lpSupply: bigint;
  protocolFeesToken0: bigint;
  protocolFeesToken1: bigint;
  fundFeesToken0: bigint;
  fundFeesToken1: bigint;
  openTime: bigint;
  recentEpoch: bigint;
}

export interface AmmConfig {
  bump: number;
  disableCreatePool: boolean;
  index: number;
  tradeFeeRate: bigint;
  protocolFeeRate: bigint;
  fundFeeRate: bigint;
  createPoolFee: bigint;
  protocolOwner: PublicKey;
  fundOwner: PublicKey;
}

export interface PoolInfo {
  address: PublicKey;
  ammConfig: PublicKey;
  token0: TokenInfo;
  token1: TokenInfo;
  reserve0: bigint;
  reserve1: bigint;
  spotPrice: number;
  tradeFeeRate: bigint;
  status: "active" | "paused";
}

export interface TokenInfo {
  mint: PublicKey;
  decimals: number;
  symbol?: string;
  name?: string;
  program: PublicKey;
}

export interface SwapQuote {
  amountIn: bigint;
  amountOut: bigint;
  fee: bigint;
  priceImpact: number;
  spotPriceBefore: number;
  spotPriceAfter: number;
  minimumReceived: bigint;
}

export interface SwapResult {
  txHash: string;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  pool: string;
}
