import { randomBytes } from 'crypto';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  ComputeBudgetProgram,
  Keypair,
} from '@solana/web3.js';
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import type { PaymentPayload } from './types.js';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function defaultRpcUrl(network: string): string {
  if (network === 'x1-mainnet') return 'https://rpc.mainnet.x1.xyz';
  return 'https://rpc.testnet.x1.xyz';
}

/**
 * Build and partially sign a real Solana TransferChecked transaction (v2).
 * The buyer signs the tx; the facilitator co-signs as feePayer later.
 */
export function calculateFee(amount: bigint, feeBasisPoints: number): bigint {
  if (feeBasisPoints <= 0) return 0n;
  return (amount * BigInt(feeBasisPoints)) / 10000n;
}

export async function signPaymentV2(opts: {
  payment: Omit<PaymentPayload, 'buyer' | 'payload'>;
  keypair: Keypair;
  feePayer: string;
  rpcUrl?: string;
  decimals?: number;
  treasury?: string;
  feeBasisPoints?: number;
}): Promise<{ signedPayment: PaymentPayload; transaction: string }> {
  const { payment, keypair, feePayer, rpcUrl } = opts;
  const network = payment.network || 'x1-mainnet';
  const connection = new Connection(rpcUrl || defaultRpcUrl(network), 'confirmed');

  const mint = new PublicKey(payment.asset);
  const merchant = new PublicKey(payment.payTo);
  const feePayerPubkey = new PublicKey(feePayer);
  const amount = BigInt(payment.amount);
  const feeBps = opts.feeBasisPoints || 0;
  const feeAmount = calculateFee(amount, feeBps);
  const treasury = opts.treasury ? new PublicKey(opts.treasury) : feePayerPubkey;

  const mintInfo = await connection.getAccountInfo(mint);
  if (!mintInfo) throw new Error(`Mint account ${mint.toBase58()} not found`);
  const tokenProgramId = mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID) ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;

  const decimals = opts.decimals ?? (await getMint(connection, mint, undefined, tokenProgramId)).decimals;

  const buyerAta = await getAssociatedTokenAddress(mint, keypair.publicKey, false, tokenProgramId);
  const merchantAta = await getAssociatedTokenAddress(mint, merchant, false, tokenProgramId);

  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }));
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }));

  const merchantAtaInfo = await connection.getAccountInfo(merchantAta);
  if (!merchantAtaInfo) {
    tx.add(createAssociatedTokenAccountInstruction(feePayerPubkey, merchantAta, merchant, mint, tokenProgramId));
  }

  tx.add(createTransferCheckedInstruction(buyerAta, mint, merchantAta, keypair.publicKey, amount, decimals, [], tokenProgramId));

  if (feeAmount > 0n) {
    const treasuryAta = await getAssociatedTokenAddress(mint, treasury, false, tokenProgramId);
    const treasuryAtaInfo = await connection.getAccountInfo(treasuryAta);
    if (!treasuryAtaInfo) {
      tx.add(createAssociatedTokenAccountInstruction(feePayerPubkey, treasuryAta, treasury, mint, tokenProgramId));
    }
    tx.add(createTransferCheckedInstruction(buyerAta, mint, treasuryAta, keypair.publicKey, feeAmount, decimals, [], tokenProgramId));
  }

  tx.add(new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(randomBytes(16).toString('hex'), 'utf-8'),
  }));

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = feePayerPubkey;

  tx.partialSign(keypair);

  const serialized = tx.serialize({ requireAllSignatures: false }).toString('base64');

  const buyer = keypair.publicKey.toBase58();
  return {
    signedPayment: {
      x402Version: 2,
      scheme: payment.scheme || 'exact',
      network,
      payTo: payment.payTo,
      asset: payment.asset,
      amount: payment.amount,
      buyer,
      payload: { transaction: serialized },
    },
    transaction: serialized,
  };
}

export { X402Error } from './errors.js';

/**
 * Convert wXNT amount to atomic units (6 decimals)
 */
export function wXNTToAtomicUnits(wXNT: number | string): string {
  let decimalStr: string;
  
  if (typeof wXNT === 'number') {
    if (isNaN(wXNT) || !isFinite(wXNT) || wXNT < 0) {
      throw new Error(`Invalid wXNT amount: ${wXNT}`);
    }
    decimalStr = wXNT.toString();
    if (decimalStr.includes('e') || decimalStr.includes('E')) {
      decimalStr = wXNT.toFixed(20);
      decimalStr = decimalStr.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    }
  } else if (typeof wXNT === 'string') {
    decimalStr = wXNT.trim();
    if (!/^(\d+\.?\d*|\.\d+)$/.test(decimalStr)) {
      throw new Error(`Invalid wXNT string format: ${wXNT}`);
    }
  } else {
    throw new Error(`Invalid wXNT type: ${typeof wXNT}`);
  }
  
  const parts = decimalStr.split('.');
  const integerPart = parts[0] || '0';
  const fractionalPart = parts[1] || '';
  
  if (fractionalPart.length > 6) {
    throw new Error(`wXNT amount has too many decimal places (max 6): ${wXNT}`);
  }
  
  const paddedFractional = fractionalPart.padEnd(6, '0');
  const atomicUnitsStr = integerPart + paddedFractional;
  const atomicUnits = BigInt(atomicUnitsStr);
  
  if (atomicUnits < 1n) {
    throw new Error(`wXNT amount too small (min 0.000001 wXNT = 1 atomic unit): ${wXNT}`);
  }
  
  if (atomicUnits > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`wXNT amount too large: ${wXNT}`);
  }
  
  return atomicUnits.toString();
}

export function atomicUnitsToWXNT(atomicUnits: string | number): number {
  const units = typeof atomicUnits === 'string' ? parseInt(atomicUnits, 10) : atomicUnits;
  if (isNaN(units) || units < 0 || !Number.isInteger(units)) {
    throw new Error(`Invalid atomic units: ${atomicUnits}`);
  }
  return units / 1_000_000;
}

export function formatWXNT(atomicUnits: string | number): string {
  const wXNT = atomicUnitsToWXNT(atomicUnits);
  return `${wXNT.toFixed(6).replace(/\.?0+$/, '')} wXNT`;
}

export function isValidAmount(amount: string | number): boolean {
  try {
    if (typeof amount === 'string') {
      if (!/^\d+$/.test(amount)) return false;
      const num = parseInt(amount, 10);
      return num > 0 && num <= Number.MAX_SAFE_INTEGER;
    } else if (typeof amount === 'number') {
      return Number.isInteger(amount) && amount > 0 && amount <= Number.MAX_SAFE_INTEGER;
    }
    return false;
  } catch {
    return false;
  }
}
