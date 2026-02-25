import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";
import { resolveTokenProgram, ASSETS, tryResolveAsset } from "@x1pay/sdk";
import { XDEX_PROGRAM_ID, sortMints } from "./constants.js";
import { decodePoolState, decodeAmmConfig, POOL_STATE_DISCRIMINATOR } from "./state.js";
import { spotPrice } from "./math.js";
import type { PoolInfo, PoolState, AmmConfig, TokenInfo } from "./types.js";
import type { Network } from "@x1pay/sdk";

const ammConfigCache = new Map<string, AmmConfig>();
const CONCURRENCY = 5;

async function resolveAmmConfig(
  connection: Connection,
  ammConfigKey: PublicKey
): Promise<bigint> {
  const key = ammConfigKey.toBase58();
  const cached = ammConfigCache.get(key);
  if (cached) return cached.tradeFeeRate;

  const info = await connection.getAccountInfo(ammConfigKey);
  if (info) {
    const config = decodeAmmConfig(Buffer.from(info.data));
    ammConfigCache.set(key, config);
    return config.tradeFeeRate;
  }
  return 2500n;
}

function buildPoolInfoFromState(
  poolAddress: PublicKey,
  poolState: PoolState,
  tradeFeeRate: bigint,
  reserve0: bigint,
  reserve1: bigint
): PoolInfo {
  const token0Asset = tryResolveAsset(poolState.token0Mint.toBase58());
  const token1Asset = tryResolveAsset(poolState.token1Mint.toBase58());

  const token0: TokenInfo = {
    mint: poolState.token0Mint,
    decimals: poolState.mint0Decimals,
    symbol: token0Asset?.symbol,
    name: token0Asset?.name,
    program: poolState.token0Program,
  };
  const token1: TokenInfo = {
    mint: poolState.token1Mint,
    decimals: poolState.mint1Decimals,
    symbol: token1Asset?.symbol,
    name: token1Asset?.name,
    program: poolState.token1Program,
  };

  const price = spotPrice(
    reserve0, reserve1,
    poolState.mint0Decimals, poolState.mint1Decimals
  );

  const isSwapDisabled = (poolState.status & 4) !== 0;

  return {
    address: poolAddress,
    ammConfig: poolState.ammConfig,
    token0, token1,
    reserve0, reserve1,
    spotPrice: price,
    tradeFeeRate,
    status: isSwapDisabled ? "paused" : "active",
  };
}

async function getVaultBalances(
  connection: Connection,
  poolState: PoolState
): Promise<[bigint, bigint]> {
  try {
    const [vault0, vault1] = await Promise.all([
      getAccount(connection, poolState.token0Vault, "confirmed", poolState.token0Program),
      getAccount(connection, poolState.token1Vault, "confirmed", poolState.token1Program),
    ]);
    return [vault0.amount, vault1.amount];
  } catch (err: any) {
    // Vault may not exist yet for new pools
    return [0n, 0n];
  }
}

/**
 * Fetch and decode a pool's on-chain state, including vault balances.
 */
export async function getPoolInfo(
  connection: Connection,
  programId: PublicKey,
  poolAddress: PublicKey
): Promise<PoolInfo> {
  const accountInfo = await connection.getAccountInfo(poolAddress);
  if (!accountInfo) throw new Error(`Pool account ${poolAddress.toBase58()} not found`);

  const poolState = decodePoolState(Buffer.from(accountInfo.data));
  const tradeFeeRate = await resolveAmmConfig(connection, poolState.ammConfig);
  const [reserve0, reserve1] = await getVaultBalances(connection, poolState);

  return buildPoolInfoFromState(poolAddress, poolState, tradeFeeRate, reserve0, reserve1);
}

/**
 * Find a pool by token pair using getProgramAccounts scan.
 * Tokens are sorted by pubkey (token0 < token1) to match on-chain layout.
 */
export async function findPool(
  connection: Connection,
  programId: PublicKey,
  mintA: PublicKey,
  mintB: PublicKey
): Promise<PoolInfo | null> {
  const [token0Mint, token1Mint] = sortMints(mintA, mintB);

  let accounts;
  try {
    accounts = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 637 },
        { memcmp: { offset: 8 + 32 * 5, bytes: token0Mint.toBase58() } },
        { memcmp: { offset: 8 + 32 * 6, bytes: token1Mint.toBase58() } },
      ],
    });
  } catch (err: any) {
    throw new Error(`Failed to query pools for ${mintA.toBase58()}/${mintB.toBase58()}: ${err.message}`);
  }

  if (accounts.length === 0) return null;

  // When multiple pools exist for the same pair, pick the one with the most liquidity
  let bestPool: PoolInfo | null = null;
  let bestLiquidity = 0n;

  for (const acct of accounts) {
    const state = decodePoolState(Buffer.from(acct.account.data));
    const feeRate = await resolveAmmConfig(connection, state.ammConfig);
    const [r0, r1] = await getVaultBalances(connection, state);
    const pool = buildPoolInfoFromState(acct.pubkey, state, feeRate, r0, r1);
    const liquidity = r0 + r1;
    if (liquidity > bestLiquidity) {
      bestLiquidity = liquidity;
      bestPool = pool;
    }
  }

  return bestPool;
}

/**
 * List all xDEX pools. Decodes pool state from already-fetched account data
 * (zero extra RPC calls for the list itself). Reserves are set to 0 in the
 * lightweight listing -- call getPoolInfo() on specific pools to get live
 * vault balances.
 *
 * Pass `hydrate: true` to fetch vault balances for all pools (slow, may
 * trigger RPC rate limits on large pool sets).
 */
export async function listPools(
  connection: Connection,
  programId: PublicKey,
  options: { hydrate?: boolean } = {}
): Promise<PoolInfo[]> {
  let accounts;
  try {
    accounts = await connection.getProgramAccounts(programId, {
      filters: [{ dataSize: 637 }],
    });
  } catch (err: any) {
    throw new Error(`Failed to list pools: ${err.message}`);
  }

  const decoded: { pubkey: PublicKey; state: PoolState }[] = [];
  for (const { pubkey, account } of accounts) {
    try {
      decoded.push({ pubkey, state: decodePoolState(Buffer.from(account.data)) });
    } catch {
      // skip malformed
    }
  }

  // Pre-warm AMM config cache (typically only 2-3 unique configs)
  const uniqueConfigs = [...new Set(decoded.map(d => d.state.ammConfig.toBase58()))];
  for (const cfgKey of uniqueConfigs) {
    await resolveAmmConfig(connection, new PublicKey(cfgKey));
  }

  if (!options.hydrate) {
    return decoded.map(({ pubkey, state }) => {
      const tradeFeeRate = ammConfigCache.get(state.ammConfig.toBase58())?.tradeFeeRate ?? 2500n;
      return buildPoolInfoFromState(pubkey, state, tradeFeeRate, 0n, 0n);
    });
  }

  // Hydrate with vault balances in batches
  const pools: PoolInfo[] = [];
  for (let i = 0; i < decoded.length; i += CONCURRENCY) {
    const batch = decoded.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async ({ pubkey, state }) => {
        const tradeFeeRate = await resolveAmmConfig(connection, state.ammConfig);
        const [r0, r1] = await getVaultBalances(connection, state);
        return buildPoolInfoFromState(pubkey, state, tradeFeeRate, r0, r1);
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled") pools.push(r.value);
    }
  }

  return pools;
}
