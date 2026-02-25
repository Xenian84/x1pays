import axios from 'axios';
import type { X402Config, PaymentPayload, PaymentRequirement, SettlementResponse, VerifyResponse } from './types.js';
import { getFacilitatorsFromRegistry, selectBestFacilitator, type FacilitatorSelectionCriteria } from './registry.js';

// Define error classes locally for now (will migrate to @x1pay/client once published)
export class X402Error extends Error {
  constructor(
    message: string,
    public statusCode: number = 402,
    public details?: any
  ) {
    super(message);
    this.name = 'X402Error';
  }
}

export class InvalidSignatureError extends X402Error {
  constructor(message: string = 'Payment signature is invalid', details?: any) {
    super(message, 400, details);
    this.name = 'InvalidSignatureError';
  }
}

export class InsufficientFundsError extends X402Error {
  constructor(message: string = 'Wallet has insufficient funds for payment', details?: any) {
    super(message, 402, details);
    this.name = 'InsufficientFundsError';
  }
}

export class NetworkError extends X402Error {
  constructor(message: string = 'Network request failed', details?: any) {
    super(message, 503, details);
    this.name = 'NetworkError';
  }
}

export class PaymentTimeoutError extends X402Error {
  constructor(message: string = 'Payment settlement timed out', details?: any) {
    super(message, 504, details);
    this.name = 'PaymentTimeoutError';
  }
}

export class InvalidAmountError extends X402Error {
  constructor(message: string = 'Payment amount is invalid', details?: any) {
    super(message, 400, details);
    this.name = 'InvalidAmountError';
  }
}

export class InvalidNetworkError extends X402Error {
  constructor(message: string = 'Network is not supported', details?: any) {
    super(message, 400, details);
    this.name = 'InvalidNetworkError';
  }
}

export class PaymentVerificationError extends X402Error {
  constructor(message: string = 'Payment verification failed', details?: any) {
    super(message, 402, details);
    this.name = 'PaymentVerificationError';
  }
}

export async function verifyPayment(
  facilitatorUrl: string,
  payment: PaymentPayload
): Promise<VerifyResponse> {
  if (!facilitatorUrl) throw new X402Error("Facilitator URL is required", 500);
  if (!payment) throw new X402Error("Payment payload is required", 400);

  try {
    const response = await axios.post<VerifyResponse>(
      `${facilitatorUrl}/verify`,
      payment,
      { timeout: 10_000 }
    );
    return response.data;
  } catch (error: any) {
    console.error('❌ Verification error:', error.response?.data || error.message);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error details:', error.response?.data);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new NetworkError(
        `Failed to connect to facilitator: ${error.message}`,
        { facilitatorUrl, error: error.code }
      );
    }
    
    // Check for 400 Bad Request specifically
    if (error.response?.status === 400) {
      const errorData = error.response?.data || { message: error.message };
      throw new PaymentVerificationError(
        `Payment verification failed (400): ${errorData.error || errorData.message || 'Bad Request'}`,
        { status: 400, details: errorData, payment }
      );
    }
    
    throw new PaymentVerificationError(
      `Payment verification failed: ${error.message}`,
      error.response?.data
    );
  }
}

export async function settlePayment(
  facilitatorUrl: string,
  payment: PaymentPayload
): Promise<SettlementResponse> {
  if (!facilitatorUrl) throw new X402Error("Facilitator URL is required", 500);
  if (!payment) throw new X402Error("Payment payload is required", 400);

  try {
    const response = await axios.post<SettlementResponse>(
      `${facilitatorUrl}/settle`,
      payment,
      { timeout: 20_000 }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Settlement error:', error.response?.data || error.message);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error details:', error.response?.data);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new NetworkError(
        `Failed to connect to facilitator: ${error.message}`,
        { facilitatorUrl, error: error.code }
      );
    }
    if (error.code === 'ECONNABORTED') {
      throw new PaymentTimeoutError(
        'Payment settlement timed out after 20 seconds',
        { payment }
      );
    }
    
    // Check for 400 Bad Request specifically
    if (error.response?.status === 400) {
      const errorData = error.response?.data || { message: error.message };
      throw new X402Error(
        `Payment settlement failed (400): ${errorData.error || errorData.message || 'Bad Request'}`,
        400,
        { status: 400, details: errorData, payment }
      );
    }
    
    throw new X402Error(
      `Payment settlement failed: ${error.message || 'Unknown error'}`,
      error.response?.status || 402,
      error.response?.data
    );
  }
}

interface FacilitatorHealthInfo {
  feePayer?: string;
  treasury?: string;
  feeBasisPoints?: number;
}

async function fetchFacilitatorInfo(facilitatorUrl: string): Promise<FacilitatorHealthInfo> {
  try {
    const res = await axios.get(`${facilitatorUrl}/health`, { timeout: 5000 });
    return {
      feePayer: res.data?.facilitatorAddress || undefined,
      treasury: res.data?.treasuryAddress || res.data?.facilitatorAddress || undefined,
      feeBasisPoints: res.data?.feeBasisPoints || 0,
    };
  } catch (error) {
    console.warn('Failed to fetch facilitator info from', facilitatorUrl, error);
    return {};
  }
}

export async function createPaymentRequirement(
  config: X402Config,
  resource: string,
  amount?: string
): Promise<PaymentRequirement> {
  if (!config) throw new Error("X402 config is required");
  if (!config.payToAddress) throw new Error("payToAddress is required in config");

  const X402_VERSION = 2;
  
  let facilitators: Array<{
    id: string
    name: string
    url: string
    fee: number
    status: 'active' | 'inactive' | 'offline'
    network: 'x1-testnet' | 'x1-mainnet'
    address?: string
  }> = []
  
  if (config.facilitators && config.facilitators.length > 0) {
    facilitators = config.facilitators
  } else if (config.facilitatorRegistryUrl) {
    const registryFacilitators = await getFacilitatorsFromRegistry(
      config.facilitatorRegistryUrl,
      config.network
    )
    facilitators = registryFacilitators.map(f => ({
      id: f.id,
      name: f.name,
      url: f.url,
      fee: f.fee,
      status: f.status,
      network: f.network,
      address: f.address
    }))
  } else if (config.facilitatorUrl) {
    facilitators = [{
      id: 'default',
      name: 'Default',
      url: config.facilitatorUrl,
      fee: 0,
      status: 'active',
      network: config.network as 'x1-testnet' | 'x1-mainnet',
      address: ''
    }]
  }
  
  const activeFacilitators = facilitators.filter(f => f.status === 'active')
  
  const buildAcceptsEntry = (network: string, asset: string, facilitatorUrl: string, facInfo?: FacilitatorHealthInfo) => {
    const entry: any = {
      scheme: 'exact',
      network,
      payTo: config.payToAddress,
      asset,
      maxAmountRequired: amount || config.amount || '1000',
      resource: config.resource || resource,
      description: config.description || 'Payment via X1Pays',
      facilitatorUrl,
    };
    if (facInfo?.feePayer) {
      entry.extra = {
        feePayer: facInfo.feePayer,
        treasury: facInfo.treasury,
        feeBasisPoints: facInfo.feeBasisPoints || 0,
      };
    }
    return entry;
  };

  if (config.allowedNetworks && config.allowedNetworks.length > 0) {
    const acceptsPromises = config.allowedNetworks.map(async (network) => {
      const networkFacilitators = activeFacilitators.filter(f => f.network === network);
      const bestFacilitator = networkFacilitators.length > 0
        ? selectBestFacilitator(networkFacilitators, { network: network as 'x1-testnet' | 'x1-mainnet' })
        : null;
      
      const facUrl = bestFacilitator?.url || config.facilitatorUrl || '';
      const facInfo: FacilitatorHealthInfo = bestFacilitator?.address
        ? { feePayer: bestFacilitator.address }
        : (facUrl ? await fetchFacilitatorInfo(facUrl) : {});
      
      const allAssets = [config.tokenMint, ...(config.acceptedAssets || [])];
      return allAssets.map(asset => buildAcceptsEntry(network, asset, facUrl, facInfo));
    });
    
    const acceptsArrays = await Promise.all(acceptsPromises);
    return {
      x402Version: X402_VERSION,
      info: 'X1Pays x402',
      accepts: acceptsArrays.flat()
    };
  }
  
  const bestFacilitator = activeFacilitators.length > 0
    ? selectBestFacilitator(activeFacilitators, { 
        network: config.network as 'x1-testnet' | 'x1-mainnet' 
      })
    : null;
  
  const facUrl = bestFacilitator?.url || config.facilitatorUrl || '';
  const facInfo: FacilitatorHealthInfo = bestFacilitator?.address
    ? { feePayer: bestFacilitator.address }
    : (facUrl ? await fetchFacilitatorInfo(facUrl) : {});
  
  return {
    x402Version: X402_VERSION,
    info: 'X1Pays x402',
    accepts: [config.tokenMint, ...(config.acceptedAssets || [])].map(asset =>
      buildAcceptsEntry(config.network, asset, facUrl, facInfo)
    )
  };
}

export function validatePayment(
  payment: PaymentPayload,
  config: X402Config,
  requiredAmount?: string
): void {
  if (!payment) throw new X402Error("Payment is required", 400);

  // Support multiple networks if allowedNetworks is specified
  if (config.allowedNetworks && config.allowedNetworks.length > 0) {
    if (!config.allowedNetworks.includes(payment.network)) {
      throw new InvalidNetworkError(
        `Invalid network. Expected one of: ${config.allowedNetworks.join(', ')}, Got: ${payment.network}`
      );
    }
  } else if (payment.network !== config.network) {
    // Fallback to single network validation
    throw new InvalidNetworkError(
      `Invalid network. Expected: ${config.network}, Got: ${payment.network}`
    );
  }
  
  // Facilitator URL validation - check if payment uses a valid facilitator
  // This is optional since payment validation happens at settlement time

  // Validate payTo address - allow network-specific addresses if configured
  // If allowedNetworks is specified, we need to check if the payTo matches the expected address for that network
  // For now, we'll accept the configured address for any allowed network
  // In the future, we could support network-specific addresses
  if (payment.payTo !== config.payToAddress) {
    throw new X402Error('Invalid payTo address', 402);
  }

  const allowedAssets = config.acceptedAssets && config.acceptedAssets.length > 0
    ? [config.tokenMint, ...config.acceptedAssets]
    : [config.tokenMint];
  if (!allowedAssets.includes(payment.asset)) {
    throw new X402Error('Invalid asset. Accepted: ' + allowedAssets.join(', '), 402);
  }

  if (requiredAmount) {
    try {
      const required = BigInt(requiredAmount);
      const provided = BigInt(payment.amount);
      
      if (provided < required) {
        throw new InsufficientFundsError(
          `Insufficient payment amount. Required: ${requiredAmount}, Provided: ${payment.amount}`
        );
      }
    } catch (error: any) {
      if (error.name === 'InsufficientFundsError') {
        throw error;
      }
      throw new InvalidAmountError(`Invalid amount format: ${error.message}`);
    }
  }
}
