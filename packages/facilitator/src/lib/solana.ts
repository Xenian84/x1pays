import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
import bs58 from "bs58";

export function getConnection() {
  const rpcUrl = process.env.RPC_URL || process.env.VITE_X1_RPC_URL || "https://xolana.xen.network";
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
  return Keypair.fromSecretKey(bs58.decode(secret));
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
  const fromAta = await getAssociatedTokenAddress(mint, from);
  const toAta = await getAssociatedTokenAddress(mint, to);

  const tx = new Transaction();
  
  try {
    tx.add(createAssociatedTokenAccountInstruction(feePayer.publicKey, toAta, to, mint));
  } catch {}

  tx.add(createTransferInstruction(fromAta, toAta, from, Number(amount)));

  tx.feePayer = feePayer.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  return tx;
}

export async function sendTx(connection: Connection, tx: Transaction, signers: Keypair[]) {
  const sig = await sendAndConfirmTransaction(connection, tx, signers);
  return sig;
}
