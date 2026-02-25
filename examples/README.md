# X1Pays Examples

This directory contains example code showing how to integrate X1Pays into your applications.

## 📁 Examples

### 1. Node.js SDK (`nodejs-sdk.js`)

Shows how to use the `@x1pay/sdk` package to make payment-protected API calls.

**Run:**
```bash
# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Install dependencies
npm install @x1pay/sdk @solana/web3.js bs58 dotenv

# Run example
node examples/nodejs-sdk.js
```

**Environment Variables:**
```bash
WALLET_SECRET_KEY=your_base58_encoded_secret_key
FACILITATOR_URL=http://localhost:4000
MERCHANT_ADDRESS=YourMerchantPublicKey
WXNT_MINT=wXNT_Token_Mint_Address
NETWORK=x1-testnet
API_ENDPOINT=http://localhost:3000/api/echo/test
```

---

### 2. React Payment Component (`react-payment.tsx`)

Shows how to integrate X1Pays into a React application using the `@x1pay/react` package.

**Install:**
```bash
npm install @x1pay/react @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
```

**Features:**
- ✅ Wallet integration
- ✅ Payment processing with loading states
- ✅ Transaction hash display
- ✅ Error handling
- ✅ Protected data display

**Usage:**
```tsx
import { PaymentExample } from './examples/react-payment';

function App() {
  return (
    <WalletProvider>
      <PaymentExample />
    </WalletProvider>
  );
}
```

---

### 3. Express Middleware (`express-middleware.js`)

Shows how to protect Express API endpoints with x402 payment requirements.

**Install:**
```bash
npm install @x1pay/middleware express
```

**Run:**
```bash
# Setup environment
export MERCHANT_ADDRESS=YourMerchantAddress
export FACILITATOR_URL=http://localhost:4000
export WXNT_MINT=wXNT_Mint_Address
export NETWORK=x1-testnet

# Run server
node examples/express-middleware.js
```

**Features:**
- ✅ Automatic payment verification
- ✅ Protected and public endpoints
- ✅ Payment info in request object
- ✅ Error handling

**Endpoints:**
- `GET /api/public` - Free (no payment)
- `GET /api/premium/data` - Paid (0.000001 wXNT)
- `GET /api/data/analytics` - Paid (0.000001 wXNT)

---

## 🔐 Security Notes

1. **Never commit private keys** - Always use environment variables
2. **Test on testnet first** - Verify your integration before mainnet
3. **Validate merchant addresses** - Ensure you're paying the correct merchant
4. **Monitor transactions** - Keep track of your payment flow
5. **Use secure key storage** - For production, use proper key management

## 📚 More Examples

Want to see more examples? Check out:

- [Full Demo Website](../packages/website) - Complete implementation
- [API Server](../packages/api) - Backend with x402 middleware
- [Documentation](https://docs.x1pays.com/examples)

## 💬 Need Help?

- Discord: [X1Pays Community](https://discord.gg/x1pays)
- GitHub Issues: [Report a bug or request](https://github.com/yourusername/x1pays/issues)
- Email: support@x1pays.com

---

Happy coding! 🚀

