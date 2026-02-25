# @x1pay/openclaw

OpenClaw plugin for X1Pays — give your AI agent payments, trading, and DeFi on X1 blockchain.

## Features

- **12 tools** — Balance, send, pay, swap, quote, price, pools, stats, portfolio, history, probe, assets
- **5 slash commands** — `/balance`, `/swap`, `/send`, `/price`, `/portfolio`
- **2 background services** — Price monitor, payment listener
- **3 skills** — Payments, trading, DeFi (with SKILL.md documentation)
- **Spending policies** — Per-transaction limits, session budgets, asset whitelists

## Install

```bash
npm install @x1pay/openclaw
```

## Configuration

Add to your OpenClaw config (`~/.openclaw/openclaw.json`):

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
          "priceAlerts": true,
          "priceAlertTokens": ["WXNT", "USDC.x"]
        }
      }
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `x1pays_balance` | Check wallet balances |
| `x1pays_send` | Send tokens to an address |
| `x1pays_pay` | Pay for an x402 resource |
| `x1pays_probe` | Check payment requirements |
| `x1pays_assets` | List supported assets |
| `x1pays_swap` | Swap tokens on xDEX |
| `x1pays_quote` | Get a swap quote |
| `x1pays_price` | Get token price |
| `x1pays_pools` | List DEX liquidity pools |
| `x1pays_stats` | Session spending stats |
| `x1pays_portfolio` | Full portfolio overview |
| `x1pays_history` | Transaction history |

## Slash Commands

- `/balance` — Quick balance check
- `/swap USDC.x WXNT 10` — Swap tokens
- `/send ADDRESS 5 USDC.x` — Send tokens
- `/price WXNT` — Token price
- `/portfolio` — Full portfolio

## Skills

Three SKILL.md files are included for agent guidance:

- **x1pays** — Core payment operations
- **x1pays-trading** — DEX trading best practices
- **x1pays-defi** — DCA, alerts, recurring payments

## Facilitator Scope

The X1Pays facilitator is ONLY involved in x402 API payments (`x1pays_pay`). It co-signs transactions and pays gas so buyers don't need XNT for gas.

All other tools (`x1pays_send`, `x1pays_swap`, `x1pays_quote`, etc.) interact directly with the X1 blockchain. The agent wallet pays its own gas for sends and swaps.

## License

MIT
