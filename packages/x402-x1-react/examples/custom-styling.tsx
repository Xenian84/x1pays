import { useWallet } from '@solana/wallet-adapter-react';
import { X402Paywall } from '@x1pays/react';

function CustomStyledPaywall() {
  const wallet = useWallet();

  return (
    <X402Paywall
      amount={5.00}
      description="Premium Features Bundle"
      network="x1-testnet"
      theme="custom"
      className="my-custom-paywall"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
      onPaymentSuccess={(txId) => console.log('Success:', txId)}
    >
      <div>
        <h2>Welcome to Premium!</h2>
        <p>Access to all advanced features</p>
      </div>
    </X402Paywall>
  );
}

export default CustomStyledPaywall;
