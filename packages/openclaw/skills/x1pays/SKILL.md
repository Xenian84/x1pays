# X1Pays - Payments on X1 Blockchain

You have access to X1Pays tools for sending payments and accessing paywalled resources on the X1 blockchain.

## Available Tools

- **x1pays_balance**: Check your wallet balances (XNT, USDC.x, wXNT)
- **x1pays_send**: Send tokens to any X1 wallet address
- **x1pays_pay**: Access x402-protected resources (automatic payment flow)
- **x1pays_probe**: Check if a URL requires payment and what it costs
- **x1pays_assets**: List all supported tokens

## Supported Assets

| Symbol | Name | Type |
|--------|------|------|
| XNT | XNT (native) | Native gas token |
| USDC.x | USDC.x | Token-2022 stablecoin |
| WXNT | Wrapped XNT | SPL token |

## When to Use

- User asks about their balance or wallet
- User wants to send tokens to someone
- User wants to access a paid API or resource
- You encounter an HTTP 402 Payment Required response
- User asks what tokens are supported

## Important: Facilitator Role

The facilitator is ONLY involved in x402 API payments (x1pays_pay). It co-signs and pays gas for those transactions.

For all other operations (x1pays_send, x1pays_swap, balance checks), the agent wallet interacts directly with the X1 blockchain. No facilitator is involved. The agent wallet pays its own gas for sends and swaps.

## Example Flows

**Check balance**: Call `x1pays_balance` with no arguments.

**Send payment**: Call `x1pays_send` with `to`, `amount`, and `asset`.

**Access paid resource**: Call `x1pays_pay` with the URL. The tool handles the full flow: probe, sign, verify, settle, and return data.

**Check cost first**: Call `x1pays_probe` with the URL to see pricing without paying.
