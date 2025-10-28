# @x1pays/react

A React component library for integrating x402 payment protocol on X1 blockchain with Backpack wallet support.

## 🚀 Features

- ✅ **Drop-in React Components**: Easy integration with existing apps
- ✅ **X1 Blockchain Native**: Built specifically for X1 blockchain
- ✅ **Multi-Wallet Support**: Backpack, Phantom, Solflare, and more via Solana Wallet Adapter
- ✅ **Material-UI Styled**: Beautiful MUI components with X1Pays dark theme
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **X1 Theming**: Midnight blue (#0A1929) with cyan/lime accents

## 📦 Installation

```bash
npm install @x1pays/react
# or
yarn add @x1pays/react
# or
pnpm add @x1pays/react
```

### Install Peer Dependencies

```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js
```

## ⚙️ Setup

### 1. Wallet Provider Setup

Wrap your app with Solana wallet providers (works with X1):

```tsx
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const endpoint = 'https://rpc.testnet.x1.xyz';
  const wallets = [
    new BackpackWalletAdapter(),
    new PhantomWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app components */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

## 🎯 Quick Start

```tsx
import { X402Paywall } from '@x1pays/react';

function PremiumPage() {
  return (
    <X402Paywall
      amount={2.50}
      description="Premium AI Chat Access"
      network="x1-testnet"
      onPaymentSuccess={(txId) => console.log('Payment successful!', txId)}
    >
      <PremiumContent />
    </X402Paywall>
  );
}
```

## 📚 API Reference

### X402Paywall Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `amount` | `number` | ✅ | - | Payment amount in USD |
| `description` | `string` | ✅ | - | Payment description |
| `network` | `'x1-mainnet' \| 'x1-testnet'` | ❌ | `'x1-testnet'` | X1 network to use |
| `theme` | `'x1' \| 'dark' \| 'light' \| 'custom'` | ❌ | `'x1'` | Visual theme |
| `showBalance` | `boolean` | ❌ | `true` | Show wallet balance |
| `showNetworkInfo` | `boolean` | ❌ | `true` | Show network info |
| `onPaymentSuccess` | `(txId: string) => void` | ❌ | - | Success callback |
| `onPaymentError` | `(error: Error) => void` | ❌ | - | Error callback |

## 🎨 Theming

The component uses X1Pays branding with Material-UI:

- **Primary**: Cyan (#00E5FF)
- **Secondary**: Lime (#76FF03)  
- **Background**: Midnight Blue (#0A1929)

## 📖 Examples

See the `/examples` directory for complete integration examples.

## 📄 License

MIT
