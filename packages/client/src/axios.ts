import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { PaymentRequirement, PaymentResponse, PermitSigner, X402Response } from './types.js';
import { Keypair } from '@solana/web3.js';
import { X402Error } from './utils.js';
import { KeypairPermitSigner } from './permitSigner.js';

export interface X402AxiosConfig extends AxiosRequestConfig {
  permitSigner?: PermitSigner;
  keypair?: Keypair;
  maxPaymentAmount?: string;
  rpcUrl?: string;
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
    permitSigner,
    keypair,
    maxPaymentAmount,
    rpcUrl,
    retry = {},
    paymentTimeout = 10000,
    ...axiosConfig
  } = config;

  let signer: PermitSigner;
  if (permitSigner) {
    signer = permitSigner;
  } else if (keypair) {
    signer = new KeypairPermitSigner(keypair);
  } else {
    throw new X402Error('Must provide permitSigner or keypair', 400);
  }

  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryOn = [408, 429, 500, 502, 503, 504]
  } = retry;

  let response: AxiosResponse;

  try {
    response = await axios(axiosConfig);
    return { data: response.data, headers: response.headers as Record<string, string> };
  } catch (error: any) {
    if (error.response?.status !== 402) {
      throw new X402Error(`Request failed: ${error.message}`, error.response?.status || 500, error.response?.data);
    }

    const paymentReqHeader = error.response.headers['x-payment-required'];
    if (!paymentReqHeader) throw new X402Error('No payment requirement in 402 response', 402);

    const requirement: PaymentRequirement = typeof paymentReqHeader === 'string' ? JSON.parse(paymentReqHeader) : paymentReqHeader;
    if (!requirement.accepts || requirement.accepts.length === 0) {
      throw new X402Error('Invalid payment requirement', 402, requirement);
    }

    const accept = requirement.accepts.reduce((lowest, current) => {
      const la = parseInt(lowest.maxAmountRequired || '1000', 10);
      const ca = parseInt(current.maxAmountRequired || '1000', 10);
      return ca < la ? current : lowest;
    });

    const paymentAmount = accept.maxAmountRequired || '1000';
    if (maxPaymentAmount) {
      const requested = parseInt(paymentAmount, 10);
      const maxAllowed = parseInt(maxPaymentAmount, 10);
      if (requested > maxAllowed) {
        throw new X402Error(`Payment amount ${paymentAmount} exceeds max ${maxPaymentAmount}`, 402, { requested, maxAllowed });
      }
    }

    const feePayer = accept.extra?.feePayer;
    if (!feePayer) throw new X402Error('No feePayer in payment requirement extra', 402);

    const facilitatorUrl = accept.facilitatorUrl;
    if (!facilitatorUrl) throw new X402Error('No facilitator URL provided', 402);

    const { signedPayment } = await signer.signPaymentTransaction(
      { scheme: accept.scheme, network: accept.network, payTo: accept.payTo, asset: accept.asset, amount: paymentAmount },
      feePayer,
      rpcUrl
    );

    const verifyResponse = await axios.post(`${facilitatorUrl}/verify`, signedPayment, { timeout: paymentTimeout });
    if (!verifyResponse.data.valid) throw new X402Error('Payment verification failed', 402, verifyResponse.data);

    const settleResponse = await axios.post<PaymentResponse>(`${facilitatorUrl}/settle`, signedPayment, { timeout: paymentTimeout });
    const settlement = settleResponse.data;

    const retryConfig = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'X-Payment': JSON.stringify({ ...signedPayment, txHash: settlement.txHash })
      }
    };

    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        response = await axios(retryConfig);
        return { data: response.data, payment: settlement, headers: response.headers as Record<string, string> };
      } catch (retryError: any) {
        lastError = retryError;
        if (attempt < maxRetries && retryOn.includes(retryError.response?.status)) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        break;
      }
    }

    throw new X402Error(`Request failed after payment: ${lastError.message}`, lastError.response?.status || 500, lastError.response?.data);
  }
}

export default x402Client;
