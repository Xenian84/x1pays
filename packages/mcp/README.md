# @x1pay/mcp

MCP (Model Context Protocol) server for X1Pays — connect Claude Desktop, Cursor, or any MCP client to X1 payments and DeFi.

## Install

```bash
npm install -g @x1pay/mcp
```

## Usage

```bash
X1PAYS_PRIVATE_KEY=your_key X1PAYS_NETWORK=x1-mainnet x1pays-mcp
```

### Claude Desktop config

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

## Tools (12)

All the same tools available in the OpenClaw plugin:

**Payments:** `x1pays_balance`, `x1pays_send`, `x1pays_pay`, `x1pays_probe`, `x1pays_assets`

**Trading:** `x1pays_swap`, `x1pays_quote`, `x1pays_price`, `x1pays_pools`

**Portfolio:** `x1pays_stats`, `x1pays_portfolio`, `x1pays_history`

## License

MIT
