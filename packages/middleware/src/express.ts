import type { Request, Response, NextFunction } from 'express';
import type { X402Config, PaymentPayload } from './types.js';
import { createPaymentRequirement, validatePayment, verifyPayment, settlePayment, X402Error } from './core.js';

// Helper: Format amount in human-readable format
function formatAmount(amount: string, asset: string): string {
  if (!amount) return "unknown";
  // For Solana (lamports), convert to human-readable
  // Solana uses 1 billion lamports = 1 SOL
  // For wXNT (wrapped), it's typically 1 billion lamports = 1 wXNT
  const amountNum = parseInt(amount, 10);
  const assetSymbol = getAssetSymbol(asset);
  
  if (amountNum >= 1000000000) {
    return `${(amountNum / 1000000000).toFixed(6)} ${assetSymbol}`;
  } else if (amountNum >= 1000000) {
    return `${(amountNum / 1000000).toFixed(3)} ${assetSymbol}`;
  } else if (amountNum >= 1000) {
    // For 1000 lamports, show as 0.000001 wXNT
    return `${(amountNum / 1000000000).toFixed(9)} ${assetSymbol}`;
  } else {
    // Fallback: show lamports with asset symbol hint
    return `${amount} lamports (${assetSymbol})`;
  }
}

// Helper: Get asset symbol from mint address
function getAssetSymbol(asset: string): string {
  if (!asset) return "unknown";
  // Map common token mints to symbols
  const symbolMap: Record<string, string> = {
    'native': 'XNT',
    'So11111111111111111111111111111111111111112': 'wXNT',
    'B69chRzqzDCmdB5WYB8NRu5Yv5ZA95ABiZcdzCgGm9Tq': 'USDX',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
  };
  
  return symbolMap[asset] || asset.slice(0, 6) + '...' + asset.slice(-4);
}

// Helper: Get facilitator name from URL
function getFacilitatorName(facilitatorUrl: string): string {
  if (!facilitatorUrl) return "unknown";
  // Extract name from URL or use default
  if (facilitatorUrl.includes('localhost:4000') || facilitatorUrl.includes('alpha')) {
    return 'Alpha';
  }
  if (facilitatorUrl.includes('beta')) {
    return 'Beta';
  }
  if (facilitatorUrl.includes('gamma')) {
    return 'Gamma';
  }
  // Default to Alpha for backward compatibility
  return 'Alpha';
}

// Helper: Get facilitator fee from URL or config
function getFacilitatorFee(facilitatorUrl: string): string {
  if (!facilitatorUrl) return "unknown";
  // For now, return default fee. In the future, this could query a facilitator registry
  if (facilitatorUrl.includes('localhost:4000') || facilitatorUrl.includes('alpha')) {
    return '0.0%';
  }
  if (facilitatorUrl.includes('beta')) {
    return '1.0%';
  }
  if (facilitatorUrl.includes('gamma')) {
    return '2.0%';
  }
  // Default to 0.0% for backward compatibility
  return '0.0%';
}

// Helper: Get facilitator address
function getFacilitatorAddress(facilitatorUrl: string): string {
  if (!facilitatorUrl) return "unknown";
  // For now, return the default facilitator address
  // In the future, this could query a facilitator registry or config
  // The facilitator wallet address on X1/Solana
  return 'J7s6Lsg6oY1g1Xj2VCRgu1kZ8JjZyMudCrEminPJRCec';
}

export function x402(config: X402Config) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentHeader = req.headers['x-payment'];

    // No payment provided - return 402 with payment requirements
    if (!paymentHeader) {
      const amount = config.getDynamicAmount 
        ? await config.getDynamicAmount(req)
        : config.amount;

      const requirement = await createPaymentRequirement(config, req.originalUrl, amount);
      
      // Get facilitators for the formatted response
      let facilitators: Array<{
        name: string
        fee: string
        endpoint: string
        address: string
        live: boolean
        status: string
      }> = []
      
      // Try to get facilitators from config or registry
      if (config.facilitators && config.facilitators.length > 0) {
        // Use facilitators from config
        facilitators = config.facilitators
          .filter(f => f.status === 'active')
          .map(f => ({
            name: f.name,
            fee: (f.fee / 100).toFixed(1) + '%',
            endpoint: `/api/facilitators/${f.id}`,
            address: f.address || getFacilitatorAddress(f.url),
            live: f.status === 'active',
            status: f.status === 'active' ? '🟢 LIVE' : '⚫ INACTIVE'
          }))
      } else if (config.facilitatorRegistryUrl) {
        // Fetch facilitators from registry
        try {
          const { getFacilitatorsFromRegistry } = await import('./registry.js')
          const registryFacilitators = await getFacilitatorsFromRegistry(
            config.facilitatorRegistryUrl,
            config.network
          )
          facilitators = registryFacilitators
            .filter(f => f.status === 'active')
            .map(f => ({
              name: f.name,
              fee: (f.fee / 100).toFixed(1) + '%',
              endpoint: `/api/facilitators/${f.id}`,
              address: f.address || '',
              live: f.status === 'active',
              status: f.status === 'active' ? '🟢 LIVE' : '⚫ INACTIVE'
            }))
        } catch (error) {
          console.warn('Failed to fetch facilitators from registry, using fallback:', error)
        }
      }
      
      // Fallback: if no facilitators found, use default facilitator
      if (facilitators.length === 0 && config.facilitatorUrl) {
        facilitators = [{
          name: getFacilitatorName(config.facilitatorUrl),
          fee: getFacilitatorFee(config.facilitatorUrl),
          endpoint: '/api/facilitators/alpha',
          address: getFacilitatorAddress(config.facilitatorUrl),
          live: true,
          status: '🟢 LIVE'
        }]
      }
      
      // Transform to user-friendly format
      const formattedResponse = {
        price: formatAmount(amount || '1000', config.tokenMint),
        asset: config.tokenMint,
        facilitators: facilitators
      };
      
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Payment-Required', JSON.stringify(requirement));
      return res.status(402).json(formattedResponse);
    }

    let payment: PaymentPayload;
    try {
      payment = JSON.parse(String(paymentHeader));
    } catch {
      return res.status(400).json({ error: "Invalid X-Payment header: not valid JSON" });
    }

    try {
      const facilitatorUrlHeader = req.headers['x-facilitator-url'] as string;
      const facilitatorUrl = facilitatorUrlHeader || config.facilitatorUrl || 'http://localhost:4003';

      const requiredAmount = config.getDynamicAmount
        ? await config.getDynamicAmount(req)
        : config.amount;

      validatePayment(payment, config, requiredAmount);

      // If payment already includes a txHash, it was already settled on-chain.
      // Skip verify/settle and grant access.
      if (payment.txHash) {
        res.locals.txHash = payment.txHash;
        res.locals.amount = payment.amount;
        res.locals.network = payment.network;

        res.setHeader('X-Payment-Response', JSON.stringify({
          txHash: payment.txHash,
          amount: payment.amount,
          network: payment.network,
        }));

        return next();
      }

      // First-time payment: verify signature then settle on-chain
      const verifyResult = await verifyPayment(facilitatorUrl, payment);
      if (!verifyResult.valid) {
        throw new X402Error('Payment verification failed', 402, verifyResult);
      }

      let settlement: any;
      try {
        settlement = await settlePayment(facilitatorUrl, payment);
      } catch (error: any) {
        if (error instanceof X402Error) throw error;
        throw new X402Error(
          `Payment settlement failed: ${error.message || 'Unknown error'}`,
          400,
          { originalError: error.message }
        );
      }

      res.locals.txHash = settlement?.txHash || null;
      res.locals.amount = settlement?.amount || null;
      res.locals.network = settlement?.network || null;

      res.setHeader('X-Payment-Response', JSON.stringify({
        txHash: settlement?.txHash || null,
        amount: settlement?.amount || null,
        network: settlement?.network || null,
      }));

      return next();
    } catch (error: any) {
      if (error instanceof X402Error) {
        return res.status(error.statusCode).json({
          error: error.message,
          details: error.details
        });
      }

      return res.status(402).json({
        error: 'Invalid or missing payment',
        details: error.message
      });
    }
  };
}

export { x402 as x402Middleware };
export default x402;
