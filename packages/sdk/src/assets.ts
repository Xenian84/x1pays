import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import type { AssetInfo, AssetSymbol } from "./types.js";

export const ASSETS: Record<AssetSymbol, AssetInfo> = {
  XNT: {
    symbol: "XNT",
    mint: "native",
    decimals: 9,
    name: "XNT",
    type: "native",
  },
  WXNT: {
    symbol: "WXNT",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    name: "Wrapped XNT",
    type: "spl",
  },
  USDX: {
    symbol: "USDX",
    mint: "B69chRzqzDCmdB5WYB8NRu5Yv5ZA95ABiZcdzCgGm9Tq",
    decimals: 6,
    name: "USDC.x",
    type: "token-2022",
  },
};

const ALIASES: Record<string, AssetSymbol> = {
  xnt: "XNT",
  wxnt: "WXNT",
  usdx: "USDX",
  "usdc.x": "USDX",
  usdcx: "USDX",
  "wrapped xnt": "WXNT",
  native: "XNT",
};

export function resolveAsset(input: string): AssetInfo {
  if (!input || typeof input !== "string") {
    throw new Error("Asset identifier must be a non-empty string");
  }
  const upper = input.toUpperCase() as AssetSymbol;
  if (ASSETS[upper]) return ASSETS[upper];

  const lower = input.toLowerCase();
  const alias = ALIASES[lower];
  if (alias) return ASSETS[alias];

  const byMint = Object.values(ASSETS).find((a) => a.mint === input);
  if (byMint) return byMint;

  throw new Error(
    `Unknown asset: ${input}. Supported: ${Object.keys(ASSETS).join(", ")}`
  );
}

export function tryResolveAsset(input: string): AssetInfo | null {
  try {
    return resolveAsset(input);
  } catch {
    return null;
  }
}

export async function resolveTokenProgram(
  connection: Connection,
  mint: PublicKey
): Promise<PublicKey> {
  if (!connection) throw new Error("Connection is required");
  if (!mint) throw new Error("Mint PublicKey is required");
  try {
    const info = await connection.getAccountInfo(mint);
    if (!info) throw new Error(`Mint account ${mint.toBase58()} not found on-chain`);
    if (info.owner.equals(TOKEN_2022_PROGRAM_ID)) return TOKEN_2022_PROGRAM_ID;
    return TOKEN_PROGRAM_ID;
  } catch (err: any) {
    if (err.message?.includes("Mint account")) throw err;
    throw new Error(`Failed to resolve token program for ${mint.toBase58()}: ${err.message}`);
  }
}

export function defaultRpcUrl(network: string): string {
  if (network === "x1-mainnet") return "https://rpc.mainnet.x1.xyz";
  return "https://rpc.testnet.x1.xyz";
}
