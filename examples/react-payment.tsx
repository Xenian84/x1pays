/**
 * X1Pays React Example
 * 
 * This example shows how to integrate X1Pays into a React application
 * using the @x1pay/react package.
 */

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useX402Payment } from '@x1pay/react';

interface ApiData {
  message: string;
  timestamp: number;
}

export function PaymentExample() {
  const { publicKey } = useWallet();
  const [data, setData] = useState<ApiData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { 
    makePayment, 
    isLoading, 
    txHash 
  } = useX402Payment({
    facilitatorUrl: process.env.NEXT_PUBLIC_FACILITATOR_URL || 'http://localhost:4000',
    network: 'x1-testnet'
  });

  const handlePurchase = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setError(null);
    setData(null);

    try {
      // Make payment-protected API call
      const response = await makePayment({
        apiUrl: '/api/protected-data',
        amount: '1000', // 0.000001 wXNT in lamports
        merchantAddress: process.env.NEXT_PUBLIC_MERCHANT_ADDRESS || '',
        description: 'Premium API Access'
      });

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  return (
    <div className="payment-container">
      <h2>X1Pays Payment Example</h2>
      
      <div className="info">
        <p><strong>Cost:</strong> 0.000001 wXNT</p>
        <p><strong>Network:</strong> X1 Testnet</p>
        {publicKey && (
          <p><strong>Wallet:</strong> {publicKey.toBase58().slice(0, 8)}...</p>
        )}
      </div>

      <button 
        onClick={handlePurchase}
        disabled={!publicKey || isLoading}
        className="pay-button"
      >
        {isLoading ? 'Processing Payment...' : 'Purchase Access'}
      </button>

      {txHash && (
        <div className="success">
          <p>✅ Payment successful!</p>
          <p className="tx-hash">
            Tx: <a 
              href={`https://explorer.testnet.x1.xyz/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash.slice(0, 16)}...
            </a>
          </p>
        </div>
      )}

      {data && (
        <div className="data-display">
          <h3>Protected Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}
    </div>
  );
}

export default PaymentExample;

