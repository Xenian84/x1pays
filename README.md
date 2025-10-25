# X1Pays

**x402 payment protocol implementation on X1 blockchain using wrapped XNT (wXNT) tokens**

X1Pays is a complete TypeScript monorepo enabling HTTP 402 Payment Required micropayments on the X1 blockchain. It includes:

- **Facilitator Service** - Verifies signatures and settles wXNT token transfers
- **x402-enabled API** - Returns HTTP 402 until valid payment is provided
- **Client SDK** - Handles payment signing and x402 handshake for browsers/Node
- **Documentation Website** - Landing page and interactive API documentation

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

## Project Structure

```
x1pays/
├─ packages/
│  ├─ facilitator/     # Payment verification & settlement service
│  ├─ api/             # x402-enabled API server
│  ├─ sdk/             # Client SDK for Node/browser
│  └─ website/         # Documentation website (React + Vite)
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
```

**Required environment variables:**

- `RPC_URL` - X1 RPC endpoint (default: https://rpc.mainnet.x1.xyz)
- `NETWORK` - Network identifier (x1-mainnet or x1-devnet)
- `WXNT_MINT` - wXNT SPL token mint address on X1
- `FEE_PAYER_SECRET` - Base58-encoded private key for transaction fees
- `PAYTO_ADDRESS` - Merchant wallet receiving payments
- `FACILITATOR_URL` - Facilitator service URL

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
