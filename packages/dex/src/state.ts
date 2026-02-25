import { PublicKey } from "@solana/web3.js";
import type { PoolState, AmmConfig } from "./types.js";
import { ACCOUNT_DISCRIMINATOR_SIZE } from "./constants.js";

function readPublicKey(buf: Buffer, offset: number): PublicKey {
  return new PublicKey(buf.subarray(offset, offset + 32));
}

function readU8(buf: Buffer, offset: number): number {
  return buf.readUInt8(offset);
}

function readU16LE(buf: Buffer, offset: number): number {
  return buf.readUInt16LE(offset);
}

function readU64LE(buf: Buffer, offset: number): bigint {
  return buf.readBigUInt64LE(offset);
}

function readBool(buf: Buffer, offset: number): boolean {
  return buf.readUInt8(offset) !== 0;
}

/**
 * Decode PoolState from raw account data.
 * Layout (after 8-byte discriminator):
 *   ammConfig:      32 bytes (PublicKey)
 *   poolCreator:    32 bytes
 *   token0Vault:    32 bytes
 *   token1Vault:    32 bytes
 *   lpMint:         32 bytes
 *   token0Mint:     32 bytes
 *   token1Mint:     32 bytes
 *   token0Program:  32 bytes
 *   token1Program:  32 bytes
 *   observationKey: 32 bytes
 *   authBump:       1 byte
 *   status:         1 byte
 *   lpMintDecimals: 1 byte
 *   mint0Decimals:  1 byte
 *   mint1Decimals:  1 byte
 *   (3 padding)
 *   lpSupply:       8 bytes
 *   protocolFeesToken0: 8 bytes
 *   protocolFeesToken1: 8 bytes
 *   fundFeesToken0: 8 bytes
 *   fundFeesToken1: 8 bytes
 *   openTime:       8 bytes
 *   recentEpoch:    8 bytes
 *   padding:        31 * 8 bytes
 */
export function decodePoolState(data: Buffer): PoolState {
  if (!data || data.length < 400) {
    throw new Error(`Invalid pool state data: expected at least 400 bytes, got ${data?.length ?? 0}`);
  }
  let offset = ACCOUNT_DISCRIMINATOR_SIZE;

  const ammConfig = readPublicKey(data, offset); offset += 32;
  const poolCreator = readPublicKey(data, offset); offset += 32;
  const token0Vault = readPublicKey(data, offset); offset += 32;
  const token1Vault = readPublicKey(data, offset); offset += 32;
  const lpMint = readPublicKey(data, offset); offset += 32;
  const token0Mint = readPublicKey(data, offset); offset += 32;
  const token1Mint = readPublicKey(data, offset); offset += 32;
  const token0Program = readPublicKey(data, offset); offset += 32;
  const token1Program = readPublicKey(data, offset); offset += 32;
  const observationKey = readPublicKey(data, offset); offset += 32;

  const authBump = readU8(data, offset); offset += 1;
  const status = readU8(data, offset); offset += 1;
  const lpMintDecimals = readU8(data, offset); offset += 1;
  const mint0Decimals = readU8(data, offset); offset += 1;
  const mint1Decimals = readU8(data, offset); offset += 1;

  offset += 3;

  const lpSupply = readU64LE(data, offset); offset += 8;
  const protocolFeesToken0 = readU64LE(data, offset); offset += 8;
  const protocolFeesToken1 = readU64LE(data, offset); offset += 8;
  const fundFeesToken0 = readU64LE(data, offset); offset += 8;
  const fundFeesToken1 = readU64LE(data, offset); offset += 8;
  const openTime = readU64LE(data, offset); offset += 8;
  const recentEpoch = readU64LE(data, offset);

  return {
    ammConfig, poolCreator,
    token0Vault, token1Vault, lpMint,
    token0Mint, token1Mint,
    token0Program, token1Program,
    observationKey, authBump, status,
    lpMintDecimals, mint0Decimals, mint1Decimals,
    lpSupply,
    protocolFeesToken0, protocolFeesToken1,
    fundFeesToken0, fundFeesToken1,
    openTime, recentEpoch,
  };
}

/**
 * Decode AmmConfig from raw account data.
 * Layout (after 8-byte discriminator):
 *   bump:             1 byte
 *   disableCreatePool: 1 byte
 *   index:            2 bytes (u16)
 *   (4 padding)
 *   tradeFeeRate:     8 bytes
 *   protocolFeeRate:  8 bytes
 *   fundFeeRate:      8 bytes
 *   createPoolFee:    8 bytes
 *   protocolOwner:    32 bytes
 *   fundOwner:        32 bytes
 *   padding:          16 * 8 bytes
 */
export function decodeAmmConfig(data: Buffer): AmmConfig {
  if (!data || data.length < 100) {
    throw new Error(`Invalid AMM config data: expected at least 100 bytes, got ${data?.length ?? 0}`);
  }
  let offset = ACCOUNT_DISCRIMINATOR_SIZE;

  const bump = readU8(data, offset); offset += 1;
  const disableCreatePool = readBool(data, offset); offset += 1;
  const index = readU16LE(data, offset); offset += 2;

  const tradeFeeRate = readU64LE(data, offset); offset += 8;
  const protocolFeeRate = readU64LE(data, offset); offset += 8;
  const fundFeeRate = readU64LE(data, offset); offset += 8;
  const createPoolFee = readU64LE(data, offset); offset += 8;
  const protocolOwner = readPublicKey(data, offset); offset += 32;
  const fundOwner = readPublicKey(data, offset);

  return {
    bump, disableCreatePool, index,
    tradeFeeRate, protocolFeeRate, fundFeeRate,
    createPoolFee, protocolOwner, fundOwner,
  };
}

/** Anchor account discriminator: sha256("account:<Name>")[0..8] */
export function accountDiscriminator(name: string): Buffer {
  const crypto = globalThis.crypto || require("crypto");
  const data = new TextEncoder().encode(`account:${name}`);
  if ("subtle" in crypto) {
    throw new Error("Use accountDiscriminatorSync in Node.js environments");
  }
  const hash = (crypto as any).createHash("sha256").update(data).digest();
  return Buffer.from(hash.subarray(0, 8));
}

export function accountDiscriminatorSync(name: string): Buffer {
  const { createHash } = require("crypto");
  const hash = createHash("sha256").update(`account:${name}`).digest();
  return Buffer.from(hash.subarray(0, 8));
}

export const POOL_STATE_DISCRIMINATOR = (() => {
  try {
    const { createHash } = require("crypto");
    return Buffer.from(
      createHash("sha256").update("account:PoolState").digest().subarray(0, 8)
    );
  } catch {
    return Buffer.alloc(8);
  }
})();
