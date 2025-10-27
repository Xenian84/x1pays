import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { PaymentRequirement, PaymentResponse, WalletSigner, X402Response } from './types.js';
import { signPayment, X402Error } from './utils.js';

export interface X402AxiosConfig extends AxiosRequestConfig {
  wallet: WalletSigner;
  retry?: {
    maxRetries?: number;
    retryDelay?: number;
    retryOn?: number[];
  };
  paymentTimeout?: number;
}

export async function x402Client<T = any>(
  config: X402AxiosConfig
): Promise<X402Response<T>> {
  const {
    wallet,
    retry = {},
    paymentTimeout = 10000,
    ...axiosConfig
  } = config;

  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryOn = [408, 429, 500, 502, 503, 504]
  } = retry;

  // First request - expect 402 Payment Required
  let response: AxiosResponse;
  
  try {
    response = await axios(axiosConfig);
    
    // If no payment required, return data directly
    return {
      data: response.data,
      headers: response.headers as Record<string, string>
    };
  } catch (error: any) {
    if (error.response?.status !== 402) {
      throw new X402Error(
        `Request failed: ${error.message}`,
        error.response?.status || 500,
        error.response?.data
      );
    }

    // Extract payment requirement from response
    const paymentReqHeader = error.response.headers['x-payment-required'];
    if (!paymentReqHeader) {
      throw new X402Error('No payment requirement in 402 response', 402);
    }

    const requirement: PaymentRequirement = typeof paymentReqHeader === 'string'
      ? JSON.parse(paymentReqHeader)
      : paymentReqHeader;

    if (!requirement.accepts || requirement.accepts.length === 0) {
      throw new X402Error('Invalid payment requirement', 402, requirement);
    }

    const accept = requirement.accepts[0];

    // Create payment
    const unsignedPayment = {
      scheme: accept.scheme,
      network: accept.network,
      payTo: accept.payTo,
      asset: accept.asset,
      amount: accept.maxAmountRequired || '1000',
      memo: null
    };

    // Sign payment
    const signedPayment = await signPayment(unsignedPayment, wallet);

    // Send payment to facilitator
    const facilitatorUrl = error.config?.baseURL || extractFacilitatorUrl(error.config?.url || '');
    
    const verifyResponse = await axios.post(
      `${facilitatorUrl}/verify`,
      signedPayment,
      { timeout: paymentTimeout }
    );

    if (!verifyResponse.data.valid) {
      throw new X402Error(
        'Payment verification failed',
        402,
        verifyResponse.data
      );
    }

    const settleResponse = await axios.post<PaymentResponse>(
      `${facilitatorUrl}/settle`,
      signedPayment,
      { timeout: paymentTimeout }
    );

    const settlement = settleResponse.data;

    // Retry original request with payment proof
    const retryConfig = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'X-Payment': JSON.stringify({
          ...signedPayment,
          txHash: settlement.txHash
        })
      }
    };

    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        response = await axios(retryConfig);
        
        return {
          data: response.data,
          payment: settlement,
          headers: response.headers as Record<string, string>
        };
      } catch (retryError: any) {
        lastError = retryError;
        
        if (attempt < maxRetries && retryOn.includes(retryError.response?.status)) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        break;
      }
    }

    throw new X402Error(
      `Request failed after payment: ${lastError.message}`,
      lastError.response?.status || 500,
      lastError.response?.data
    );
  }
}

function extractFacilitatorUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    // Fallback for relative URLs
    return '';
  }
}

export default x402Client;
