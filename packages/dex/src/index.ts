import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { ASSETS, resolveAsset, defaultRpcUrl } from "@x1pay/sdk";
import type { Network } from "@x1pay/sdk";
import { XDEX_PROGRAM_ID, sortMints } from "./constants.js";
import { quoteExactIn, quoteExactOut, spotPrice as calcSpotPrice } from "./math.js";
import { findPool, listPools as listPoolsRaw, getPoolInfo } from "./pool.js";
import { buildSwapTransaction } from "./swap.js";
import type { PoolInfo, SwapQuote, SwapResult } from "./types.js";

export class XDex {
  private connection: Connection;
  private network: Network;
  private programId: PublicKey;

  constructor(connection: Connection, network: Network) {
    this.connection = connection;
    this.network = network;
    this.programId = XDEX_PROGRAM_ID[network];
  }

  static create(network: Network, rpcUrl?: string): XDex {
    const url = rpcUrl || defaultRpcUrl(network);
    return new XDex(new Connection(url, "confirmed"), network);
  }

  private resolveMint(input: string): PublicKey {
    try {
      const asset = resolveAsset(input);
      if (asset.type === "native") {
        throw new Error("Cannot swap native XNT directly. Use WXNT instead.");
      }
      return new PublicKey(asset.mint);
    } catch {
      return new PublicKey(input);
    }
  }

  async getQuote(
    inputMint: string,
    outputMint: string,
    amountIn: string,
    slippageBps: number = 100
  ): Promise<SwapQuote> {
    try {
    const mintA = this.resolveMint(inputMint);
    const mintB = this.resolveMint(outputMint);

    const pool = await findPool(this.connection, this.programId, mintA, mintB);
    if (!pool) {
      throw new Error(
        `No xDEX pool found for ${inputMint}/${outputMint}`
      );
    }
    if (pool.status !== "active") {
      throw new Error(`Pool ${pool.address.toBase58()} is paused`);
    }

    if (!amountIn || typeof amountIn !== "string") throw new Error("amountIn must be a non-empty string");
    const parsedAmount = parseFloat(amountIn);
    if (isNaN(parsedAmount) || parsedAmount <= 0) throw new Error(`Invalid amountIn: ${amountIn}. Must be a positive number`);
    if (slippageBps < 0 || slippageBps > 10000) throw new Error(`Invalid slippage: ${slippageBps}. Must be 0-10000 bps`);

    const isInputToken0 = mintA.equals(pool.token0.mint);
    const inputReserve = isInputToken0 ? pool.reserve0 : pool.reserve1;
    const outputReserve = isInputToken0 ? pool.reserve1 : pool.reserve0;
    const inputDecimals = isInputToken0 ? pool.token0.decimals : pool.token1.decimals;
    const outputDecimals = isInputToken0 ? pool.token1.decimals : pool.token0.decimals;

    const amountInAtomic = BigInt(
      Math.round(parseFloat(amountIn) * 10 ** inputDecimals)
    );

    return quoteExactIn(
      amountInAtomic,
      inputReserve,
      outputReserve,
      pool.tradeFeeRate,
      slippageBps,
      inputDecimals,
      outputDecimals
    );
    } catch (err: any) {
      if (err.message?.includes("amountIn") || err.message?.includes("slippage") || err.message?.includes("No xDEX pool")) throw err;
      throw new Error(`Quote failed for ${inputMint}/${outputMint}: ${err.message}`);
    }
  }

  async swap(
    payer: Keypair,
    inputMint: string,
    outputMint: string,
    amountIn: string,
    slippageBps: number = 100
  ): Promise<SwapResult> {
    if (!payer) throw new Error("Payer Keypair is required");
    try {
    const mintA = this.resolveMint(inputMint);
    const mintB = this.resolveMint(outputMint);

    const pool = await findPool(this.connection, this.programId, mintA, mintB);
    if (!pool) {
      throw new Error(`No xDEX pool found for ${inputMint}/${outputMint}`);
    }
    if (pool.status !== "active") {
      throw new Error(`Pool ${pool.address.toBase58()} is paused`);
    }

    const isInputToken0 = mintA.equals(pool.token0.mint);
    const inputReserve = isInputToken0 ? pool.reserve0 : pool.reserve1;
    const outputReserve = isInputToken0 ? pool.reserve1 : pool.reserve0;
    const inputDecimals = isInputToken0 ? pool.token0.decimals : pool.token1.decimals;
    const outputDecimals = isInputToken0 ? pool.token1.decimals : pool.token0.decimals;

    const amountInAtomic = BigInt(
      Math.round(parseFloat(amountIn) * 10 ** inputDecimals)
    );

    const quote = quoteExactIn(
      amountInAtomic, inputReserve, outputReserve,
      pool.tradeFeeRate, slippageBps, inputDecimals, outputDecimals
    );

    const tx = await buildSwapTransaction({
      connection: this.connection,
      payer,
      pool,
      inputMint: mintA,
      amountIn: quote.amountIn,
      minimumAmountOut: quote.minimumReceived,
      programId: this.programId,
    });

    const txHash = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
    });

    return {
      txHash,
      amountIn: (Number(quote.amountIn) / 10 ** inputDecimals).toString(),
      amountOut: (Number(quote.amountOut) / 10 ** outputDecimals).toString(),
      priceImpact: quote.priceImpact,
      pool: pool.address.toBase58(),
    };
    } catch (err: any) {
      if (err.message?.includes("Policy") || err.message?.includes("No xDEX pool") || err.message?.includes("paused")) throw err;
      throw new Error(`Swap failed for ${inputMint}→${outputMint}: ${err.message}`);
    }
  }

  async findPool(mintA: string, mintB: string): Promise<PoolInfo | null> {
    if (!mintA || typeof mintA !== "string") throw new Error("mintA is required");
    if (!mintB || typeof mintB !== "string") throw new Error("mintB is required");
    const a = this.resolveMint(mintA);
    const b = this.resolveMint(mintB);
    return findPool(this.connection, this.programId, a, b);
  }

  async listPools(options: { hydrate?: boolean } = {}): Promise<PoolInfo[]> {
    return listPoolsRaw(this.connection, this.programId, options);
  }

  async getPrice(mintA: string, mintB: string): Promise<number> {
    if (!mintA || !mintB) throw new Error("Both mintA and mintB are required");
    const pool = await this.findPool(mintA, mintB);
    if (!pool) throw new Error(`No pool found for ${mintA}/${mintB}`);

    const a = this.resolveMint(mintA);
    if (a.equals(pool.token0.mint)) {
      return pool.spotPrice;
    }
    return pool.spotPrice > 0 ? 1 / pool.spotPrice : 0;
  }

  async getPoolByAddress(address: string): Promise<PoolInfo> {
    if (!address || typeof address !== "string") throw new Error("Pool address is required");
    let pubkey: PublicKey;
    try { pubkey = new PublicKey(address); } catch { throw new Error(`Invalid pool address: ${address}`); }
    return getPoolInfo(this.connection, this.programId, pubkey);
  }
}

export { XDEX_PROGRAM_ID, sortMints, getAuthorityPda } from "./constants.js";
export { decodePoolState, decodeAmmConfig } from "./state.js";
export { quoteExactIn, quoteExactOut, spotPrice, priceImpact } from "./math.js";
export { findPool, listPools, getPoolInfo } from "./pool.js";
export { buildSwapTransaction, buildSwapBaseOutputTransaction } from "./swap.js";
export type { PoolInfo, PoolState, AmmConfig, TokenInfo, SwapQuote, SwapResult } from "./types.js";
