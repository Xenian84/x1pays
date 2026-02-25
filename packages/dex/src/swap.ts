import { createHash } from "crypto";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { resolveTokenProgram } from "@x1pay/sdk";
import { getAuthorityPda } from "./constants.js";
import type { PoolInfo } from "./types.js";

function instructionDiscriminator(name: string): Buffer {
  const hash = createHash("sha256").update(`global:${name}`).digest();
  return Buffer.from(hash.subarray(0, 8));
}

const SWAP_BASE_INPUT_DISC = instructionDiscriminator("swap_base_input");
const SWAP_BASE_OUTPUT_DISC = instructionDiscriminator("swap_base_output");

function encodeU64(value: bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(value);
  return buf;
}

/**
 * Build a swapBaseInput transaction for xDEX.
 */
export async function buildSwapTransaction(params: {
  connection: Connection;
  payer: Keypair;
  pool: PoolInfo;
  inputMint: PublicKey;
  amountIn: bigint;
  minimumAmountOut: bigint;
  programId: PublicKey;
}): Promise<Transaction> {
  const { connection, payer, pool, inputMint, amountIn, minimumAmountOut, programId } = params;

  if (!connection) throw new Error("Connection is required");
  if (!payer) throw new Error("Payer Keypair is required");
  if (!pool) throw new Error("Pool info is required");
  if (!inputMint) throw new Error("Input mint is required");
  if (amountIn <= 0n) throw new Error("amountIn must be positive");
  if (minimumAmountOut < 0n) throw new Error("minimumAmountOut cannot be negative");

  const isBaseIn = inputMint.equals(pool.token0.mint);
  const inputToken = isBaseIn ? pool.token0 : pool.token1;
  const outputToken = isBaseIn ? pool.token1 : pool.token0;

  const inputTokenProgram = inputToken.program;
  const outputTokenProgram = outputToken.program;

  const inputAta = await getAssociatedTokenAddress(
    inputMint, payer.publicKey, false, inputTokenProgram
  );
  const outputAta = await getAssociatedTokenAddress(
    outputToken.mint, payer.publicKey, false, outputTokenProgram
  );

  const [authority] = getAuthorityPda(programId);

  const inputVault = isBaseIn ? pool.address : pool.address;
  const outputVault = isBaseIn ? pool.address : pool.address;

  const tx = new Transaction();
  tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }));
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }));

  const outputAtaInfo = await connection.getAccountInfo(outputAta);
  if (!outputAtaInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        payer.publicKey, outputAta, payer.publicKey, outputToken.mint, outputTokenProgram
      )
    );
  }

  const data = Buffer.concat([
    SWAP_BASE_INPUT_DISC,
    encodeU64(amountIn),
    encodeU64(minimumAmountOut),
  ]);

  const poolState = await connection.getAccountInfo(pool.address);
  if (!poolState) throw new Error("Pool account not found");

  const { decodePoolState: decode } = await import("./state.js");
  const decoded = decode(Buffer.from(poolState.data));

  const keys = [
    { pubkey: payer.publicKey, isSigner: true, isWritable: false },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: pool.ammConfig, isSigner: false, isWritable: false },
    { pubkey: pool.address, isSigner: false, isWritable: true },
    { pubkey: inputAta, isSigner: false, isWritable: true },
    { pubkey: outputAta, isSigner: false, isWritable: true },
    { pubkey: isBaseIn ? decoded.token0Vault : decoded.token1Vault, isSigner: false, isWritable: true },
    { pubkey: isBaseIn ? decoded.token1Vault : decoded.token0Vault, isSigner: false, isWritable: true },
    { pubkey: inputTokenProgram, isSigner: false, isWritable: false },
    { pubkey: outputTokenProgram, isSigner: false, isWritable: false },
    { pubkey: inputMint, isSigner: false, isWritable: false },
    { pubkey: outputToken.mint, isSigner: false, isWritable: false },
    { pubkey: decoded.observationKey, isSigner: false, isWritable: true },
  ];

  tx.add(new TransactionInstruction({ keys, programId, data }));

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  return tx;
}

/**
 * Build a swapBaseOutput transaction for xDEX.
 */
export async function buildSwapBaseOutputTransaction(params: {
  connection: Connection;
  payer: Keypair;
  pool: PoolInfo;
  inputMint: PublicKey;
  maxAmountIn: bigint;
  amountOut: bigint;
  programId: PublicKey;
}): Promise<Transaction> {
  const { connection, payer, pool, inputMint, maxAmountIn, amountOut, programId } = params;

  if (!connection) throw new Error("Connection is required");
  if (!payer) throw new Error("Payer Keypair is required");
  if (!pool) throw new Error("Pool info is required");
  if (!inputMint) throw new Error("Input mint is required");
  if (maxAmountIn <= 0n) throw new Error("maxAmountIn must be positive");
  if (amountOut <= 0n) throw new Error("amountOut must be positive");

  const isBaseIn = inputMint.equals(pool.token0.mint);
  const inputToken = isBaseIn ? pool.token0 : pool.token1;
  const outputToken = isBaseIn ? pool.token1 : pool.token0;

  const inputTokenProgram = inputToken.program;
  const outputTokenProgram = outputToken.program;

  const inputAta = await getAssociatedTokenAddress(
    inputMint, payer.publicKey, false, inputTokenProgram
  );
  const outputAta = await getAssociatedTokenAddress(
    outputToken.mint, payer.publicKey, false, outputTokenProgram
  );

  const [authority] = getAuthorityPda(programId);

  const tx = new Transaction();
  tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }));
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }));

  const outputAtaInfo = await connection.getAccountInfo(outputAta);
  if (!outputAtaInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        payer.publicKey, outputAta, payer.publicKey, outputToken.mint, outputTokenProgram
      )
    );
  }

  const data = Buffer.concat([
    SWAP_BASE_OUTPUT_DISC,
    encodeU64(maxAmountIn),
    encodeU64(amountOut),
  ]);

  const poolAccount = await connection.getAccountInfo(pool.address);
  if (!poolAccount) throw new Error("Pool account not found");

  const { decodePoolState: decode } = await import("./state.js");
  const decoded = decode(Buffer.from(poolAccount.data));

  const keys = [
    { pubkey: payer.publicKey, isSigner: true, isWritable: false },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: pool.ammConfig, isSigner: false, isWritable: false },
    { pubkey: pool.address, isSigner: false, isWritable: true },
    { pubkey: inputAta, isSigner: false, isWritable: true },
    { pubkey: outputAta, isSigner: false, isWritable: true },
    { pubkey: isBaseIn ? decoded.token0Vault : decoded.token1Vault, isSigner: false, isWritable: true },
    { pubkey: isBaseIn ? decoded.token1Vault : decoded.token0Vault, isSigner: false, isWritable: true },
    { pubkey: inputTokenProgram, isSigner: false, isWritable: false },
    { pubkey: outputTokenProgram, isSigner: false, isWritable: false },
    { pubkey: inputMint, isSigner: false, isWritable: false },
    { pubkey: outputToken.mint, isSigner: false, isWritable: false },
    { pubkey: decoded.observationKey, isSigner: false, isWritable: true },
  ];

  tx.add(new TransactionInstruction({ keys, programId, data }));

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  return tx;
}
