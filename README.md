# X1Pays

**Production-ready x402 payment protocol for X1 blockchain - Instant, Invisible Payments**

X1Pays is a complete TypeScript monorepo enabling HTTP 402 Payment Required micropayments on the X1 blockchain with signature-first verification achieving sub-second payment flows. It includes:

- **Facilitator Service** - Signature verification (~50ms) and blockchain settlement
- **Client Libraries** - Drop-in Axios and Fetch clients with automatic payment handling  
- **Server Middleware** - Express, Hono, Fastify, and Next.js integrations
- **React Components** - Pre-built paywall components for easy integration
- **Documentation Website** - Comprehensive guides and live demos on X1 testnet

## 🚀 Production Deployment

**Ready to deploy?** Follow the complete step-by-step guide:  
**→ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** ← Start here for production deployment

This guide organizes all documentation in the correct deployment sequence with checklists, troubleshooting, and security best practices.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │────1───▶│  API Server  │         │ Facilitator │
│   (SDK)     │◀───2────│   (HTTP 402) │         │  Service    │
└─────────────┘         └──────────────┘         └─────────────┘
                              │                         │
                              │                         │
                         3. X-PAYMENT                   │
                           header with                  │
                           signature              4. Verify
                              │                         │
                              ├────────────────────────▶│
                              │◀────────────────────────┤
                              │        5. Settle         │
                              ├────────────────────────▶│
                              │◀────────────────────────┤
                         6. Access                      │
                           granted                      │
                              │                         │
                              ▼                         ▼
                        ┌──────────────────────────────────┐
                        │     X1 Blockchain (wXNT)         │
                        └──────────────────────────────────┘
```

## What is x402?

HTTP 402 (Payment Required) is a standard status code reserved for digital micropayments. X1Pays implements x402 using:

- **X1 blockchain** - High-performance L1 with low fees
- **wXNT tokens** - SPL token standard for payments
- **Ed25519 signatures** - Client signs payment intent
- **Facilitator pattern** - Sponsors transaction fees while verifying ownership

## 💠 Token Economy

The X1Pays Protocol operates on a dual-token model designed for the current stage of the X1 blockchain (no stablecoins yet) while remaining forward-compatible with future USDC deployments.

### Settlement Layer — wXNT

**wXNT (Wrapped XNT)** is the settlement token used for all transactions:

- Every API call or x402 payment is settled in **wXNT**, transferred directly from the user's wallet to the merchant via the facilitator
- The facilitator charges **0% protocol fees** - 100% of payments go to merchants
- X1Pays covers all gas costs, making transactions completely free for users and merchants
- Revenue comes from **$XPY token** appreciation, not transaction fees
- wXNT is SPL-compatible and integrates seamlessly with X1 blockchain infrastructure

### Governance and Incentives — $XPY

**$XPY** is the governance and value capture token of X1Pays:

- It is **not used for settlement** but captures protocol value through:
  - Token appreciation from ecosystem growth
  - Governance over key protocol parameters
  - Future staking rewards and treasury distributions
  - Voting rights for protocol upgrades
  - Future asset support (e.g., USDC)

### Payment Flow Example

When a user pays **100 wXNT** for an API call:

- **100 wXNT** → Merchant (100%)
- **0 wXNT** → Protocol Fee (0%)
- **Gas fees** → Covered by X1Pays Treasury

X1Pays makes money through **$XPY token appreciation** as the protocol grows, not by taking a cut of your revenue.

### Future Staking Model (Coming Soon)

The protocol will introduce **$XPY staking** for holders:

- Stake $XPY tokens to participate in protocol governance
- Earn rewards from treasury reserves (funded by token sales and partnerships)
- Lock periods with multipliers for higher governance weight
- Direct participation in protocol development decisions
- Early stakers receive bonus rewards

## Project Structure

```
x1pays/
├─ packages/
│  ├─ facilitator/     # Payment verification & settlement service
│  ├─ api/             # Example x402-enabled API server
│  ├─ client/          # @x1pays/client - Axios and Fetch libraries
│  ├─ middleware/      # @x1pays/middleware - Express, Hono, Fastify, Next.js
│  ├─ x402-x1-react/   # React component library for X1 blockchain
│  ├─ sdk/             # TypeScript SDK
│  ├─ shared/          # Shared blockchain utilities
│  └─ website/         # Documentation website (React + Vite + Material-UI)
├─ examples/           # Usage examples for all frameworks
├─ scripts/            # Utility scripts
├─ ops/                # Deployment configs (PM2, Nginx, Docker)
├─ package.json        # Root workspace config
└─ pnpm-workspace.yaml # Monorepo workspace definition
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9.0+
- X1 wallet with wXNT tokens (for testing)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` files and fill in your configuration:

```bash
# Facilitator
cp packages/facilitator/.env.example packages/facilitator/.env

# API
cp packages/api/.env.example packages/api/.env

# Website
cp packages/website/.env.example packages/website/.env.local
```

**Required environment variables:**

**Facilitator:**
- `RPC_URL` - X1 RPC endpoint (Mainnet: https://rpc.x1.xyz, Testnet: https://rpc-testnet.x1.xyz)
- `NETWORK` - Network identifier (x1-mainnet or x1-testnet)
- `WXNT_MINT` - wXNT SPL token mint address on X1
- `FEE_PAYER_SECRET` - Base58-encoded private key that covers gas costs for all transactions

**API:**
- `RPC_URL` - X1 RPC endpoint (same as facilitator)
- `NETWORK` - Network identifier (same as facilitator)
- `WXNT_MINT` - wXNT SPL token mint address (same as facilitator)
- `PAYTO_ADDRESS` - Merchant wallet address receiving 100% of payments
- `FACILITATOR_URL` - Facilitator service URL (typically http://localhost:4000)
- `DOMAIN` - Public domain for the service (e.g., localhost for development)

**Website:**
- `VITE_NETWORK` - Network identifier (x1-mainnet or x1-testnet)
- `VITE_X1_MAINNET_RPC` - X1 mainnet RPC URL
- `VITE_X1_TESTNET_RPC` - X1 testnet RPC URL
- `VITE_FACILITATOR_URL` - Facilitator service URL
- `VITE_MERCHANT_ADDRESS` - Merchant wallet for Echo demo
- `VITE_WXNT_MINT` - wXNT token mint address

**Note:** The merchant wallet address is set in the API's `PAYTO_ADDRESS`. The facilitator is multi-tenant and processes payments for any merchant specified in the payment request.

### 3. Generate Wallet (Optional)

Generate a new keypair for testing:

```bash
node scripts/seed-merchant-wallet.js
```

### 4. Run Development Servers

```bash
# Run all services concurrently
pnpm dev

# Or run individually
pnpm dev:fac  # Facilitator on :4000
pnpm dev:api  # API on :3000
pnpm dev:web  # Website on :5000
```

Visit:
- **Website**: http://localhost:5000
- **API**: http://localhost:3000
- **Facilitator**: http://localhost:4000

### 5. Build for Production

```bash
pnpm build
```

## 🌐 Network Configuration

X1Pays supports both **X1 Mainnet** and **X1 Testnet**. Configure via the `NETWORK` environment variable.

### RPC Endpoints

**X1 Mainnet:** `https://rpc.x1.xyz`  
**X1 Testnet:** `https://rpc-testnet.x1.xyz`

Test the connection:
```bash
# Mainnet
curl -X POST https://rpc.x1.xyz \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getVersion"}'

# Testnet  
curl -X POST https://rpc-testnet.x1.xyz \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getVersion"}'
```

### Production Setup

For a complete guide to deploying on X1 mainnet, see **[MAINNET_SETUP.md](./MAINNET_SETUP.md)**.

Quick checklist:
1. ✅ Configure `.env` files with mainnet settings
2. ✅ Deploy wXNT and $XPY token contracts (or use existing)
3. ✅ Fund fee payer wallet with XNT for gas
4. ✅ Create wXNT token accounts for merchant and treasury
5. ✅ Test RPC connectivity
6. ✅ Run services with `NODE_ENV=production`
7. ✅ Verify end-to-end payment flow
8. ✅ Monitor treasury and merchant balances

**⚠️ Security:** Never commit private keys or `.env` files to version control!

## Usage Examples

### Unpaid Request (Returns 402)

```bash
curl -i http://localhost:3000/premium/data
```

**Response:**

```json
HTTP/1.1 402 Payment Required

{
  "x402Version": 1,
  "info": "X1Pays x402",
  "accepts": [{
    "scheme": "exact",
    "network": "x1-mainnet",
    "payTo": "YourMerchantPubkey...",
    "asset": "wXNTMintAddress...",
    "maxAmountRequired": "1000",
    "resource": "/premium/data",
    "description": "Premium API access (per-call via wXNT)"
  }]
}
```

### Paid Request (Returns 200)

First, construct and sign the payment payload:

```javascript
import { Keypair } from "@solana/web3.js";
import { signPayment } from "@x1pays/sdk";

const payer = Keypair.fromSecretKey(/* your secret key */);

const payment = {
  scheme: "exact",
  network: "x1-mainnet",
  payTo: "MerchantPubkey...",
  asset: "wXNTMint...",
  amount: "1000",
  buyer: payer.publicKey.toBase58(),
  memo: null
};

const signature = signPayment(payer, payment);
const paymentHeader = JSON.stringify({ ...payment, signature });
```

Then make the request:

```bash
curl -H "X-PAYMENT: {\"scheme\":\"exact\",\"network\":\"x1-mainnet\",...}" \
     http://localhost:3000/premium/data
```

**Response:**

```json
HTTP/1.1 200 OK
X-PAYMENT-RESPONSE: {"txHash":"5KxL..."}

{
  "ok": true,
  "service": "x1pays-premium",
  "ts": "2025-10-25T12:34:56.789Z",
  "paidTx": "5KxL...",
  "sample": { "msg": "Access granted via x402 on X1 (wXNT)" }
}
```

### Using the SDK

```javascript
import { Keypair } from "@solana/web3.js";
import { getWithPayment } from "@x1pays/sdk";

const payer = Keypair.generate();

const data = await getWithPayment(
  "http://localhost:3000/premium/data",
  payer,
  {
    facilitatorUrl: "http://localhost:4000",
    payTo: process.env.PAYTO_ADDRESS,
    asset: process.env.WXNT_MINT,
    amountAtomic: "1000"
  }
);

console.log(data);
```

## Deployment

### VPS Deployment (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw nginx

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm and PM2
sudo npm i -g pnpm pm2

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Clone and build
git clone <your-repo> x1pays
cd x1pays
pnpm install
pnpm build

# Configure environment
cp packages/facilitator/.env.example packages/facilitator/.env
cp packages/api/.env.example packages/api/.env
# Edit .env files with your configuration

# Start with PM2
pm2 start ops/ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx (update /var/www/x1pays path in ops/nginx.conf to match your installation)
sudo cp ops/nginx.conf /etc/nginx/sites-available/x1pays
sudo ln -s /etc/nginx/sites-available/x1pays /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d x1pays.xyz -d www.x1pays.xyz -d api.x1pays.xyz -d facilitator.x1pays.xyz
```

**Note**: The website is served as static files directly by Nginx from `packages/website/dist`. Make sure to run `pnpm build` before deploying and update the `root` path in `ops/nginx.conf` to match your installation directory.

### Docker Deployment

Build images:

```bash
# Facilitator
cd packages/facilitator
docker build -t x1pays-facilitator .

# API
cd packages/api
docker build -t x1pays-api .
```

Run containers:

```bash
docker run -d -p 4000:4000 --env-file .env x1pays-facilitator
docker run -d -p 3000:3000 --env-file .env x1pays-api
```

## API Endpoints

### Facilitator Service (:4000)

- `GET /supported` - List supported networks and assets
- `POST /verify` - Verify payment signature and payload
- `POST /settle` - Execute token transfer on X1

### API Service (:3000)

- `GET /health` - Health check
- `GET /premium/data` - Sample x402-protected endpoint

## Security & Production Notes

⚠️ **IMPORTANT**: This is an MVP implementation that demonstrates the x402 protocol architecture. For production deployment, please review [PRODUCTION_NOTES.md](PRODUCTION_NOTES.md) for critical implementation considerations.

### Current MVP Status

**Implemented**:
- ✅ x402 protocol structure and handshake
- ✅ Payment signature verification (Ed25519)
- ✅ Server-side validation (network, asset, amount, merchant address)
- ✅ Rate limiting (HTTP 420)
- ✅ Structured logging with Pino

**Production Requirements** (see PRODUCTION_NOTES.md):
- 🔧 Settlement requires buyer transaction signature or delegate approval pattern
- 🔧 Replay attack prevention (nonces + timestamps)
- 🔧 Dynamic pricing catalog per endpoint
- 🔧 Distributed rate limiting with Redis
- 🔧 Comprehensive monitoring and alerting

### Recommended Production Pattern: Delegate Approval

```typescript
// 1. Buyer approves delegate
const approveIx = createApproveInstruction(
  buyerAta,
  facilitatorPubkey,
  buyerPubkey,
  amount
);

// 2. Facilitator transfers using delegate
const transferIx = createTransferInstruction(
  buyerAta,
  merchantAta,
  facilitatorPubkey, // delegate authority
  amount
);

// 3. Buyer revokes (optional)
const revokeIx = createRevokeInstruction(buyerAta, buyerPubkey);
```

See [PRODUCTION_NOTES.md](PRODUCTION_NOTES.md) for complete implementation patterns and security considerations.

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm -C packages/facilitator test
pnpm -C packages/api test
pnpm -C packages/sdk test
```

## Environment Variables Reference

See `scripts/env.schema.md` for complete documentation.

### Core Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RPC_URL` | X1 blockchain RPC endpoint | `https://rpc.mainnet.x1.xyz` |
| `NETWORK` | Network identifier | `x1-mainnet` or `x1-devnet` |
| `WXNT_MINT` | wXNT SPL token mint address | `wXNT...` |
| `FEE_PAYER_SECRET` | Fee payer wallet (base58) | `base58...` |
| `PAYTO_ADDRESS` | Merchant receiving wallet | `pubkey...` |
| `FACILITATOR_URL` | Facilitator service URL | `https://facilitator.x1pays.xyz` |
| `FEE_PERCENT` | Protocol fee percentage | `1` (for 1%) |
| `TREASURY_ADDRESS` | X1Pays treasury address | `pubkey...` |
| `XPY_MINT` | $XPY governance token mint | `XPY...` |

## Roadmap

- [ ] Delegate approval implementation for production security
- [ ] Replay attack prevention (request IDs + nonces)
- [ ] Devnet support with network toggle
- [ ] Dynamic pricing catalog per endpoint
- [ ] Prometheus metrics endpoints
- [ ] Comprehensive test coverage (Vitest)
- [ ] WebSocket support for real-time payment notifications
- [ ] Multi-token support (beyond wXNT)
- [ ] Payment receipts and invoicing

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT - see [LICENSE](LICENSE)

## Resources

- [X1 Blockchain Documentation](https://docs.x1.xyz)
- [Solana SPL Token Guide](https://spl.solana.com/token)
- [HTTP 402 Specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)
- [OpenAPI Specification](ops/openapi.yaml)

---

**X1Pays** - Micropayments on X1 blockchain via x402 protocol
