import axios from 'axios';
import type { X402Config, PaymentPayload, PaymentRequirement, SettlementResponse, VerifyResponse } from './types.js';

// Define error classes locally for now (will migrate to @x1pays/client once published)
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
  try {
    const response = await axios.post<VerifyResponse>(
      `${facilitatorUrl}/verify`,
      payment,
      { timeout: 10_000 }
    );
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new NetworkError(
        `Failed to connect to facilitator: ${error.message}`,
        { facilitatorUrl, error: error.code }
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
  try {
    const response = await axios.post<SettlementResponse>(
      `${facilitatorUrl}/settle`,
      payment,
      { timeout: 20_000 }
    );
    return response.data;
  } catch (error: any) {
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
    throw new X402Error(
      `Payment settlement failed: ${error.message}`,
      402,
      error.response?.data
    );
  }
}

export function createPaymentRequirement(
  config: X402Config,
  resource: string,
  amount?: string
): PaymentRequirement {
  // Use constants from client package
  const X402_VERSION = 1;
  
  return {
    x402Version: X402_VERSION,
    info: 'X1Pays x402',
    accepts: [{
      scheme: 'exact',
      network: config.network,
      payTo: config.payToAddress,
      asset: config.tokenMint,
      maxAmountRequired: amount || config.amount || '1000',
      resource: config.resource || resource,
      description: config.description || 'Premium API access (per-call via wXNT)',
      facilitatorUrl: config.facilitatorUrl
    }]
  };
}

export function validatePayment(
  payment: PaymentPayload,
  config: X402Config,
  requiredAmount?: string
): void {
  if (payment.network !== config.network) {
    throw new InvalidNetworkError(
      `Invalid network. Expected: ${config.network}, Got: ${payment.network}`
    );
  }

  if (payment.payTo !== config.payToAddress) {
    throw new X402Error('Invalid payTo address', 402);
  }

  if (payment.asset !== config.tokenMint) {
    throw new X402Error('Invalid asset', 402);
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
