import type { PaymentRequirement, PaymentResponse, WalletSigner, X402Response } from './types.js';
import { signPayment, X402Error } from './utils.js';

export interface X402FetchConfig extends RequestInit {
  wallet: WalletSigner;
  maxPaymentAmount?: string;  // Max amount willing to pay (atomic units)
  paymentTimeout?: number;
}

export async function fetchX402(
  url: string | URL,
  config: X402FetchConfig
): Promise<Response & { x402Payment?: PaymentResponse }> {
  const { wallet, maxPaymentAmount, paymentTimeout = 10000, ...fetchConfig } = config;

  // First request - expect 402 Payment Required
  let response = await fetch(url, fetchConfig);

  // If no payment required, return response directly
  if (response.status !== 402) {
    return response as Response & { x402Payment?: PaymentResponse };
  }

  // Extract payment requirement from response
  const paymentReqHeader = response.headers.get('X-Payment-Required');
  if (!paymentReqHeader) {
    throw new X402Error('No payment requirement in 402 response', 402);
  }

  const requirement: PaymentRequirement = JSON.parse(paymentReqHeader);

  if (!requirement.accepts || requirement.accepts.length === 0) {
    throw new X402Error('Invalid payment requirement', 402, requirement);
  }

  // Select the best accept option:
  // 1. Always choose the lowest-priced option
  // 2. Verify it's within maxPaymentAmount if set
  const accept = requirement.accepts.reduce((lowest, current) => {
    const lowestAmount = parseInt(lowest.maxAmountRequired || '1000', 10);
    const currentAmount = parseInt(current.maxAmountRequired || '1000', 10);
    return currentAmount < lowestAmount ? current : lowest;
  });

  const paymentAmount = accept.maxAmountRequired || '1000';
  
  // Check max payment amount safety limit
  if (maxPaymentAmount) {
    const requestedAmount = parseInt(paymentAmount, 10);
    const maxAllowed = parseInt(maxPaymentAmount, 10);
    if (requestedAmount > maxAllowed) {
      throw new X402Error(
        `Payment amount ${paymentAmount} exceeds max allowed ${maxPaymentAmount}`,
        402,
        { requestedAmount, maxAllowed }
      );
    }
  }
  
  const unsignedPayment = {
    scheme: accept.scheme,
    network: accept.network,
    payTo: accept.payTo,
    asset: accept.asset,
    amount: paymentAmount,
    memo: null
  };

  // Sign payment
  const signedPayment = await signPayment(unsignedPayment, wallet);

  // Get facilitator URL from payment requirement
  const facilitatorUrl = accept.facilitatorUrl;
  
  if (!facilitatorUrl) {
    throw new X402Error('No facilitator URL provided in payment requirement', 402);
  }

  // Verify payment
  const verifyController = new AbortController();
  const verifyTimeout = setTimeout(() => verifyController.abort(), paymentTimeout);

  const verifyResponse = await fetch(`${facilitatorUrl}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signedPayment),
    signal: verifyController.signal
  });

  clearTimeout(verifyTimeout);

  const verifyData = await verifyResponse.json();
  if (!verifyData.valid) {
    throw new X402Error('Payment verification failed', 402, verifyData);
  }

  // Settle payment
  const settleController = new AbortController();
  const settleTimeout = setTimeout(() => settleController.abort(), paymentTimeout);

  const settleResponse = await fetch(`${facilitatorUrl}/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signedPayment),
    signal: settleController.signal
  });

  clearTimeout(settleTimeout);

  const settlement: PaymentResponse = await settleResponse.json();

  // Retry original request with payment proof
  response = await fetch(url, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      'X-Payment': JSON.stringify({
        ...signedPayment,
        txHash: settlement.txHash
      })
    }
  });

  // Attach payment info to response
  (response as any).x402Payment = settlement;

  return response as Response & { x402Payment?: PaymentResponse };
}

// Helper to convert fetch response to X402Response format
export async function fetchX402JSON<T = any>(
  url: string | URL,
  config: X402FetchConfig
): Promise<X402Response<T>> {
  const response = await fetchX402(url, config);
  const data = await response.json();

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    data,
    payment: (response as any).x402Payment,
    headers
  };
}

export default fetchX402;
