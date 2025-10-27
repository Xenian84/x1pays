import axios from 'axios';
import type { X402Config, PaymentPayload, PaymentRequirement, SettlementResponse, VerifyResponse } from './types.js';

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
    throw new X402Error(
      `Payment verification failed: ${error.message}`,
      402,
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
  return {
    x402Version: 1,
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
    throw new X402Error('Invalid network', 402);
  }

  if (payment.payTo !== config.payToAddress) {
    throw new X402Error('Invalid payTo address', 402);
  }

  if (payment.asset !== config.tokenMint) {
    throw new X402Error('Invalid asset', 402);
  }

  if (requiredAmount) {
    const required = BigInt(requiredAmount);
    const provided = BigInt(payment.amount);
    
    if (provided < required) {
      throw new X402Error(
        `Insufficient payment amount. Required: ${requiredAmount}, Provided: ${payment.amount}`,
        402
      );
    }
  }
}
