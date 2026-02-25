import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pino from "pino";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { x402Middleware } from "@x1pay/middleware/express";
import { x420 } from "./middleware/x420.js";
import premium from "./routes/premium.js";
import echo from "./routes/echo.js";
import facilitators from "./routes/facilitators.js";

const PORT = Number(process.env.PORT || 3000);
const logger = pino({ transport: { target: "pino-pretty" } });
const app = express();

// Trust proxy - 1 hop (nginx)
app.set('trust proxy', 1);

// Whitelist allowed origins for security
const ALLOWED_ORIGINS = [
  'https://x1pays.xyz',
  'https://www.x1pays.xyz',
  process.env.ALLOWED_ORIGIN, // Custom origin from .env
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
  process.env.NODE_ENV === 'development' ? 'http://localhost:5174' : null,
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : null,
  process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5000' : null,
].filter(Boolean);

// Security middleware - Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false, // Allow embedding for SDK usage
}));

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 payment requests per minute per IP
  message: 'Too many payment requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use buyer address from payment if available, otherwise IP
    const payment = req.headers['x-payment'];
    if (payment && typeof payment === 'string') {
      try {
        const parsed = JSON.parse(payment);
        return `payment:${parsed.buyer || req.ip}`;
      } catch {
        return `payment:${req.ip}`;
      }
    }
    return `payment:${req.ip}`;
  },
});

const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Very strict for sensitive operations
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost and IP addresses on common ports
    if (process.env.NODE_ENV === 'development') {
      const devPattern = /^https?:\/\/(localhost|127\.0\.0\.1|(\d{1,3}\.){3}\d{1,3}):(5000|5173|5174|3000|4000|4001|4002)$/;
      if (devPattern.test(origin)) {
        return callback(null, true);
      }
    }
    
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn({ origin }, 'Blocked CORS request from unauthorized origin');
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  exposedHeaders: ['X-Payment-Response', 'X-Payment-Required', 'X-Refund-Proof'],
  maxAge: 86400, // Cache preflight for 24h
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Payment', 'X-Payment-Message', 'X-Refund-Request', 'X-API-Key', 'X-Facilitator-Id', 'X-Facilitator-Url']
}));

// Body parsing with size limits
app.use(bodyParser.json({ limit: '10kb' })); // Prevent large payload attacks

// Sanitize data to prevent injection attacks
app.use(mongoSanitize());

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Middleware for API key authentication on admin endpoints
const apiKeyAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const validKeys = (process.env.ADMIN_API_KEYS || '').split(',').filter(Boolean);
  
  // In development, allow bypass if no keys configured
  if (process.env.NODE_ENV === 'development' && validKeys.length === 0) {
    logger.warn('API key check bypassed - no ADMIN_API_KEYS configured in development');
    return next();
  }
  
  if (!apiKey || !validKeys.includes(apiKey as string)) {
    logger.warn({ ip: req.ip, path: req.path }, 'Unauthorized admin endpoint access attempt');
    return res.status(401).json({ error: 'Unauthorized - Valid API key required' });
  }
  
  next();
};

app.get("/health", (_req, res) => res.json({ ok: true, service: "x1pays-api" }));

// Stats endpoint - public for website access (rate limited for security)
app.get("/stats", strictLimiter, async (req, res) => {
  try {
    // Get network from query param
    const network = (req.query.network as string) || 'x1-mainnet'
    if (network !== 'x1-mainnet' && network !== 'x1-testnet') {
      return res.status(400).json({ error: "Invalid network. Must be x1-mainnet or x1-testnet" });
    }
    const validateBlockchain = req.query.validate === 'true'
    
    // Fetch real facilitator stats (with optional blockchain validation)
    const facilitatorUrl = process.env.FACILITATOR_URL || 'http://localhost:4003'
    const validateParam = validateBlockchain ? '&validate=true&network=' + network : ''
    let realStats: any = {}
    let facilitatorHealthy = false
    
    try {
      const statsResponse = await fetch(`${facilitatorUrl}/stats?network=${network}${validateParam}`)
      if (statsResponse.ok) {
        realStats = await statsResponse.json()
        facilitatorHealthy = true
        
        // Log warning if stats seem high
        if (realStats.successfulSettlements > 100) {
          logger.warn({
            successfulSettlements: realStats.successfulSettlements,
            serviceUptimeHours: realStats._debug?.serviceUptimeHours,
            facilitatorAddress: realStats._debug?.facilitatorAddress,
            warning: 'Stats appear high - service may need restart to reset'
          }, 'High facilitator stats detected')
        }
      }
    } catch (error) {
      logger.warn({ error }, 'Failed to fetch facilitator stats')
    }

    // Calculate real stats from facilitator data
    // IMPORTANT: Use successfulSettlements (which now auto-validates against blockchain)
    // The facilitator endpoint now automatically returns blockchain count if discrepancy is large
    let totalPayments = realStats.successfulSettlements || 0
    
    // Log if blockchain validation was used
    if (realStats.blockchainValidation && realStats.blockchainValidation.usingBlockchain) {
      logger.info({
        inMemory: realStats.successfulSettlementsInMemory || realStats.successfulSettlements,
        blockchain: realStats.blockchainValidation.blockchainCount,
        usingBlockchain: true,
        note: 'Using blockchain count due to large discrepancy'
      }, 'Using blockchain-validated stats')
    }
    
    // Fallback: If blockchain validation was done but not used, check discrepancy manually
    if (realStats.blockchainValidation && !realStats.blockchainValidation.error && !realStats.blockchainValidation.usingBlockchain) {
      const discrepancy = Math.abs(realStats.blockchainValidation.discrepancy)
      const discrepancyPercent = totalPayments > 0 ? (discrepancy / totalPayments) * 100 : 0
      
      // If discrepancy is > 50%, prefer blockchain count (stats likely accumulated)
      if (discrepancyPercent > 50 && realStats.blockchainValidation.blockchainCount < totalPayments) {
        logger.warn({
          inMemory: totalPayments,
          blockchain: realStats.blockchainValidation.blockchainCount,
          discrepancy: realStats.blockchainValidation.discrepancy,
          action: 'Using blockchain count instead of in-memory (stats likely accumulated)'
        }, 'Large discrepancy detected - using blockchain count')
        totalPayments = realStats.blockchainValidation.blockchainCount
      }
    }
    
    logger.info({ 
      totalPayments, 
      facilitatorHealthy, 
      facilitatorUrl,
      realStatsSuccessfulSettlements: realStats.successfulSettlements,
      blockchainValidation: realStats.blockchainValidation?.blockchainCount,
      usedBlockchain: realStats.blockchainValidation && totalPayments !== realStats.successfulSettlements
    }, 'Calculated network stats from facilitator')
    const totalVolumeLamports = realStats.totalVolume ? BigInt(realStats.totalVolume) : BigInt(0)
    const totalVolumeWXNT = (Number(totalVolumeLamports) / 1_000_000_000).toFixed(6)
    
    // Fetch facilitator list to count active
    // Get network from query param or default to testnet (Alpha is on testnet!)
    const requestedNetwork = (req.query.network as string) || 'x1-mainnet'
    let activeFacilitators = 0
    let totalFacilitators = 3
    let avgFeeBasisPoints = 0
    try {
      const registryUrl = process.env.FACILITATOR_REGISTRY_URL || `http://localhost:${PORT}`
      logger.info({ requestedNetwork, registryUrl }, 'Fetching facilitators for stats')
      const facilitatorsResponse = await fetch(`${registryUrl}/api/facilitators?network=${requestedNetwork}&health=true`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      if (facilitatorsResponse.ok) {
        const facilitatorsData = await facilitatorsResponse.json() as any
        const facilitatorsList = facilitatorsData.facilitators || []
        // Count active - check both status field and health status
        activeFacilitators = facilitatorsList.filter((f: any) => {
          const statusActive = f.status === 'active' || f.status === 'ACTIVE'
          const healthActive = f.health && (f.health.status === 'healthy' || f.health.status === 'HEALTHY')
          return statusActive || healthActive
        }).length
        totalFacilitators = (facilitatorsData as any).total || facilitatorsList.length || 3
        // Average fee across active facilitators (basis points)
        const activeList = facilitatorsList.filter((f: any) => {
          const statusActive = f.status === 'active' || f.status === 'ACTIVE'
          const healthActive = f.health && (f.health.status === 'healthy' || f.health.status === 'HEALTHY')
          return statusActive || healthActive
        })
        if (activeList.length > 0) {
          const sum = activeList.reduce((acc: number, f: any) => acc + (f.fee || 0), 0)
          avgFeeBasisPoints = Math.round(sum / activeList.length)
        } else {
          avgFeeBasisPoints = 0
        }
        
        logger.info({ 
          activeFacilitators, 
          totalFacilitators,
          facilitators: facilitatorsList.map((f: any) => ({ 
            id: f.id, 
            status: f.status, 
            healthStatus: f.health?.status,
            isCounted: f.status === 'active' || (f.health && f.health.status === 'healthy')
          }))
        }, 'Fetched facilitator list with health checks')
      } else {
        logger.warn({ 
          status: facilitatorsResponse.status, 
          registryUrl 
        }, 'Failed to fetch facilitator list - non-200 response')
        // Fallback: if facilitator is healthy, assume at least 1 active
        if (facilitatorHealthy) {
          activeFacilitators = 1
        }
      }
    } catch (error: any) {
      logger.warn({ error: error.message, code: error.code }, 'Failed to fetch facilitator list')
      // Fallback: if facilitator is healthy, assume at least 1 active
      if (facilitatorHealthy) {
        activeFacilitators = 1
      }
    }

    const avgPaymentSizeLamports = totalPayments > 0 
      ? (Number(totalVolumeLamports) / totalPayments)
      : 0
    const avgPaymentSizeWXNT = (avgPaymentSizeLamports / 1_000_000_000).toFixed(9)

    const stats = {
      totalPayments: totalPayments,
      totalVolume: totalVolumeLamports.toString(),
      totalVolumeWXNT: totalVolumeWXNT,
      avgPaymentSize: avgPaymentSizeLamports.toString(),
      avgPaymentSizeWXNT: avgPaymentSizeWXNT,
      avgFee: `${(avgFeeBasisPoints / 100).toFixed(1)}%`,
      activeFacilitators: activeFacilitators || (facilitatorHealthy ? 1 : 0),
      treasuryBalance: "0",
      merchantCount: 0, // Real count would need merchant registry
      network: requestedNetwork,
      uptime: realStats.uptime || 0,
      successRate: realStats.successRate || 0,
      avgResponseTime: realStats.avgResponseTime || 0,
      totalRefunds: realStats.totalRefunds || 0,
      last24h: {
        payments: realStats.last24h?.payments || 0,  // Real count from facilitator
        volume: realStats.last24h?.volume ? (Number(BigInt(realStats.last24h.volume)) / 1_000_000_000).toFixed(6) : "0"  // Real volume converted to WXNT
      },
      facilitators: {
        total: totalFacilitators,
        active: activeFacilitators,
        inactive: totalFacilitators - activeFacilitators
      }
    };
    
    res.json(stats);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch stats')
    // Fallback stats
    res.json({
      totalPayments: 0,
      totalVolume: "0",
      avgPaymentSize: "0",
      avgFee: "0.0%",
      activeFacilitators: 0,
      treasuryBalance: "0",
      merchantCount: 0,
      network: (req.query.network as string) || 'x1-mainnet',
      last24h: {
        payments: 0,
        volume: "0"
      },
      facilitators: {
        total: 3,
        active: 0,
        inactive: 3
      }
    });
  }
});

// Facilitator registry endpoints
app.use("/api/facilitators", facilitators);
app.use("/facilitators", facilitators); // Also support direct access for backward compatibility

// Apply payment rate limiting to payment routes
app.use("/premium", paymentLimiter, x420(), x402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4003",
  network: process.env.NETWORK || "x1-mainnet",
  payToAddress: process.env.PAYTO_ADDRESS || "",
  tokenMint: process.env.WXNT_MINT || "",
  acceptedAssets: [process.env.USDX_MINT || "B69chRzqzDCmdB5WYB8NRu5Yv5ZA95ABiZcdzCgGm9Tq", "native"],
  amount: "1000",
  description: "Premium API access"
}), premium);

app.use("/echo", paymentLimiter, x402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4003",
  network: process.env.NETWORK || "x1-mainnet",
  payToAddress: process.env.ECHO_MERCHANT_ADDRESS || process.env.PAYTO_ADDRESS || "",
  tokenMint: process.env.WXNT_MINT || "",
  acceptedAssets: [process.env.USDX_MINT || "B69chRzqzDCmdB5WYB8NRu5Yv5ZA95ABiZcdzCgGm9Tq", "native"],
  amount: "1000",
  description: "x402 Echo Test - 100% Refund Guaranteed"
}), echo);

// POST /refund - Forward refund requests to facilitator (with payment rate limiting)
app.post('/refund', paymentLimiter, async (req, res) => {
  try {
    if (!req.body || (!req.body.txHash && !req.headers['x-payment'])) {
      return res.status(400).json({ error: 'Refund request must include txHash in body or X-Payment header' });
    }
    
    const facilitatorUrl = process.env.FACILITATOR_URL || 'http://localhost:4003';
    
    // Forward all headers and body to facilitator
    const response = await fetch(`${facilitatorUrl}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Payment': req.headers['x-payment'] as string || '',
        'X-Payment-Message': req.headers['x-payment-message'] as string || '',
        'X-Refund-Request': req.headers['x-refund-request'] as string || '',
      },
      body: JSON.stringify(req.body),
    });

    let data: any;
    try {
      data = await response.json();
    } catch {
      return res.status(502).json({ error: 'Invalid response from facilitator' });
    }
    
    // Forward the X-Refund-Proof header if present
    const refundProof = response.headers.get('x-refund-proof');
    if (refundProof) {
      res.setHeader('X-Refund-Proof', refundProof);
    }

    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('❌ API: Refund forwarding failed:', error.message);
    res.status(500).json({ error: 'Failed to process refund', message: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => logger.info(`🚀 API up on 0.0.0.0:${PORT}`));
