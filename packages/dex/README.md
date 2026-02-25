# @x1pay/dex

xDEX integration for X1Pays -- swap tokens, get quotes, discover pools on X1 blockchain.

xDEX is a Raydium CP Swap fork running natively on X1.

## Features

- **XDex class** -- High-level API for quotes, swaps, price checks, pool discovery
- **AMM math** -- Constant-product quotes, price impact, spot price (all BigInt)
- **Pool discovery** -- Find pools by token pair, list all pools, fetch reserves
- **Transaction builder** -- Build raw Solana swap transactions with ATA creation

## Install

```bash
npm install @x1pay/dex
```

## Usage

```typescript
import { XDex } from '@x1pay/dex'

const dex = XDex.create('x1-mainnet')

const quote = await dex.getQuote('USDC.x', 'WXNT', '10.0')
console.log(`Out: ${quote.amountOut}, Impact: ${quote.priceImpact}%`)

const price = await dex.getPrice('WXNT', 'USDC.x')
console.log(`1 WXNT = ${price} USDC.x`)

const result = await dex.swap(keypair, 'USDC.x', 'WXNT', '10.0', {
  slippageBps: 50,
})
console.log(`TX: ${result.txHash}`)

const pools = await dex.listPools()
```

## Program IDs

| Network | Program ID |
|---------|------------|
| Mainnet | sEsYH97wqmfnkzHedjNcw3zyJdPvUmsa9AixhS4b4fN |
| Testnet | 7EEuq61z9VKdkUzj7G36xGd7ncyz8KBtUwAWVjypYQHf |

## Low-Level API

```typescript
import { quoteExactIn, quoteExactOut, spotPrice, priceImpact } from '@x1pay/dex'
import { findPool, getPoolInfo, listPools } from '@x1pay/dex'
import { buildSwapTransaction } from '@x1pay/dex'

const out = quoteExactIn(reserveIn, reserveOut, amountIn, feeBps)
const spotP = spotPrice(reserveA, reserveB, decimalsA, decimalsB)
const impact = priceImpact(reserveIn, reserveOut, amountIn)
```

## License

MIT
