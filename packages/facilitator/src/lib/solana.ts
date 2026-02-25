import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
import bs58 from "bs58";

export function getConnection(network?: string) {
  // Use network-specific RPC URL if provided, otherwise fall back to env vars or defaults
  let rpcUrl: string;
  
  if (network === 'x1-mainnet') {
    // Mainnet RPC - try env vars first, then use rpc.mainnet.x1.xyz as default
    rpcUrl = process.env.RPC_URL_MAINNET || process.env.VITE_X1_MAINNET_RPC || "https://rpc.mainnet.x1.xyz";
  } else {
    rpcUrl = process.env.RPC_URL_TESTNET || process.env.RPC_URL || process.env.VITE_X1_TESTNET_RPC || "https://rpc.testnet.x1.xyz";
  }
  
  return new Connection(rpcUrl, "confirmed");
}

export function loadFeePayer(): Keypair {
  const secret = process.env.FEE_PAYER_SECRET;
  if (!secret) {
    throw new Error("FEE_PAYER_SECRET environment variable is not set");
  }
  if (typeof secret !== 'string') {
    throw new Error("FEE_PAYER_SECRET must be a string");
  }
  
  // Remove any whitespace/newlines that might have been added
  const cleanSecret = secret.trim();
  
  try {
    return Keypair.fromSecretKey(bs58.decode(cleanSecret));
  } catch (e: any) {
    throw new Error(`Failed to decode FEE_PAYER_SECRET: ${e.message}. Secret length: ${cleanSecret.length}, First 10 chars: ${cleanSecret.substring(0, 10)}`);
  }
}

export async function ensureAtaIx(mint: PublicKey, owner: PublicKey, payer: PublicKey) {
  const ata = await getAssociatedTokenAddress(mint, owner);
  const ix = createAssociatedTokenAccountInstruction(payer, ata, owner, mint);
  return { ata, ix };
}

export async function tokenTransferTx({
  connection,
  mint,
  from,
  to,
  amount,
  feePayer
}: {
  connection: Connection;
  mint: PublicKey;
  from: PublicKey;
  to: PublicKey;
  amount: bigint;
  feePayer: Keypair;
}) {
  if (!connection) throw new Error("Connection is required for token transfer");
  if (!mint) throw new Error("Mint is required for token transfer");
  if (!from) throw new Error("Sender address is required");
  if (!to) throw new Error("Recipient address is required");
  if (amount <= 0n) throw new Error("Transfer amount must be positive");
  if (!feePayer) throw new Error("Fee payer is required");

  const fromAta = await getAssociatedTokenAddress(mint, from);
  const toAta = await getAssociatedTokenAddress(mint, to);

  const tx = new Transaction();

  const toAtaInfo = await connection.getAccountInfo(toAta);
  if (!toAtaInfo) {
    tx.add(createAssociatedTokenAccountInstruction(feePayer.publicKey, toAta, to, mint));
  }

  tx.add(createTransferInstruction(fromAta, toAta, from, Number(amount)));

  tx.feePayer = feePayer.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  return tx;
}

export async function sendTx(connection: Connection, tx: Transaction, signers: Keypair[]) {
  const sig = await sendAndConfirmTransaction(connection, tx, signers);
  return sig;
}
