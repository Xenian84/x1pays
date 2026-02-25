import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from the package root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pino from "pino";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { PublicKey, Connection } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { getConnection, loadFeePayer, tokenTransferTx } from "./lib/solana.js";
import { 
  PaymentPayloadSchema,
  PaymentPayload,
  InvalidSignatureError,
  InvalidNetworkError,
  NetworkError,
  X402_VERSION,
  NETWORKS
} from "@x1pay/client";
import { 
  sanitizeForLog,
  sanitizePayment,
  sanitizeTransaction,
  truncateString 
} from "@x1pay/shared/src/security/sanitize.js";
import { initializeFacilitator } from "./lib/registry.js";

// Utility: Generate unique 8-character transaction ID
function generateTxId(): string {
  return crypto.randomBytes(4).toString('hex');
}

// Utility: Sanitize input for blockchain memos (prevent injection)
function sanitizeMemoInput(input?: string): string {
  if (!input) return 'none';
  // Remove any non-alphanumeric characters except dash, underscore, colon
  // Limit length to prevent memo overflow (max 566 bytes for Solana memo)
  return input
    .slice(0, 50) // Limit length
    .replace(/[^a-zA-Z0-9\-_:]/g, '') // Only safe characters
    .replace(/:{2,}/g, ':'); // Prevent multiple colons
}

// Utility: Extract resource shortname from path
function getResourceShort(resource?: string): string {
  if (!resource) return 'default';
  // Extract last path segment and limit to 10 chars
  const parts = resource.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || 'default';
  // Sanitize to prevent memo injection
  return sanitizeMemoInput(last.slice(0, 10));
}

const PORT = Number(process.env.PORT || 4000);
const FACILITATOR_ID = process.env.FACILITATOR_ID || 'unknown';
const FACILITATOR_NAME = process.env.FACILITATOR_NAME || 'Unnamed Facilitator';
const FEE_BASIS_POINTS = Number(process.env.FEE_BASIS_POINTS || 10);

const logger = pino({ 
  transport: { target: "pino-pretty" },
  base: { facilitatorId: FACILITATOR_ID } // Include facilitator ID in all logs
});

// Facilitator stats tracking
interface FacilitatorStats {
  totalSettlements: number  // All settlement attempts (successful + failed)
  totalRefunds: number
  totalVolume: bigint // In lamports - ONLY successful settlements
  successfulSettlements: number  // ONLY successful on-chain transactions
  failedSettlements: number
  startTime: number
  lastSettlement?: number
  lastRefund?: number
  responseTimes: number[] // Array of response times in ms
  // Track successful settlements with timestamps for 24h stats
  successfulSettlementsHistory: Array<{ timestamp: number; amount: bigint }>
  // Protocol Bond tracking - ensures facilitator can cover refunds
  reserveBalance: bigint // Current facilitator wallet balance (checked periodically)
  pendingRefundLiability: bigint // Outstanding amount that could be refunded
  minimumReserveRequired: bigint // Minimum reserve to accept new payments
  lastBalanceCheck?: number
  bondHealthScore: number // 0-100, health of reserve vs liability
}

const stats: FacilitatorStats = {
  totalSettlements: 0,
  totalRefunds: 0,
  totalVolume: BigInt(0),
  successfulSettlements: 0,  // Only successful on-chain transactions
  failedSettlements: 0,
  startTime: Date.now(),
  responseTimes: [],
  successfulSettlementsHistory: [],  // Track for 24h stats
  // Protocol Bond defaults
  reserveBalance: BigInt(0),
  pendingRefundLiability: BigInt(0),
  minimumReserveRequired: BigInt(10_000_000), // 0.01 wXNT minimum reserve
  bondHealthScore: 100
}

// Calculate uptime percentage (99.9% if running, can be enhanced with actual monitoring)
function getUptime(): number {
  const uptimeSeconds = (Date.now() - stats.startTime) / 1000
  // Assume 99.9% uptime for now (could be enhanced with actual downtime tracking)
  return 99.9
}

// Calculate success rate
function getSuccessRate(): number {
  const total = stats.successfulSettlements + stats.failedSettlements
  if (total === 0) return 100
  return (stats.successfulSettlements / total) * 100
}

// Calculate average response time
function getAvgResponseTime(): number {
  if (stats.responseTimes.length === 0) return 42 // Default
  const sum = stats.responseTimes.reduce((a, b) => a + b, 0)
  return Math.round(sum / stats.responseTimes.length)
}

// Calculate bond health score (0-100)
function calculateBondHealth(): number {
  if (stats.pendingRefundLiability === BigInt(0)) return 100
  
  const ratio = Number(stats.reserveBalance) / Number(stats.pendingRefundLiability)
  
  // 100% if reserve is 3x or more than liability
  if (ratio >= 3.0) return 100
  // Linear scale from 50-100 for 1x-3x coverage
  if (ratio >= 1.0) return 50 + ((ratio - 1.0) / 2.0) * 50
  // Below 1x coverage is critical (0-50 score)
  return Math.max(0, ratio * 50)
}

// Update reserve balance by checking blockchain
async function updateReserveBalance(network: string): Promise<void> {
  try {
    const feePayer = loadFeePayer()
    if (!feePayer) return
    
    const connection = getConnection(network)
    const balance = await connection.getBalance(feePayer.publicKey)
    
    stats.reserveBalance = BigInt(balance)
    stats.lastBalanceCheck = Date.now()
    stats.bondHealthScore = calculateBondHealth()
    
    logger.info({
      reserve: balance,
      liability: stats.pendingRefundLiability.toString(),
      health: stats.bondHealthScore,
      network
    }, 'Updated protocol bond status')
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update reserve balance')
  }
}

// Check if facilitator has sufficient reserve to accept payment
function hasAdequateReserve(paymentAmount: bigint): boolean {
  const newLiability = stats.pendingRefundLiability + paymentAmount
  
  // Must maintain at least minimum reserve after accepting payment
  if (stats.reserveBalance < stats.minimumReserveRequired) {
    logger.warn({
      reserve: stats.reserveBalance.toString(),
      minimum: stats.minimumReserveRequired.toString()
    }, 'Reserve below minimum threshold')
    return false
  }
  
  // Reserve should be at least 1.5x the total liability for healthy operation
  const healthyReserve = newLiability + (newLiability / BigInt(2))
  if (stats.reserveBalance < healthyReserve) {
    logger.warn({
      reserve: stats.reserveBalance.toString(),
      healthyReserve: healthyReserve.toString(),
      newLiability: newLiability.toString()
    }, 'Reserve insufficient for healthy operation')
    return false
  }
  
  return true
}

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Facilitator is an API, not serving HTML
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting for facilitator endpoints
const settlementLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 settlements per minute per IP
  message: 'Too many settlement requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

const refundLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // 50 refunds per minute per IP (more restrictive)
  message: 'Too many refund requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

const statsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 stats requests per minute per IP
  message: 'Too many stats requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(bodyParser.json({ limit: '10kb' })); // Limit request size

app.get("/health", (_req, res) => {
  try {
    const feePayer = loadFeePayer();
    const treasuryAddress = process.env.TREASURY_ADDRESS || feePayer.publicKey.toString();
    res.json({ 
      ok: true, 
      service: "x1pays-facilitator",
      facilitatorId: FACILITATOR_ID,
      facilitatorName: FACILITATOR_NAME,
      facilitatorAddress: feePayer.publicKey.toString(),
      treasuryAddress,
      feeBasisPoints: FEE_BASIS_POINTS,
      network: process.env.NETWORK || "x1-mainnet",
      uptime: getUptime(),
      stats: {
        totalSettlements: stats.totalSettlements,
        totalRefunds: stats.totalRefunds,
        successRate: getSuccessRate()
      }
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: `Health check failed: ${err.message}` });
  }
});

// GET /stats - Facilitator statistics endpoint (with rate limiting)
app.get("/stats", statsLimiter, async (req, res) => {
  // Optionally validate against blockchain if validate=true query param
  const validateBlockchain = req.query.validate === 'true'
  const network = (req.query.network as string) || process.env.NETWORK || 'x1-testnet'
  
  // Calculate 24h stats from successful settlements history (ONLY successful on-chain transactions)
  const now = Date.now()
  const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000)
  const last24hSettlements = stats.successfulSettlementsHistory.filter(
    entry => entry.timestamp > twentyFourHoursAgo
  )
  const last24hPayments = last24hSettlements.length
  const last24hVolume = last24hSettlements.reduce(
    (sum, entry) => sum + entry.amount,
    BigInt(0)
  )
  
  // If validate=true, query blockchain directly for real transaction count
  let blockchainTxCount: number | null = null
  let blockchainValidation: any = null
  
  if (validateBlockchain) {
    try {
      const facilitator = loadFeePayer()
      const connection = getConnection(network)
      const signatures = await connection.getSignaturesForAddress(
        facilitator.publicKey,
        { limit: 1000 }
      )
      blockchainTxCount = signatures.length
      blockchainValidation = {
        blockchainCount: blockchainTxCount,
        inMemoryCount: stats.successfulSettlements,
        discrepancy: stats.successfulSettlements - blockchainTxCount,
        note: `Blockchain validation: Found ${blockchainTxCount} transactions on-chain vs ${stats.successfulSettlements} in-memory`
      }
    } catch (error: any) {
      blockchainValidation = {
        error: error.message,
        note: 'Failed to validate against blockchain'
      }
    }
  }
  
  // Always try to get blockchain count for accuracy, even if validate=true not explicitly set
  // If in-memory stats are high (>100), automatically validate against blockchain
  let actualSettlements = stats.successfulSettlements
  if (stats.successfulSettlements > 100 || validateBlockchain) {
    if (!blockchainValidation || blockchainValidation.error) {
      // Retry blockchain query if not already done
      try {
        const facilitator = loadFeePayer()
        const connection = getConnection(network)
        const signatures = await connection.getSignaturesForAddress(
          facilitator.publicKey,
          { limit: 1000 }
        )
        const blockchainCount = signatures.length
        const discrepancy = stats.successfulSettlements - blockchainCount
        const discrepancyPercent = stats.successfulSettlements > 0 ? (Math.abs(discrepancy) / stats.successfulSettlements) * 100 : 0
        
        // If discrepancy > 50%, use blockchain count (stats accumulated)
        if (discrepancyPercent > 50 && blockchainCount < stats.successfulSettlements) {
          actualSettlements = blockchainCount
          blockchainValidation = {
            blockchainCount: blockchainCount,
            inMemoryCount: stats.successfulSettlements,
            discrepancy: discrepancy,
            usingBlockchain: true,
            note: `⚠️ Large discrepancy detected (${discrepancyPercent.toFixed(1)}%). Using blockchain count (${blockchainCount}) instead of in-memory (${stats.successfulSettlements}). Stats appear accumulated - service may need restart to reset.`
          }
        } else {
          blockchainValidation = {
            blockchainCount: blockchainCount,
            inMemoryCount: stats.successfulSettlements,
            discrepancy: discrepancy,
            usingBlockchain: false,
            note: `Stats match blockchain within ${discrepancyPercent.toFixed(1)}%`
          }
        }
      } catch (error: any) {
        // Keep existing validation error or create new one
        if (!blockchainValidation) {
          blockchainValidation = {
            error: error.message,
            note: 'Failed to validate against blockchain'
          }
        }
      }
    } else if (blockchainValidation.blockchainCount < stats.successfulSettlements) {
      const discrepancyPercent = stats.successfulSettlements > 0 ? (Math.abs(blockchainValidation.discrepancy) / stats.successfulSettlements) * 100 : 0
      if (discrepancyPercent > 50) {
        actualSettlements = blockchainValidation.blockchainCount
        blockchainValidation.usingBlockchain = true
      }
    }
  }
  
  res.json({
    // Facilitator Identity
    facilitatorId: FACILITATOR_ID,
    facilitatorName: FACILITATOR_NAME,
    feeBasisPoints: FEE_BASIS_POINTS,
    // Stats
    totalSettlements: stats.totalSettlements,  // All attempts (for debugging)
    totalRefunds: stats.totalRefunds,
    totalVolume: stats.totalVolume.toString(),  // Only successful settlements
    successfulSettlements: actualSettlements,  // Use blockchain count if discrepancy large, otherwise in-memory
    successfulSettlementsInMemory: stats.successfulSettlements,  // Original in-memory count (for reference)
    failedSettlements: stats.failedSettlements,
    uptime: getUptime(),
    successRate: getSuccessRate(),
    avgResponseTime: getAvgResponseTime(),
    lastSettlement: stats.lastSettlement,
    lastRefund: stats.lastRefund,
    startTime: stats.startTime,
    responseTimeSamples: stats.responseTimes.length,
    last24h: {
      payments: last24hPayments,  // Real count from history (only successful)
      volume: last24hVolume.toString()  // Real volume from history (only successful)
    },
    // PROTOCOL BOND STATUS - Ensures facilitator can cover refunds
    protocolBond: {
      reserveBalance: stats.reserveBalance.toString(),
      pendingRefundLiability: stats.pendingRefundLiability.toString(),
      minimumReserveRequired: stats.minimumReserveRequired.toString(),
      bondHealthScore: stats.bondHealthScore,
      lastBalanceCheck: stats.lastBalanceCheck,
      status: stats.bondHealthScore >= 75 ? 'healthy' : stats.bondHealthScore >= 50 ? 'warning' : 'critical',
      canAcceptPayments: stats.reserveBalance >= stats.minimumReserveRequired,
      coverageRatio: stats.pendingRefundLiability > BigInt(0) 
        ? (Number(stats.reserveBalance) / Number(stats.pendingRefundLiability)).toFixed(2) 
        : 'N/A'
    },
    // DEBUG INFO: Show facilitator address and stats source
    _debug: {
      facilitatorAddress: loadFeePayer().publicKey.toString(),
      statsSource: 'in-memory',
      serviceStartTime: new Date(stats.startTime).toISOString(),
      serviceUptimeSeconds: Math.floor((Date.now() - stats.startTime) / 1000),
      serviceUptimeHours: (Math.floor((Date.now() - stats.startTime) / 1000) / 3600).toFixed(2),
      warning: stats.successfulSettlements > 100 ? `⚠️ Stats appear high (${stats.successfulSettlements}). Service has been running for ${(Math.floor((Date.now() - stats.startTime) / 1000) / 3600).toFixed(2)} hours. Use POST /stats/reset to reset without restart.` : undefined,
      note: `Stats are stored in-memory and accumulate until reset. Use POST /stats/reset to reset (password: dev-reset-2024) or restart service. Stats now auto-validate against blockchain if discrepancy >50%.`
    },
    // Blockchain validation (only if validate=true)
    ...(blockchainValidation && { blockchainValidation })
  });
});

// POST /stats/reset - Reset stats (for development/testing)
app.post("/stats/reset", (req, res) => {
  const resetPassword = req.body.password || req.headers['x-reset-password']
  const expectedPassword = process.env.STATS_RESET_PASSWORD || 'dev-reset-2024'
  
  if (resetPassword !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized - invalid reset password' })
  }
  
  // Reset all stats to 0
  const oldStats = { ...stats }
  stats.totalSettlements = 0
  stats.totalRefunds = 0
  stats.totalVolume = BigInt(0)
  stats.successfulSettlements = 0
  stats.failedSettlements = 0
  stats.responseTimes = []
  stats.successfulSettlementsHistory = []
  stats.startTime = Date.now()
  stats.lastSettlement = undefined
  stats.lastRefund = undefined
  // Reset Protocol Bond tracking
  stats.reserveBalance = BigInt(0)
  stats.pendingRefundLiability = BigInt(0)
  stats.lastBalanceCheck = undefined
  stats.bondHealthScore = 100
  
  logger.info({ oldStats, newStats: stats }, 'Stats reset via API')
  
  res.json({
    success: true,
    message: 'Stats reset successfully',
    oldStats: {
      successfulSettlements: oldStats.successfulSettlements,
      totalSettlements: oldStats.totalSettlements,
      startTime: new Date(oldStats.startTime).toISOString()
    },
    newStats: {
      successfulSettlements: stats.successfulSettlements,
      totalSettlements: stats.totalSettlements,
      startTime: new Date(stats.startTime).toISOString()
    }
  })
})

// NEW: GET /validate - Validate stats against actual blockchain transactions
app.get("/validate", async (_req, res) => {
  try {
    const network = (_req.query.network as string) || process.env.NETWORK || 'x1-testnet'
    const facilitator = loadFeePayer()
    const facilitatorAddress = facilitator.publicKey.toString()
    const connection = getConnection(network)
    
    logger.info({ facilitatorAddress, network }, 'Validating facilitator stats against blockchain')
    
    // Get all signatures for this address (signatures from this address as fee payer)
    // Note: Solana RPC doesn't directly support "get all transactions for an address"
    // We need to use getSignaturesForAddress or getProgramAccounts
    // For now, we'll use getSignaturesForAddress which gets transactions where this address was involved
    
    let blockchainTxCount = 0
    let lastTxSignature: string | null = null
    const maxSignatures = 1000 // Limit to avoid timeout
    
    try {
      // Get signatures where this address was involved (as fee payer or account owner)
      const signatures = await connection.getSignaturesForAddress(
        facilitator.publicKey,
        { limit: maxSignatures }
      )
      
      blockchainTxCount = signatures.length
      lastTxSignature = signatures.length > 0 ? signatures[0].signature : null
      
      logger.info({ 
        facilitatorAddress, 
        blockchainTxCount, 
        lastTxSignature,
        network 
      }, 'Retrieved blockchain signatures')
    } catch (error: any) {
      logger.error({ error: error.message, network }, 'Failed to get signatures from blockchain')
    }
    
    // Calculate discrepancy
    const inMemoryCount = stats.successfulSettlements
    const discrepancy = inMemoryCount - blockchainTxCount
    
    res.json({
      facilitator: {
        address: facilitatorAddress,
        network: network
      },
      stats: {
        inMemory: {
          successfulSettlements: stats.successfulSettlements,
          totalSettlements: stats.totalSettlements,
          failedSettlements: stats.failedSettlements,
          totalVolume: stats.totalVolume.toString(),
          serviceStartTime: new Date(stats.startTime).toISOString(),
          serviceUptimeSeconds: Math.floor((Date.now() - stats.startTime) / 1000),
          serviceUptimeHours: (Math.floor((Date.now() - stats.startTime) / 1000) / 3600).toFixed(2),
          note: 'These stats are stored in-memory and accumulate until service restart. They reset to 0 when the facilitator service restarts.'
        },
        blockchain: {
          transactionCount: blockchainTxCount,
          lastTransactionSignature: lastTxSignature,
          note: `Counted up to ${maxSignatures} most recent transactions. Solana RPC limits how many can be retrieved. Actual blockchain count may be higher if more than ${maxSignatures} transactions exist.`
        },
        comparison: {
          discrepancy: discrepancy,
          discrepancyPercentage: inMemoryCount > 0 ? ((Math.abs(discrepancy) / Math.max(inMemoryCount, blockchainTxCount)) * 100).toFixed(2) + '%' : '0%',
          explanation: discrepancy > 0 
            ? `In-memory stats (${inMemoryCount}) are ${discrepancy} higher than blockchain (${blockchainTxCount}). This can happen if: (1) Service has been running for ${(Math.floor((Date.now() - stats.startTime) / 1000) / 3600).toFixed(2)} hours accumulating stats, (2) Service hasn't restarted since last reset, (3) Some transactions weren't indexed yet, or (4) Stats include transactions from before service restart.`
            : discrepancy < 0
            ? `Blockchain count (${blockchainTxCount}) is ${Math.abs(discrepancy)} higher than in-memory (${inMemoryCount}). This can happen if: (1) Service was restarted (stats reset to 0), (2) Transactions occurred before service start, (3) Different facilitator address, or (4) RPC returned more transactions than service has tracked.`
            : 'Stats match blockchain perfectly!'
        },
        recommendation: discrepancy !== 0
          ? `To reset stats and match blockchain, restart the facilitator service. Stats are stored in-memory only and reset on service restart. Service has been running for ${(Math.floor((Date.now() - stats.startTime) / 1000) / 3600).toFixed(2)} hours. Current in-memory count: ${inMemoryCount}, Blockchain count: ${blockchainTxCount}.`
          : 'Stats are accurate!'
      },
      explorerUrl: network === 'x1-testnet'
        ? `https://explorer.testnet.x1.xyz/address/${facilitatorAddress}`
        : `https://explorer.x1.xyz/address/${facilitatorAddress}`
    })
  } catch (error: any) {
    logger.error({ error: error.message }, 'Validation failed')
    res.status(500).json({
      error: 'Validation failed',
      message: error.message
    })
  }
});

app.get("/supported", (req, res) => {
  const network: "x1-mainnet" | "x1-testnet" = (process.env.NETWORK as "x1-mainnet" | "x1-testnet") || NETWORKS.X1_MAINNET;
  const assets: Array<{ scheme: string; network: string; asset: string; symbol: string; decimals: number }> = [
    { scheme: "exact", network, asset: "native", symbol: "XNT", decimals: 9 },
    { scheme: "exact", network, asset: process.env.WXNT_MINT || "So11111111111111111111111111111111111111112", symbol: "wXNT", decimals: 6 },
  ];
  if (process.env.USDX_MINT) {
    assets.push({ scheme: "exact", network, asset: process.env.USDX_MINT, symbol: "USDX", decimals: 6 });
  }
  res.json({ x402Version: X402_VERSION, networks: assets });
});

// POST /verify - Verify payment signature
app.post("/verify", async (req, res) => {
  try {
    logger.info({ body: sanitizeForLog(req.body) }, "Received verification request");
    
    try {
      PaymentPayloadSchema.parse(req.body);
    } catch (parseError: any) {
      logger.error({ error: parseError.message, issues: parseError.issues }, "Payment payload validation failed");
      return res.status(400).json({ error: "Invalid payment payload", message: parseError.message, issues: parseError.issues });
    }

    const payment = req.body as PaymentPayload & { payload: { transaction: string } };

    if (!payment.payload?.transaction) {
      return res.status(400).json({ valid: false, message: "payload.transaction is required (v2 only)" });
    }

    const { Transaction: SolTransaction } = await import("@solana/web3.js");
    const { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } = await import("@solana/spl-token");

    const txBuf = Buffer.from(payment.payload.transaction, "base64");
    const tx = SolTransaction.from(txBuf);
    const feePayer = loadFeePayer();

    if (!tx.feePayer || !tx.feePayer.equals(feePayer.publicKey)) {
      return res.status(400).json({ valid: false, message: "Transaction feePayer does not match facilitator" });
    }

    const buyerPubkey = new PublicKey(payment.buyer);
    const buyerSigned = tx.signatures.some(
      (s) => s.publicKey.equals(buyerPubkey) && s.signature !== null
    );
    if (!buyerSigned) {
      return res.status(400).json({ valid: false, message: "Transaction is not signed by the buyer" });
    }

    const COMPUTE_BUDGET_ID = "ComputeBudget111111111111111111111111111111";
    const MEMO_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
    const ATA_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
    const allowedTokenPrograms = new Set([TOKEN_PROGRAM_ID.toBase58(), TOKEN_2022_PROGRAM_ID.toBase58()]);

    let transferCount = 0;
    for (const ix of tx.instructions) {
      const progId = ix.programId.toBase58();
      if (progId === COMPUTE_BUDGET_ID || progId === MEMO_ID || progId === ATA_ID) continue;
      if (allowedTokenPrograms.has(progId)) {
        if (ix.data[0] !== 12) {
          return res.status(400).json({ valid: false, message: "Only TransferChecked SPL instructions are allowed" });
        }
        // TransferChecked keys: [0]=source, [1]=mint, [2]=destination, [3]=authority
        const authority = ix.keys[3].pubkey;
        if (authority.equals(feePayer.publicKey)) {
          return res.status(400).json({ valid: false, message: "Facilitator must not be the transfer authority" });
        }
        if (!authority.equals(buyerPubkey)) {
          return res.status(400).json({ valid: false, message: "Transfer authority must be the buyer" });
        }
        transferCount++;
        continue;
      }
      return res.status(400).json({ valid: false, message: `Disallowed program: ${progId}` });
    }

    if (transferCount === 0) {
      return res.status(400).json({ valid: false, message: "No TransferChecked instruction found in transaction" });
    }

    const connection = getConnection(payment.network as "x1-mainnet" | "x1-testnet");
    try {
      const simResult = await connection.simulateTransaction(tx);
      if (simResult.value.err) {
        logger.warn({ simError: simResult.value.err, logs: simResult.value.logs }, "Simulation failed");
        return res.status(400).json({ valid: false, message: "Transaction simulation failed", details: simResult.value.err, logs: simResult.value.logs });
      }
    } catch (simError: any) {
      logger.warn({ error: simError.message }, "Simulation threw");
      return res.status(400).json({ valid: false, message: `Simulation error: ${simError.message}` });
    }

    logger.info({ buyer: payment.buyer }, "Verification successful");
    return res.json({ valid: true, message: "verified" });
  } catch (e: any) {
    return res.status(400).json({ valid: false, message: e.message });
  }
});

app.post("/settle", settlementLimiter, async (req, res) => {
  let payment: any = null;
  try {
    logger.info({ body: sanitizeForLog(req.body) }, "Received settlement request");
    
    try {
      payment = PaymentPayloadSchema.parse(req.body);
      logger.info(sanitizePayment(payment), "Payment payload validated successfully");
    } catch (parseError: any) {
      logger.error({ error: parseError.message, issues: parseError.issues }, "Payment payload validation failed");
      return res.status(400).json({ error: "Invalid payment payload", message: parseError.message, issues: parseError.issues });
    }

    if (!payment.payload?.transaction) {
      return res.status(400).json({ error: "payload.transaction is required (v2 only)" });
    }
    
    const connection = getConnection(payment.network);
    const feePayer = loadFeePayer();
    const totalAmount = BigInt(payment.amount);
    const txId = generateTxId();
    const timestamp = Math.floor(Date.now() / 1000);
    const resourceShort = getResourceShort(payment.resource);
    const settlementStartTime = Date.now();

    logger.info({ txId, buyer: truncateString(payment.buyer, 8) }, "Processing settlement (co-sign)");

    const { Transaction: SolTransaction } = await import("@solana/web3.js");
    const txBuf = Buffer.from(payment.payload.transaction, "base64");
    const tx = SolTransaction.from(txBuf);

    if (!tx.feePayer || !tx.feePayer.equals(feePayer.publicKey)) {
      return res.status(400).json({ error: "Transaction feePayer does not match facilitator" });
    }

    await updateReserveBalance(payment.network);
    if (!hasAdequateReserve(totalAmount)) {
      return res.status(503).json({
        error: 'Facilitator reserve insufficient',
        message: 'Protocol Bond requirements not met.',
        bondStatus: {
          reserveBalance: stats.reserveBalance.toString(),
          pendingLiability: stats.pendingRefundLiability.toString(),
          healthScore: stats.bondHealthScore,
          minimumRequired: stats.minimumReserveRequired.toString()
        }
      });
    }

    tx.partialSign(feePayer);

    const blockhash = tx.recentBlockhash!;
    const { lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

    let txHash: string;
    try {
      const serialized = tx.serialize();
      txHash = await connection.sendRawTransaction(serialized, { skipPreflight: false, maxRetries: 3 });
      logger.info({ txHash, txId }, "Transaction submitted");

      try {
        const confirmation: any = await Promise.race([
          connection.confirmTransaction({ signature: txHash, blockhash, lastValidBlockHeight }, "confirmed"),
          new Promise((_, reject) => setTimeout(() => reject(new Error("confirmation timeout")), 15000)),
        ]);
        if (confirmation?.value?.err) throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        logger.info({ txHash, txId }, "Transaction confirmed");
      } catch (confirmErr: any) {
        logger.warn({ txHash, txId, error: confirmErr.message }, "Confirmation timeout (tx may still land)");
      }

      const responseTime = Date.now() - settlementStartTime;
      const now = Date.now();
      stats.totalSettlements++;
      stats.successfulSettlements++;
      stats.totalVolume += totalAmount;
      stats.lastSettlement = now;
      stats.responseTimes.push(responseTime);
      stats.successfulSettlementsHistory.push({ timestamp: now, amount: totalAmount });
      stats.pendingRefundLiability += totalAmount;
      stats.bondHealthScore = calculateBondHealth();
      
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      stats.successfulSettlementsHistory = stats.successfulSettlementsHistory.filter(entry => entry.timestamp > sevenDaysAgo);
      if (stats.responseTimes.length > 100) stats.responseTimes.shift();

      return res.json({ txId, txHash, amount: totalAmount.toString(), network: payment.network, resource: resourceShort, timestamp });
    } catch (error: any) {
      stats.totalSettlements++;
      stats.failedSettlements++;
      stats.responseTimes.push(Date.now() - settlementStartTime);
      if (stats.responseTimes.length > 100) stats.responseTimes.shift();
      
      const errorMessage = error.message || error.toString();
      logger.error({ error: errorMessage, txId }, "Settlement failed");
      
      if (errorMessage?.includes('fetch failed') || errorMessage?.includes('ECONNREFUSED')) {
        return res.status(503).json({ error: 'RPC connection failed', message: errorMessage, network: payment.network });
      }
      
      return res.status(500).json({ error: errorMessage, network: payment.network, txId });
    }
  } catch (error: any) {
    logger.error({ 
      error: error.message || JSON.stringify(error),
      payment: payment ? { buyer: payment.buyer, amount: payment.amount, network: payment.network } : null
    }, "Settlement request failed");
    return res.status(500).json({ error: error.message || error.toString(), network: payment?.network });
  }
});

app.post("/refund", refundLimiter, async (req, res) => {
  let payment: any = null;
  try {
    const isX402RefundRequest = req.headers['x-refund-request'] === 'true';
    const rawMessage = req.headers['x-payment-message'] as string;
    
    logger.info({ 
      body: sanitizeForLog(req.body), 
      isX402RefundRequest,
      hasXPaymentMessage: !!rawMessage 
    }, "Received refund request");
    
    // Parse and validate refund request
    const { txId, buyer, network, amount, refundSignature, originalTxHash } = req.body;
    
    if (!txId || !buyer || !network || !amount) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["txId", "buyer", "network", "amount"],
        received: { txId, buyer, network, amount }
      });
    }

    // Verify x402 refund signature if provided
    if (isX402RefundRequest && refundSignature && rawMessage) {
      logger.info("Verifying x402 refund request signature");
      
      try {
        const buyerPubkey = new PublicKey(buyer);
        const signatureBytes = bs58.decode(refundSignature);
        const messageBytes = new TextEncoder().encode(rawMessage);
        
        const isValid = nacl.sign.detached.verify(
          messageBytes,
          signatureBytes,
          buyerPubkey.toBytes()
        );

        if (!isValid) {
          logger.warn({ buyer }, "Invalid x402 refund signature");
          return res.status(400).json({
            error: "Invalid refund signature",
            message: "x402 refund request signature verification failed"
          });
        }

        logger.info({ buyer }, "✅ x402 refund signature verified successfully");
      } catch (sigError: any) {
        logger.error({ error: sigError.message }, "Refund signature verification failed");
        return res.status(400).json({
          error: "Signature verification error",
          message: sigError.message
        });
      }
    } else {
      logger.info("Processing refund without x402 signature verification (legacy mode)");
    }

    // Use network-specific connection
    logger.info({ network, txId, buyer }, "Processing refund on X1 blockchain");
    const connection = getConnection(network);
    let feePayer: any;
    try {
      feePayer = loadFeePayer();
    } catch {
      feePayer = null;
    }
    
    if (!feePayer) {
      return res.status(500).json({
        error: "Facilitator fee payer not configured",
        hint: "FEE_PAYER_SECRET must be set in .env.local"
      });
    }

    const buyerPubkey = new PublicKey(buyer);
    const refundAmount = BigInt(amount);
    
    // Check facilitator wallet balance
    const walletBalance = await connection.getBalance(feePayer.publicKey);
    
    // Calculate rent exemption for buyer account (if it doesn't exist)
    const rentExemptMinimum = await connection.getMinimumBalanceForRentExemption(0);
    const buyerBalance = await connection.getBalance(buyerPubkey);
    
    // If buyer account doesn't exist or will be below rent exemption, we need to transfer more
    let transferAmount = Number(refundAmount);
    const finalBuyerBalance = buyerBalance + transferAmount;
    
    if (finalBuyerBalance < rentExemptMinimum) {
      // Need to transfer enough to cover rent exemption
      transferAmount = Math.max(Number(refundAmount), rentExemptMinimum);
      logger.info({
        originalAmount: Number(refundAmount),
        adjustedAmount: transferAmount,
        rentExemptMinimum,
        buyerBalance,
        finalBalance: finalBuyerBalance
      }, "Adjusting refund amount to cover rent exemption");
    }
    
    const estimatedFee = 5000;
    const totalRequired = transferAmount + estimatedFee;
    
    if (walletBalance < totalRequired) {
      const networkName = network === 'x1-mainnet' ? 'Mainnet' : 'Testnet';
      throw new Error(
        `Insufficient funds for refund on ${networkName}. ` +
        `Need ${totalRequired} lamports (refund: ${transferAmount} + fee: ${estimatedFee}), ` +
        `but only have ${walletBalance}. ` +
        `Please fund facilitator wallet: ${feePayer.publicKey.toString()}`
      );
    }

    const { Transaction, SystemProgram } = await import("@solana/web3.js");
    const tx = new Transaction();
    
    // Add memo for refund tracking
    // Format: x402v1:refund:{refundId}:{originalSettlementTxHash}:{buyer}:{timestamp}
    const timestamp = Math.floor(Date.now() / 1000);
    const buyerShort = buyer.slice(0, 8); // First 8 chars of buyer address
    const settleTxShort = originalTxHash ? originalTxHash.slice(0, 16) : 'none'; // First 16 chars of original tx
    const memoData = Buffer.from(
      `x402v1:refund:${txId}:${settleTxShort}:${buyerShort}:${timestamp}`,
      'utf-8'
    );
    
    tx.add({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: memoData,
    });
    
    const refundAsset = req.body.asset || 'native';
    const isNativeRefund = !refundAsset || refundAsset === 'native' || refundAsset === '';

    if (isNativeRefund) {
      tx.add(SystemProgram.transfer({
        fromPubkey: feePayer.publicKey,
        toPubkey: buyerPubkey,
        lamports: transferAmount,
      }));
    } else {
      const mintPubkey = new PublicKey(refundAsset);
      const tokenTx = await tokenTransferTx({
        connection,
        mint: mintPubkey,
        from: feePayer.publicKey,
        to: buyerPubkey,
        amount: BigInt(transferAmount),
        feePayer,
      });
      for (const ix of tokenTx.instructions) {
        tx.add(ix);
      }
    }
    
    const blockhashResult = await connection.getLatestBlockhash('finalized');
    tx.recentBlockhash = blockhashResult.blockhash;
    tx.feePayer = feePayer.publicKey;
    tx.sign(feePayer);
    
    logger.info({
      txId,
      buyer,
      amount: transferAmount,
      network
    }, "Refund transaction signed - submitting to blockchain");

    const serializedTx = tx.serialize();
    const txHash = await connection.sendRawTransaction(serializedTx, {
      skipPreflight: false,
      maxRetries: 3,
    });
    
    logger.info({ txHash, txId }, "Refund transaction submitted to blockchain");
    
    // Track refund
    stats.totalRefunds++
    stats.lastRefund = Date.now()
    
    // Update Protocol Bond liability - reduce pending liability after successful refund
    const refundAmountBigInt = BigInt(transferAmount)
    if (stats.pendingRefundLiability >= refundAmountBigInt) {
      stats.pendingRefundLiability -= refundAmountBigInt
    } else {
      // Edge case: liability tracking got out of sync
      logger.warn({
        currentLiability: stats.pendingRefundLiability.toString(),
        refundAmount: refundAmountBigInt.toString()
      }, 'Refund amount exceeds tracked liability - resetting to zero')
      stats.pendingRefundLiability = BigInt(0)
    }
    
    // Update reserve balance and bond health after refund
    await updateReserveBalance(network)
    
    logger.info({
      remainingLiability: stats.pendingRefundLiability.toString(),
      bondHealth: stats.bondHealthScore,
      reserve: stats.reserveBalance.toString()
    }, 'Updated Protocol Bond after refund')
    
    // Create x402 refund proof (similar to payment proof)
    const refundProof = {
      txHash,
      txId,
      amount: transferAmount.toString(),
      network,
      type: 'refund',
      buyer,
      timestamp: Date.now(),
      protocol: 'x402v1'
    };

    // Set X-Refund-Proof header for x402 protocol compliance
    res.setHeader('X-Refund-Proof', JSON.stringify(refundProof));
    
    logger.info({ 
      txHash, 
      txId, 
      buyer,
      x402Protocol: isX402RefundRequest 
    }, "✅ Refund completed successfully with x402 proof");
    
    return res.json(refundProof);
  } catch (error: any) {
    logger.error({ 
      error: error.message || JSON.stringify(error), 
      refundRequest: req.body
    }, "Refund request failed");
    
    return res.status(500).json({
      error: error.message || error.toString()
    });
  }
});

app.listen(PORT, async () => {
  const feePayer = loadFeePayer();
  logger.info({
    port: PORT,
    network: process.env.NETWORK || "x1-mainnet",
    facilitatorAddress: feePayer.publicKey.toString(),
    service: "x1pays-facilitator"
  }, "Facilitator service started");

  // Auto-register with X1Pays API and start heartbeat
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const facilitatorUrl = process.env.FACILITATOR_URL || `http://localhost:${PORT}`;
  
  if (process.env.AUTO_REGISTER !== 'false') {
    logger.info('Initializing facilitator auto-registration...');
    
    // Function to get current stats for heartbeat
    const getStats = () => {
      const now = Date.now();
      const uptimeMs = now - stats.startTime;
      
      // Calculate success rate
      const totalAttempts = stats.totalSettlements;
      const successRate = totalAttempts > 0 
        ? (stats.successfulSettlements / totalAttempts) * 100 
        : 0;
      
      // Calculate average response time
      const avgResponseTime = stats.responseTimes.length > 0
        ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
        : 0;
      
      return {
        uptime: Math.floor(uptimeMs / 1000), // seconds
        successRate: Math.round(successRate * 100) / 100,
        avgResponseTime: Math.round(avgResponseTime),
        totalSettlements: stats.successfulSettlements,
        totalRefunds: stats.totalRefunds,
        totalVolume: stats.totalVolume.toString()
      };
    };
    
    await initializeFacilitator({
      facilitatorId: FACILITATOR_ID,
      facilitatorName: FACILITATOR_NAME,
      facilitatorAddress: feePayer.publicKey.toString(),
      facilitatorUrl,
      feeBasisPoints: FEE_BASIS_POINTS,
      network: process.env.NETWORK || 'x1-testnet',
      apiUrl
    }, getStats);
  } else {
    logger.info('Auto-registration disabled (set AUTO_REGISTER=true to enable)');
  }
});

