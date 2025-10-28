import { useWallet } from '@solana/wallet-adapter-react';
import { X402Paywall } from '@x1pays/react';
import { useState } from 'react';

function ValidatedPaywall() {
  const wallet = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div>
      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#fee' }}>
          Error: {error}
        </div>
      )}

      {success && (
        <div style={{ color: 'green', padding: '10px', background: '#efe' }}>
          Payment successful! Content unlocked.
        </div>
      )}

      <X402Paywall
        amount={10.00}
        description="Premium API Access - 1000 requests/day"
        network="x1-devnet"
        maxPaymentAmount={100}
        showBalance={true}
        showNetworkInfo={true}
        onPaymentStart={() => {
          setError(null);
          console.log('Processing payment...');
        }}
        onPaymentSuccess={(txId) => {
          console.log('Payment confirmed:', txId);
          setSuccess(true);
          setError(null);
          
          // Call your backend to activate the subscription
          fetch('/api/activate-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ txId, wallet: wallet.publicKey?.toString() }),
          });
        }}
        onPaymentError={(err) => {
          console.error('Payment error:', err);
          setError(err.message);
          setSuccess(false);
        }}
      >
        <div>
          <h2>API Access Activated!</h2>
          <p>You now have access to 1000 API requests per day</p>
        </div>
      </X402Paywall>
    </div>
  );
}

export default ValidatedPaywall;
