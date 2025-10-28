/**
 * Blockchain query utilities for X1Pays
 * Fetch and parse transaction data directly from X1 blockchain
 */

import { Connection, PublicKey } from "@solana/web3.js";

// Constants
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

// Enhanced memo structure
export interface ParsedMemo {
  version: string;
  type: 'settlement' | 'refund';
  txId: string;
  resource?: string;
  originalTxId?: string;
  timestamp: number;
  raw: string;
}

export interface TransactionData {
  signature: string;
  memo?: ParsedMemo;
  from?: string;
  to?: string;
  amount?: number;
  blockTime?: number;
  network: string;
}

/**
 * Parse enhanced memo from transaction
 * Settlement format: x402v1:exact:txId:resource:timestamp
 * Refund format: x402v1-refund:refundId:originalTxId:timestamp
 */
export function parseMemo(memoString: string): ParsedMemo | null {
  if (!memoString) return null;

  try {
    // Check for refund format
    if (memoString.startsWith('x402v1-refund:')) {
      const parts = memoString.split(':');
      if (parts.length >= 4) {
        return {
          version: 'v1',
          type: 'refund',
          txId: parts[1],
          originalTxId: parts[2] !== 'unknown' ? parts[2] : undefined,
          timestamp: parseInt(parts[3]),
          raw: memoString
        };
      }
    }

    // Check for settlement format
    if (memoString.startsWith('x402v1:')) {
      const parts = memoString.split(':');
      if (parts.length >= 5) {
        return {
          version: 'v1',
          type: 'settlement',
          txId: parts[2],
          resource: parts[3],
          timestamp: parseInt(parts[4]),
          raw: memoString
        };
      }
    }

    // Legacy format fallback
    if (memoString.startsWith('x402:')) {
      return {
        version: 'v0',
        type: 'settlement',
        txId: 'legacy',
        timestamp: 0,
        raw: memoString
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to parse memo:', error);
    return null;
  }
}

/**
 * Fetch transaction details from blockchain
 */
export async function fetchTransaction(
  connection: Connection,
  signature: string,
  network: string
): Promise<TransactionData | null> {
  try {
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed'
    });

    if (!tx) return null;

    // Parse memo from transaction logs
    let memo: ParsedMemo | null = null;
    if (tx.meta?.logMessages) {
      for (const log of tx.meta.logMessages) {
        // Look for memo program logs
        if (log.includes('Program log: Memo')) {
          // Extract memo content from log
          const match = log.match(/Memo \(len \d+\): "(.+)"/);
          if (match && match[1]) {
            memo = parseMemo(match[1]);
            break;
          }
        }
      }
    }

    // Get transaction details
    const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys;
    const from = accountKeys[0]?.toBase58();
    const to = accountKeys[1]?.toBase58();

    // Get transfer amount (simplified - assumes SystemProgram transfer)
    let amount: number | undefined;
    if (tx.meta?.preBalances && tx.meta?.postBalances) {
      const balanceChange = tx.meta.postBalances[1] - tx.meta.preBalances[1];
      if (balanceChange > 0) {
        amount = balanceChange;
      }
    }

    return {
      signature,
      memo,
      from,
      to,
      amount,
      blockTime: tx.blockTime || undefined,
      network
    };
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return null;
  }
}

/**
 * Fetch transaction history for an address
 */
export async function fetchAddressTransactions(
  connection: Connection,
  address: string,
  network: string,
  limit: number = 10
): Promise<TransactionData[]> {
  try {
    const publicKey = new PublicKey(address);
    
    // Get signatures for address
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit
    });

    // Fetch all transactions in parallel
    const transactions = await Promise.all(
      signatures.map(sig => fetchTransaction(connection, sig.signature, network))
    );

    // Filter out null results and sort by time
    return transactions
      .filter((tx): tx is TransactionData => tx !== null)
      .sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));
  } catch (error) {
    console.error('Failed to fetch address transactions:', error);
    return [];
  }
}

/**
 * Create RPC connection based on network
 */
export function createConnection(network: 'x1-mainnet' | 'x1-devnet' | 'x1-testnet'): Connection {
  const rpcUrls = {
    'x1-mainnet': process.env.VITE_X1_MAINNET_RPC || 'https://rpc.x1.xyz',
    'x1-devnet': process.env.VITE_X1_DEVNET_RPC || 'https://rpc-devnet.x1.xyz',
    'x1-testnet': process.env.VITE_X1_TESTNET_RPC || 'https://rpc-testnet.x1.xyz'
  };

  const rpcUrl = rpcUrls[network];
  return new Connection(rpcUrl, 'confirmed');
}

/**
 * Get network from RPC URL
 */
export function getNetworkFromRpc(rpcUrl: string): 'x1-mainnet' | 'x1-devnet' | 'x1-testnet' {
  if (rpcUrl.includes('mainnet')) return 'x1-mainnet';
  if (rpcUrl.includes('devnet')) return 'x1-devnet';
  return 'x1-testnet';
}
