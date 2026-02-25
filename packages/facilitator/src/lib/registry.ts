/**
 * Facilitator Auto-Registration and Heartbeat System
 * 
 * Automatically registers the facilitator with the X1Pays API on startup
 * and sends periodic heartbeats to maintain active status.
 */

import pino from 'pino';

const logger = pino({ 
  transport: { target: 'pino-pretty' },
  base: { module: 'registry' }
});

interface RegistrationConfig {
  facilitatorId: string;
  facilitatorName: string;
  facilitatorAddress: string;
  facilitatorUrl: string;
  feeBasisPoints: number;
  network?: string;
  apiUrl: string;
}

interface HeartbeatStats {
  uptime: number;
  successRate: number;
  avgResponseTime: number;
  totalSettlements: number;
  totalRefunds?: number;
  totalVolume?: string;
}

let heartbeatInterval: NodeJS.Timeout | null = null;

/**
 * Register facilitator with the X1Pays API
 */
export async function registerFacilitator(config: RegistrationConfig): Promise<boolean> {
  const {
    facilitatorId,
    facilitatorName,
    facilitatorAddress,
    facilitatorUrl,
    feeBasisPoints,
    network = 'x1-testnet',
    apiUrl
  } = config;

  try {
    logger.info({
      id: facilitatorId,
      name: facilitatorName,
      url: facilitatorUrl,
      apiUrl
    }, 'Registering facilitator with X1Pays API...');

    const response = await fetch(`${apiUrl}/facilitators/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: facilitatorId,
        name: facilitatorName,
        address: facilitatorAddress,
        url: facilitatorUrl,
        feeBasisPoints,
        network
      }),
      signal: AbortSignal.timeout(10000) // 10s timeout
    });

    if (response.ok) {
      const data = await response.json() as any;
      logger.info({
        id: facilitatorId,
        status: data.facilitator?.status
      }, '✅ Facilitator registered successfully');
      return true;
    } else if (response.status === 409) {
      const errBody = await response.json() as any;
      logger.info({
        id: facilitatorId,
        message: errBody.error
      }, 'ℹ️  Facilitator already registered');
      return true;
    } else {
      const errBody = await response.json() as any;
      logger.error({
        id: facilitatorId,
        status: response.status,
        error: errBody.error,
        details: errBody.details
      }, '❌ Facilitator registration failed');
      return false;
    }
  } catch (error: any) {
    logger.error({
      id: facilitatorId,
      error: error.message
    }, '❌ Failed to register facilitator (network error)');
    return false;
  }
}

/**
 * Send heartbeat to X1Pays API
 */
export async function sendHeartbeat(
  facilitatorId: string,
  apiUrl: string,
  stats?: HeartbeatStats
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/facilitators/heartbeat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: facilitatorId,
        stats
      }),
      signal: AbortSignal.timeout(5000) // 5s timeout
    });

    if (response.ok) {
      logger.debug({ id: facilitatorId }, '💓 Heartbeat sent successfully');
      return true;
    } else {
      const errBody = await response.json() as any;
      logger.warn({
        id: facilitatorId,
        status: response.status,
        error: errBody.error
      }, '⚠️  Heartbeat failed');
      return false;
    }
  } catch (error: any) {
    logger.warn({
      id: facilitatorId,
      error: error.message
    }, '⚠️  Heartbeat failed (network error)');
    return false;
  }
}

/**
 * Start sending periodic heartbeats
 */
export function startHeartbeat(
  facilitatorId: string,
  apiUrl: string,
  getStats: () => HeartbeatStats,
  intervalMs: number = 5 * 60 * 1000 // 5 minutes
): void {
  if (heartbeatInterval) {
    logger.warn('Heartbeat already running');
    return;
  }

  logger.info({
    id: facilitatorId,
    intervalMs
  }, '💓 Starting heartbeat service...');

  // Send initial heartbeat
  sendHeartbeat(facilitatorId, apiUrl, getStats()).catch((err) => {
    logger.error({ error: err }, 'Initial heartbeat failed');
  });

  // Start periodic heartbeats
  heartbeatInterval = setInterval(() => {
    sendHeartbeat(facilitatorId, apiUrl, getStats()).catch((err) => {
      logger.error({ error: err }, 'Heartbeat failed');
    });
  }, intervalMs);
}

/**
 * Stop heartbeat service
 */
export function stopHeartbeat(): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    logger.info('Heartbeat service stopped');
  }
}

/**
 * Initialize facilitator - register and start heartbeat
 */
export async function initializeFacilitator(
  config: RegistrationConfig,
  getStats: () => HeartbeatStats
): Promise<boolean> {
  // Step 1: Register with API
  const registered = await registerFacilitator(config);
  
  if (!registered) {
    logger.error('Failed to register facilitator - heartbeat will not start');
    return false;
  }

  // Step 2: Start heartbeat
  startHeartbeat(config.facilitatorId, config.apiUrl, getStats);

  logger.info({
    id: config.facilitatorId,
    name: config.facilitatorName
  }, '✅ Facilitator initialization complete');

  return true;
}

