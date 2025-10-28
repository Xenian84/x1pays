import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { useWallet } from '@solana/wallet-adapter-react';
import { X402Paywall } from '@x1pays/react';
import '@solana/wallet-adapter-react-ui/styles.css';

// Your premium content component
function PremiumContent() {
  return (
    <div>
      <h1>Welcome to Premium Content!</h1>
      <p>You've successfully unlocked this content by paying with X1 blockchain.</p>
    </div>
  );
}

// Page with paywall
function PremiumPage() {
  const wallet = useWallet();

  return (
    <X402Paywall
      amount={2.50}
      description="Premium AI Chat Access - Unlimited messages for 24 hours"
      network="x1-testnet"
      onPaymentSuccess={(txId) => {
        console.log('Payment successful! Transaction:', txId);
        // Track analytics, unlock features, etc.
      }}
      onPaymentError={(error) => {
        console.error('Payment failed:', error);
        // Show error notification
      }}
      onPaymentStart={() => {
        console.log('Payment initiated...');
        // Show loading state
      }}
    >
      <PremiumContent />
    </X402Paywall>
  );
}

// App with wallet providers
export default function App() {
  // X1 Devnet RPC endpoint
  const endpoint = 'https://rpc.testnet.x1.xyz';

  // Configure wallets - Backpack, Phantom, and Solflare all work with X1
  const wallets = [
    new BackpackWalletAdapter(),
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <PremiumPage />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
