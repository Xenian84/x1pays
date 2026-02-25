import { PublicKey } from "@solana/web3.js";
import type { Network } from "@x1pay/sdk";

export const XDEX_PROGRAM_ID: Record<Network, PublicKey> = {
  "x1-mainnet": new PublicKey("sEsYH97wqmfnkzHedjNcw3zyJdPvUmsa9AixhS4b4fN"),
  "x1-testnet": new PublicKey("7EEuq61z9VKdkUzj7G36xGd7ncyz8KBtUwAWVjypYQHf"),
};

export const SEEDS = {
  AUTHORITY: Buffer.from("vault_and_lp_mint_auth_seed"),
  POOL_SEED: Buffer.from("pool_seed"),
  POOL_VAULT: Buffer.from("pool_vault"),
  POOL_LP_MINT: Buffer.from("pool_lp_mint"),
  OBSERVATION: Buffer.from("observation"),
  AMM_CONFIG: Buffer.from("amm_config"),
} as const;

export const ACCOUNT_DISCRIMINATOR_SIZE = 8;

export function getAuthorityPda(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SEEDS.AUTHORITY], programId);
}

export function getPoolPda(
  programId: PublicKey,
  ammConfig: PublicKey,
  token0Mint: PublicKey,
  token1Mint: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.POOL_SEED, ammConfig.toBuffer(), token0Mint.toBuffer(), token1Mint.toBuffer()],
    programId
  );
}

export function getPoolVaultPda(
  programId: PublicKey,
  poolState: PublicKey,
  tokenMint: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.POOL_VAULT, poolState.toBuffer(), tokenMint.toBuffer()],
    programId
  );
}

export function getObservationPda(
  programId: PublicKey,
  poolState: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.OBSERVATION, poolState.toBuffer()],
    programId
  );
}

export function sortMints(
  mintA: PublicKey,
  mintB: PublicKey
): [PublicKey, PublicKey] {
  const bufA = mintA.toBuffer();
  const bufB = mintB.toBuffer();
  for (let i = 0; i < 32; i++) {
    if (bufA[i] < bufB[i]) return [mintA, mintB];
    if (bufA[i] > bufB[i]) return [mintB, mintA];
  }
  return [mintA, mintB];
}
