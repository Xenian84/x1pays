# X1Pays

**AI payment infrastructure for X1 blockchain.**

X1Pays enables AI agents to pay for API calls, trade tokens on xDEX, manage wallets, and enforce spending policies — all through the x402 payment protocol. Integrates with OpenClaw, MCP (Claude/Cursor), or use the SDK directly.

## Architecture

```
@x1pay/sdk ─── WalletManager, payments, spending policies
  │
  ├── @x1pay/dex ─── xDEX swaps, quotes, pool discovery
  │     │
  │     ├── @x1pay/openclaw ─── 12 tools, 5 commands, 3 skills
  │     └── @x1pay/mcp ─── MCP server for Claude/Cursor
  │
  └── @x1pay/middleware ─── Express/Hono/Fastify x402 paywall

@x1pay/facilitator ─── Verify, settle, pay gas
@x1pay/api ─── REST API + facilitator registry
```

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@x1pay/sdk`](packages/sdk) | Core — WalletManager, AssetRegistry, SpendingPolicy, PaymentBuilder | [v0.4.0](https://www.npmjs.com/package/@x1pay/sdk) |
| [`@x1pay/dex`](packages/dex) | xDEX integration — swaps, quotes, pool discovery, AMM math | [v0.1.0](https://www.npmjs.com/package/@x1pay/dex) |
| [`@x1pay/middleware`](packages/middleware) | Express/Hono/Fastify/Next.js middleware for x402 paywalls | [v0.3.0](https://www.npmjs.com/package/@x1pay/middleware) |
| [`@x1pay/openclaw`](packages/openclaw) | OpenClaw plugin — 12 tools, 5 commands, 3 skills | [v0.3.0](https://www.npmjs.com/package/@x1pay/openclaw) |
| [`@x1pay/mcp`](packages/mcp) | MCP server for Claude Desktop, Cursor, and MCP-compatible agents | [v0.3.0](https://www.npmjs.com/package/@x1pay/mcp) |
| [`@x1pay/client`](packages/client) | Low-level x402 client utilities and facilitator discovery | [v0.2.0](https://www.npmjs.com/package/@x1pay/client) |

---

## Quick Start

### 1. AI Agent — Pay for resources

```bash
npm install @x1pay/sdk
```

```typescript
import { WalletManager } from '@x1pay/sdk'

const wallet = new WalletManager(process.env.AGENT_KEY!, {
  network: 'x1-mainnet',
})

// Enforce spending limits
wallet.setPolicy({
  maxPerTransaction: 10_000_000n,   // 10 USDC.x max per tx
  sessionBudget: 100_000_000n,      // 100 USDC.x session cap
  allowedAssets: ['USDC.x'],          // Only USDC.x payments
})

// Pay for an x402-protected API (facilitator covers gas)
const result = await wallet.payForResource('https://api.example.com/premium/data')
console.log(result.data)     // API response
console.log(result.txHash)   // On-chain tx hash

// Check balances
const balances = await wallet.getBalances()
console.log(balances.USDC.x.uiAmount)  // 95.0

// Direct token transfer (agent pays gas)
await wallet.send('RecipientAddress...', '5.0', 'USDC.x')
```

### 2. Merchant — Paywall an API endpoint

```bash
npm install @x1pay/middleware
```

```typescript
import express from 'express'
import { x402 } from '@x1pay/middleware'

const app = express()

app.use('/api/premium', x402({
  payTo: 'YOUR_WALLET_ADDRESS',
  amount: '100000',           // 0.1 USDC.x
  tokenMint: 'USDC.x',
  network: 'x1-mainnet',
  facilitatorUrl: 'https://x1pays.xyz/facilitator-alpha-mainnet',
}))

app.get('/api/premium/data', (req, res) => {
  res.json({ answer: 42, txHash: res.locals.txHash })
})

app.listen(3000)
```

### 3. DEX Trading

```bash
npm install @x1pay/dex
```

```typescript
import { XDex } from '@x1pay/dex'

const dex = XDex.create('x1-mainnet')

// Get a quote
const quote = await dex.getQuote('USDC.x', 'WXNT', '10.0')
console.log(`Expected: ${quote.amountOut}, Impact: ${quote.priceImpact}%`)

// Execute swap (agent wallet pays gas)
const result = await dex.swap(wallet.keypair, 'USDC.x', 'WXNT', '10.0')
console.log(`TX: ${result.txHash}`)

// Price feed
const price = await dex.getPrice('WXNT', 'USDC.x')
console.log(`1 WXNT = ${price} USDC.x`)

// Discover pools
const pools = await dex.listPools()
console.log(`${pools.length} pools on xDEX`)
```

---

## How x402 Works

```
Client                    Server                   Facilitator          X1 Chain
  │                         │                         │                    │
  │── GET /premium ────────>│                         │                    │
  │<── 402 + payment terms ─│                         │                    │
  │                         │                         │                    │
  │── build tx, partial sign│                         │                    │
  │── POST /verify ────────────────────────────────>  │                    │
  │<── { valid: true } ───────────────────────────── │                    │
  │── POST /settle ────────────────────────────────>  │                    │
  │                         │                         │── co-sign + submit─>│
  │                         │                         │<── confirmed ──────│
  │<── { txHash } ──────────────────────────────────  │                    │
  │                         │                         │                    │
  │── GET /premium + X-Payment header ──>│            │                    │
  │<── 200 + data ──────────│                         │                    │
```

1. **Probe** — Client requests the resource. Server responds HTTP 402 with payment terms.
2. **Sign** — SDK builds a `TransferChecked` transaction, buyer partially signs it.
3. **Verify** — Facilitator validates the transaction (correct amounts, programs, authority).
4. **Settle** — Facilitator co-signs and submits on-chain. Buyer pays 0 gas.
5. **Access** — Client sends the settled `txHash` and gets the resource.

---

## Gas Model

| Operation | Who pays gas |
|-----------|-------------|
| `payForResource()` (x402) | **Facilitator** (buyer pays 0 gas) |
| `wallet.send()` | Sender's wallet |
| `dex.swap()` | Agent's wallet |

---

## Supported Assets

| Symbol | Name | Type | Decimals | Mint |
|--------|------|------|----------|------|
| `XNT` | Native XNT | Native | 9 | — |
| `USDC.x` | USD Coin (X1) | Token-2022 | 6 | `B69chRzqzDCmdB5WYB8NRu5Yv5ZA95ABiZcdzCgGm9Tq` |
| `WXNT` | Wrapped XNT | SPL Token | 9 | `So11111111111111111111111111111111111111112` |

---

## OpenClaw Integration

```bash
npm install @x1pay/openclaw
```

Add to `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "x1pays": {
        "package": "@x1pay/openclaw",
        "config": {
          "privateKey": "YOUR_BASE58_KEY",
          "network": "x1-mainnet",
          "sessionBudget": 100000000,
          "maxPerTransaction": 10000000,
          "priceAlerts": true
        }
      }
    }
  }
}
```

### Tools (12)

| Tool | Description |
|------|-------------|
| `x1pays_balance` | Check wallet balances (XNT, USDC.x, WXNT) |
| `x1pays_send` | Send tokens to any X1 address |
| `x1pays_pay` | Pay for an x402-protected resource |
| `x1pays_probe` | Check payment requirements without paying |
| `x1pays_assets` | List supported assets and mints |
| `x1pays_swap` | Swap tokens on xDEX |
| `x1pays_quote` | Get a swap quote (preview without executing) |
| `x1pays_price` | Get current token price from xDEX |
| `x1pays_pools` | List all xDEX liquidity pools |
| `x1pays_stats` | Session spending statistics |
| `x1pays_portfolio` | Full portfolio overview with balances |
| `x1pays_history` | Transaction history |

### Slash Commands (5)

| Command | Example |
|---------|---------|
| `/balance` | Quick balance check |
| `/swap <amount> <from> <to>` | `/swap 10 USDC.x WXNT` |
| `/send <address> <amount> <asset>` | `/send addr... 5 USDC.x` |
| `/price <token>` | `/price WXNT` |
| `/portfolio` | Full portfolio view |

### Skills (3)

SKILL.md files that teach the agent best practices:

| Skill | What it teaches |
|-------|----------------|
| `x1pays` | Core payments — when to use balance, send, pay, probe |
| `x1pays-trading` | DEX trading — always quote before swap, watch price impact, slippage |
| `x1pays-defi` | Advanced DeFi — DCA with cron, price alerts, portfolio rebalancing |

### Background Services (2)

| Service | Description |
|---------|-------------|
| Price Monitor | Polls xDEX pools every 30s, triggers alerts on price conditions |
| Payment Listener | Monitors incoming payments and x402 settlements |

---

## MCP Server (Claude / Cursor)

```bash
npm install -g @x1pay/mcp
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "x1pays": {
      "command": "x1pays-mcp",
      "env": {
        "X1PAYS_PRIVATE_KEY": "your_base58_key",
        "X1PAYS_NETWORK": "x1-mainnet"
      }
    }
  }
}
```

### Cursor

Add to MCP settings — same 12 tools are available for inline code payments and DeFi.

### Run standalone

```bash
X1PAYS_PRIVATE_KEY=your_key X1PAYS_NETWORK=x1-mainnet x1pays-mcp
```

---

## Spending Policies

Enforce strict limits on what your agent can spend:

```typescript
wallet.setPolicy({
  maxPerTransaction: 1_000_000n,     // Max 1 USDC.x per tx
  sessionBudget: 10_000_000n,        // Max 10 USDC.x per session
  dailyBudget: 50_000_000n,          // Max 50 USDC.x per day
  allowedAssets: ['USDC.x'],           // Only USDC.x payments
  allowedRecipients: ['addr1...'],   // Whitelist recipients
})

const check = wallet.checkPolicy(1_000_000n, 'USDC.x', 'recipient...')
// { allowed: true } or { allowed: false, reason: "..." }
```

All amounts in atomic units (USDC.x: 6 decimals, so `1_000_000n` = 1 USDC.x).

---

## xDEX Program IDs

| Network | Program ID |
|---------|------------|
| Mainnet | `sEsYH97wqmfnkzHedjNcw3zyJdPvUmsa9AixhS4b4fN` |
| Testnet | `7EEuq61z9VKdkUzj7G36xGd7ncyz8KBtUwAWVjypYQHf` |

xDEX is a Raydium CP Swap fork running natively on X1.

---

## Pricing

**0.10% per transaction** (10 basis points). No subscriptions, no minimum volume. Gas always covered by X1Pays for x402 payments.

---

## Development

```bash
# Clone
git clone https://github.com/Xenian84/x1pays.git
cd x1pays

# Install
pnpm install

# Build all packages
pnpm run build

# Run tests (requires .env.test with wallet keys)
cp .env.test.example .env.test
# Edit .env.test with your test wallet keys
```

### Project Structure

```
x1pays/
├── packages/
│   ├── sdk/           # Core SDK — WalletManager, payments, policies
│   ├── dex/           # xDEX — swaps, quotes, pools, AMM math
│   ├── middleware/     # Express/Hono/Fastify x402 middleware
│   ├── openclaw/      # OpenClaw plugin — 12 tools, 5 commands, 3 skills
│   ├── mcp/           # MCP server for Claude/Cursor
│   ├── client/        # Low-level x402 client utilities
│   ├── facilitator/   # Payment facilitator service
│   ├── api/           # REST API + facilitator registry
│   ├── shared/        # Shared types and utilities
│   ├── website/       # x1pays.xyz frontend
│   └── x402-x1-react/ # React components for x402
├── examples/          # Usage examples
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

## Links

- **Website**: [x1pays.xyz](https://x1pays.xyz)
- **npm**: [@x1pay](https://www.npmjs.com/org/x1pay)
- **Facilitator**: [x1pays.xyz/facilitator-alpha-mainnet/health](https://x1pays.xyz/facilitator-alpha-mainnet/health)
- **X1 Explorer**: [explorer.x1.xyz](https://explorer.x1.xyz)

## License

MIT
