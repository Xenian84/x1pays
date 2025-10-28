import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { Connection, PublicKey } from '@solana/web3.js';

// Memo parsing utilities (inline for now)
interface ParsedMemo {
  version: string;
  type: 'settlement' | 'refund';
  txId: string;
  resource?: string;
  originalTxId?: string;
  timestamp: number;
  raw: string;
}

interface TransactionData {
  signature: string;
  memo?: ParsedMemo;
  from?: string;
  to?: string;
  amount?: number;
  blockTime?: number;
  network: string;
}

function parseMemo(memoString: string): ParsedMemo | null {
  if (!memoString) return null;

  try {
    // Refund format: x402v1-refund:refundId:originalTxId:timestamp
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

    // Settlement format: x402v1:exact:txId:resource:timestamp
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

    // Legacy format
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

async function fetchTransaction(
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
        if (log.includes('Program log: Memo')) {
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

    // Get transfer amount
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
 * Get blockchain explorer URL for transaction
 */
function getExplorerUrl(
  signature: string,
  network: 'x1-testnet' | 'x1-mainnet' | string
): string {
  const baseUrl = network === 'x1-testnet'
    ? 'https://explorer.testnet.x1.xyz/tx'
    : 'https://explorer.x1.xyz/tx';
  
  return `${baseUrl}/${signature}`;
}

interface TransactionHistoryProps {
  walletAddress?: string;
  rpcUrl: string;
  network: 'x1-mainnet' | 'x1-devnet' | 'x1-testnet';
  limit?: number;
}

export function TransactionHistory({ 
  walletAddress, 
  rpcUrl, 
  network,
  limit = 10 
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const connection = new Connection(rpcUrl, 'confirmed');
      const publicKey = new PublicKey(walletAddress);
      
      // Get signatures for address
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit
      });

      // Fetch all transactions
      const txs = await Promise.all(
        signatures.map(sig => fetchTransaction(connection, sig.signature, network))
      );

      // Filter and sort
      const validTxs = txs
        .filter((tx): tx is TransactionData => tx !== null && tx.memo !== null)
        .sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));

      setTransactions(validTxs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
      console.error('Failed to fetch transaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [walletAddress, rpcUrl, network]);

  if (!walletAddress) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            Connect your wallet to view transaction history
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Transaction History
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={network} 
              color="primary" 
              size="small" 
              variant="outlined"
            />
            <Button 
              variant="outlined" 
              size="small" 
              onClick={fetchHistory}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length === 0 ? (
          <Alert severity="info">
            No x402 transactions found for this address
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>TX ID</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Explorer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.signature}>
                    <TableCell>
                      <Chip
                        label={tx.memo?.type}
                        color={tx.memo?.type === 'settlement' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {tx.memo?.txId}
                      </Typography>
                      {tx.memo?.originalTxId && (
                        <Typography variant="caption" color="text.secondary">
                          Refund of: {tx.memo.originalTxId}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {tx.memo?.resource || '-'}
                    </TableCell>
                    <TableCell>
                      {tx.amount ? (tx.amount / 1_000_000_000).toFixed(6) + ' SOL' : '-'}
                    </TableCell>
                    <TableCell>
                      {tx.blockTime 
                        ? new Date(tx.blockTime * 1000).toLocaleString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Link
                        href={getExplorerUrl(tx.signature, network)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
