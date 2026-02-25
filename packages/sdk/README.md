# @x1pay/sdk

Core SDK for X1Pays — AI payment infrastructure on X1 blockchain. Manage wallets, send tokens, pay for x402-protected resources, and enforce spending policies.

## Install

```bash
npm install @x1pay/sdk
```

## Quick Start

```typescript
import { WalletManager } from '@x1pay/sdk'

// Create wallet from private key
const wallet = new WalletManager(process.env.AGENT_KEY!, {
  network: 'x1-mainnet',
})

// Check balances
const balances = await wallet.getBalances()
console.log(balances.XNT.uiAmount)   // 12.5 XNT
console.log(balances.USDC.x.uiAmount)  // 100.0 USDC.x

// Send tokens
const tx = await wallet.send('RecipientAddress...', '5.0', 'USDC.x')
console.log(tx.txHash)

// Pay for x402-protected API
const result = await wallet.payForResource('https://api.example.com/premium/data')
console.log(result.data)    // The API response
console.log(result.txHash)  // On-chain settlement tx
```

## WalletManager

The main class for all wallet operations.

### Constructor

```typescript
const wallet = new WalletManager(privateKeyOrKeypair, config?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `privateKeyOrKeypair` | `string \| Keypair` | Base58 private key or Solana `Keypair` |
| `config.network` | `'x1-mainnet' \| 'x1-testnet'` | Network (default: `x1-mainnet`) |
| `config.rpcUrl` | `string` | Custom RPC URL (optional) |
| `config.facilitatorUrl` | `string` | Custom facilitator URL (optional) |

### Static Methods

```typescript
// Generate a new random wallet
const wallet = WalletManager.generate({ network: 'x1-mainnet' })

// From base58 secret key
const wallet = WalletManager.fromSecretKey('base58key...', { network: 'x1-mainnet' })
```

### Balances

```typescript
// All balances at once
const balances = await wallet.getBalances()
// Returns: { XNT: TokenBalance, WXNT: TokenBalance, USDC.x: TokenBalance }

// Single asset
const usdx = await wallet.getBalance('USDC.x')
console.log(usdx.uiAmount)  // 100.0
console.log(usdx.amount)    // 100000000n (atomic)
```

**TokenBalance:**

```typescript
interface TokenBalance {
  symbol: string     // "USDC.x"
  name: string       // "USDC.x"
  mint: string       // "B69chRzqz..."
  amount: bigint     // 100000000n (atomic units)
  decimals: number   // 6
  uiAmount: number   // 100.0 (human-readable)
}
```

### Send Tokens

```typescript
const result = await wallet.send(to, amount, asset)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `to` | `string` | Recipient wallet address |
| `amount` | `string` | Human-readable amount (e.g. `'5.0'`) |
| `asset` | `'USDC.x' \| 'WXNT' \| 'XNT'` | Asset to send |

Returns `TxResult`:

```typescript
interface TxResult {
  txHash: string     // On-chain transaction hash
  amount: string     // Amount sent
  asset: string      // Asset symbol
  to: string         // Recipient address
  timestamp: number  // Unix timestamp
}
```

The sender's wallet pays gas for direct transfers.

### x402 Payments

#### payForResource

The full x402 payment flow: probe for 402, build payment, verify with facilitator, settle on-chain, access resource.

```typescript
const result = await wallet.payForResource(url, options?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The x402-protected endpoint |
| `options.preferredAsset` | `AssetSymbol` | Preferred payment asset (optional) |

Returns `PayResult`:

```typescript
interface PayResult {
  data: any       // The API response data
  txHash: string  // Settlement transaction hash
  amount: string  // Amount paid (atomic)
}
```

The facilitator pays gas for x402 payments. The buyer only pays the resource price.

#### probeResource

Check payment requirements without paying:

```typescript
const req = await wallet.probeResource('https://api.example.com/premium')
if (req) {
  console.log(req.accepts)  // Payment options
}
```

## Spending Policies

Control how much your agent can spend:

```typescript
wallet.setPolicy({
  maxPerTransaction: 1_000_000n,     // Max 1 USDC.x per tx
  sessionBudget: 10_000_000n,        // Max 10 USDC.x per session
  dailyBudget: 50_000_000n,          // Max 50 USDC.x per day
  allowedAssets: ['USDC.x'],           // Only USDC.x payments
  allowedRecipients: ['addr1...'],   // Whitelist recipients
  requireConfirmation: 5_000_000n,   // Confirm above 5 USDC.x
})

// Check before paying
const check = wallet.checkPolicy(1_000_000n, 'USDC.x', 'recipient...')
if (!check.allowed) {
  console.log(check.reason)  // "Amount exceeds per-transaction limit"
}
```

All amounts are in atomic units (USDC.x has 6 decimals, so `1_000_000n` = 1 USDC.x).

## Asset Registry

Resolve assets by symbol, alias, or mint address:

```typescript
import { resolveAsset, tryResolveAsset, ASSETS } from '@x1pay/sdk'

// By symbol
const usdx = resolveAsset('USDC.x')
// { symbol: 'USDC.x', mint: 'B69chRzq...', decimals: 6, name: 'USDC.x', type: 'token-2022' }

// By alias (case-insensitive)
resolveAsset('usdx')    // works
resolveAsset('USDC.x')    // works

// Safe resolve (returns null instead of throwing)
const asset = tryResolveAsset('UNKNOWN')  // null

// All assets
console.log(ASSETS.XNT)   // Native XNT
console.log(ASSETS.WXNT)  // Wrapped XNT (SPL)
console.log(ASSETS.USDC.x)  // USDC.x (Token-2022)
```

### Supported Assets

| Symbol | Mint | Decimals | Type |
|--------|------|----------|------|
| `XNT` | native | 9 | Native |
| `WXNT` | `So111...112` | 9 | SPL Token |
| `USDC.x` | `B69chRzq...` | 6 | Token-2022 |

## Payment Builder

Low-level functions for building x402 payment transactions:

```typescript
import { buildSignedPayment, calculateFee, createPaymentTransaction } from '@x1pay/sdk'

// Calculate facilitator fee (10 bps = 0.10%)
const fee = calculateFee(1_000_000n, 10)  // 1000n

// Build a signed payment for facilitator settlement
const payment = await buildSignedPayment({
  keypair: wallet.keypair,
  connection: wallet.getConnection(),
  network: 'x1-mainnet',
  accept: paymentRequirement.accepts[0],
  paymentAmount: 1_000_000n,
  feePayer: facilitatorAddress,
})
```

## Stats & History

```typescript
// Session stats
console.log(wallet.stats)
// {
//   address: '...',
//   network: 'x1-mainnet',
//   totalSpent: 5000000,
//   sessionBudget: 100000000,
//   budgetRemaining: 95000000,
//   transactionCount: 3,
//   transactions: [...]
// }

// Transaction history
const history = wallet.history
// [{ txHash, amount, asset, to, timestamp }, ...]
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `wallet.address` | `string` | Wallet public address (base58) |
| `wallet.keypair` | `Keypair` | Solana Keypair for signing |
| `wallet.secretKey` | `string` | Base58-encoded secret key |
| `wallet.stats` | `WalletStats` | Session spending stats |
| `wallet.history` | `TxRecord[]` | Transaction history |

## Methods Summary

| Method | Description |
|--------|-------------|
| `getBalances()` | All token balances (XNT, WXNT, USDC.x) |
| `getBalance(asset)` | Single asset balance |
| `send(to, amount, asset)` | Transfer tokens (sender pays gas) |
| `payForResource(url, opts?)` | Full x402 payment flow (facilitator pays gas) |
| `probeResource(url)` | Probe for payment requirements |
| `setPolicy(policy)` | Set spending limits |
| `checkPolicy(amount, asset, recipient?)` | Check if payment is allowed |
| `getConnection()` | Get the Solana Connection instance |
| `getNetwork()` | Get current network |
| `getFacilitatorUrl()` | Get facilitator URL |

## Gas Model

| Operation | Who pays gas |
|-----------|-------------|
| `payForResource()` | Facilitator (buyer pays 0 gas) |
| `send()` | Sender's wallet |
| DEX swaps via `@x1pay/dex` | Agent's wallet |

## Error Handling

All methods throw descriptive errors:

```typescript
try {
  await wallet.send('invalid-address', '5.0', 'USDC.x')
} catch (err) {
  // "Invalid recipient address: invalid-address"
}

try {
  await wallet.send('addr...', '-1', 'USDC.x')
} catch (err) {
  // "Invalid amount: -1. Must be a positive number"
}

try {
  await wallet.payForResource('https://api.example.com/premium')
} catch (err) {
  // "Policy violation: Amount exceeds per-transaction limit"
  // "402 response but no X-Payment-Required header"
  // "Settlement failed (500): ..."
}
```

## TypeScript Types

All types are exported:

```typescript
import type {
  Network,
  AssetSymbol,
  AssetInfo,
  TokenBalance,
  TxResult,
  PayResult,
  PayOptions,
  WalletConfig,
  WalletStats,
  TxRecord,
  PolicyCheck,
  SpendingPolicy,
  SignedPayment,
  PaymentRequirement,
} from '@x1pay/sdk'
```

## Related Packages

| Package | Description |
|---------|-------------|
| [`@x1pay/dex`](https://www.npmjs.com/package/@x1pay/dex) | DEX swaps, quotes, pool discovery on xDEX |
| [`@x1pay/middleware`](https://www.npmjs.com/package/@x1pay/middleware) | Express/Hono/Fastify middleware for x402 paywalls |
| [`@x1pay/mcp`](https://www.npmjs.com/package/@x1pay/mcp) | MCP server for Claude Desktop / Cursor |
| [`@x1pay/openclaw`](https://www.npmjs.com/package/@x1pay/openclaw) | OpenClaw plugin with 12 tools |

## Links

- [Website](https://x1pays.xyz)
- [Documentation](https://x1pays.xyz/docs)
- [GitHub](https://github.com/Xenian84/x1pays)
- [npm](https://www.npmjs.com/package/@x1pay/sdk)

## License

MIT
