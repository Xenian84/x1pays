import { randomBytes } from "crypto";
import {
  PublicKey,
  Connection,
  Transaction,
  TransactionInstruction,
  ComputeBudgetProgram,
  Keypair,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { resolveTokenProgram } from "./assets.js";
import type { PaymentTxOpts, SignedPayment } from "./types.js";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export function calculateFee(amount: bigint, feeBasisPoints: number): bigint {
  if (amount < 0n) throw new Error("Fee amount cannot be negative");
  if (feeBasisPoints < 0 || feeBasisPoints > 10000) throw new Error("Fee basis points must be between 0 and 10000");
  if (feeBasisPoints <= 0) return 0n;
  return (amount * BigInt(feeBasisPoints)) / 10000n;
}

export async function createPaymentTransaction(
  opts: PaymentTxOpts
): Promise<Transaction> {
  const { connection, buyer, merchant, mint, amount, decimals, feePayer } = opts;
  const feeBps = opts.feeBasisPoints || 0;
  const feeAmount = calculateFee(amount, feeBps);
  const treasury = opts.treasury || feePayer;

  const tokenProgramId = await resolveTokenProgram(connection, mint);

  const buyerAta = await getAssociatedTokenAddress(
    mint, buyer.publicKey, false, tokenProgramId
  );
  const merchantAta = await getAssociatedTokenAddress(
    mint, merchant, false, tokenProgramId
  );

  const tx = new Transaction();
  tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }));
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }));

  const merchantAtaInfo = await connection.getAccountInfo(merchantAta);
  if (!merchantAtaInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        feePayer, merchantAta, merchant, mint, tokenProgramId
      )
    );
  }

  tx.add(
    createTransferCheckedInstruction(
      buyerAta, mint, merchantAta, buyer.publicKey,
      amount, decimals, [], tokenProgramId
    )
  );

  if (feeAmount > 0n) {
    const treasuryAta = await getAssociatedTokenAddress(
      mint, treasury, false, tokenProgramId
    );
    const treasuryAtaInfo = await connection.getAccountInfo(treasuryAta);
    if (!treasuryAtaInfo) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          feePayer, treasuryAta, treasury, mint, tokenProgramId
        )
      );
    }
    tx.add(
      createTransferCheckedInstruction(
        buyerAta, mint, treasuryAta, buyer.publicKey,
        feeAmount, decimals, [], tokenProgramId
      )
    );
  }

  tx.add(
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(randomBytes(16).toString("hex"), "utf-8"),
    })
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = feePayer;
  tx.partialSign(buyer);

  return tx;
}

export function buildPaymentHeader(payment: SignedPayment): string {
  return JSON.stringify(payment);
}

export async function buildSignedPayment(opts: {
  keypair: Keypair;
  connection: Connection;
  network: string;
  accept: any;
  paymentAmount: bigint;
  feePayer: string;
}): Promise<SignedPayment> {
  if (!opts) throw new Error("Options are required");
  const { keypair, connection, network, accept, paymentAmount, feePayer } = opts;
  if (!keypair) throw new Error("Keypair is required");
  if (!connection) throw new Error("Connection is required");
  if (!network) throw new Error("Network is required");
  if (!accept?.asset) throw new Error("Payment accept with asset is required");
  if (!accept?.payTo) throw new Error("Payment accept with payTo is required");
  if (paymentAmount <= 0n) throw new Error("Payment amount must be positive");
  if (!feePayer) throw new Error("Fee payer address is required");

  let mint: PublicKey, merchant: PublicKey, feePayerPubkey: PublicKey;
  try { mint = new PublicKey(accept.asset); } catch { throw new Error(`Invalid asset address: ${accept.asset}`); }
  try { merchant = new PublicKey(accept.payTo); } catch { throw new Error(`Invalid merchant address: ${accept.payTo}`); }
  try { feePayerPubkey = new PublicKey(feePayer); } catch { throw new Error(`Invalid feePayer address: ${feePayer}`); }
  const tokenProgramId = await resolveTokenProgram(connection, mint);
  const { getMint } = await import("@solana/spl-token");
  const mintInfo = await getMint(connection, mint, undefined, tokenProgramId);

  const buyerAta = await getAssociatedTokenAddress(
    mint, keypair.publicKey, false, tokenProgramId
  );
  const merchantAta = await getAssociatedTokenAddress(
    mint, merchant, false, tokenProgramId
  );

  const tx = new Transaction();
  tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }));
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }));

  const merchantAtaInfo = await connection.getAccountInfo(merchantAta);
  if (!merchantAtaInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        feePayerPubkey, merchantAta, merchant, mint, tokenProgramId
      )
    );
  }

  tx.add(
    createTransferCheckedInstruction(
      buyerAta, mint, merchantAta, keypair.publicKey,
      paymentAmount, mintInfo.decimals, [], tokenProgramId
    )
  );
  tx.add(
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(randomBytes(16).toString("hex"), "utf-8"),
    })
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = feePayerPubkey;
  tx.partialSign(keypair);

  const serialized = tx
    .serialize({ requireAllSignatures: false })
    .toString("base64");

  return {
    x402Version: 2,
    scheme: "exact",
    network,
    payTo: accept.payTo,
    asset: accept.asset,
    amount: paymentAmount.toString(),
    buyer: keypair.publicKey.toBase58(),
    payload: { transaction: serialized },
  };
}
