import type { PaymentRequirement, PaymentResponse, PermitSigner, X402Response } from './types.js';
import { Keypair } from '@solana/web3.js';
import { X402Error } from './utils.js';
import { KeypairPermitSigner } from './permitSigner.js';

export interface X402FetchConfig extends RequestInit {
  permitSigner?: PermitSigner;
  keypair?: Keypair;
  maxPaymentAmount?: string;
  rpcUrl?: string;
  paymentTimeout?: number;
}

export async function fetchX402(
  url: string | URL,
  config: X402FetchConfig
): Promise<Response & { x402Payment?: PaymentResponse }> {
  const { permitSigner, keypair, maxPaymentAmount, rpcUrl, paymentTimeout = 10000, ...fetchConfig } = config;

  let signer: PermitSigner;
  if (permitSigner) {
    signer = permitSigner;
  } else if (keypair) {
    signer = new KeypairPermitSigner(keypair);
  } else {
    throw new X402Error('Must provide permitSigner or keypair', 400);
  }

  let response = await fetch(url, fetchConfig);

  if (response.status !== 402) {
    return response as Response & { x402Payment?: PaymentResponse };
  }

  const paymentReqHeader = response.headers.get('X-Payment-Required');
  if (!paymentReqHeader) throw new X402Error('No payment requirement in 402 response', 402);

  const requirement: PaymentRequirement = JSON.parse(paymentReqHeader);
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
  if (!verifyData.valid) throw new X402Error('Payment verification failed', 402, verifyData);

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

  response = await fetch(url, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      'X-Payment': JSON.stringify({ ...signedPayment, txHash: settlement.txHash })
    }
  });

  (response as any).x402Payment = settlement;
  return response as Response & { x402Payment?: PaymentResponse };
}

export async function fetchX402JSON<T = any>(
  url: string | URL,
  config: X402FetchConfig
): Promise<X402Response<T>> {
  const response = await fetchX402(url, config);
  const data = await response.json();
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => { headers[key] = value; });
  return { data, payment: (response as any).x402Payment, headers };
}

export default fetchX402;
