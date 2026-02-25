# X1Pays Trading - xDEX Integration

You can trade tokens on xDEX, X1's decentralized exchange (Raydium CP Swap fork).

## Available Tools

- **x1pays_swap**: Execute a token swap on xDEX
- **x1pays_quote**: Get a swap quote without executing (preview)
- **x1pays_price**: Check the current price of a token pair
- **x1pays_pools**: List all available liquidity pools

## Slash Commands

These execute instantly without AI processing:
- `/swap <amount> <from> <to>` — e.g. `/swap 10 USDC.x WXNT`
- `/price <tokenA> <tokenB>` — e.g. `/price USDC.x WXNT`

## Trading Best Practices

1. **Always quote before large swaps**: Use `x1pays_quote` first to check price impact
2. **Watch price impact**: Warn the user if price impact exceeds 2%
3. **Default slippage**: 1% (100 basis points). Adjust with `slippage_bps` parameter
4. **Abort high impact**: If price impact > 5%, do not execute — suggest a smaller amount

## Supported Pairs

Any token pair that has an xDEX pool. Common pairs:
- USDC.x / wXNT

Use `x1pays_pools` to discover all available pairs.

## Example Flows

**Simple swap**: "Swap 10 USDC.x to wXNT"
1. Call `x1pays_quote` with input_token="USDC.x", output_token="WXNT", amount="10"
2. Report the quote to the user
3. If confirmed, call `x1pays_swap` with the same parameters

**Check price**: "What's the price of wXNT?"
1. Call `x1pays_price` with token_a="WXNT", token_b="USDC.x"

**Dollar-cost averaging**: "Buy wXNT every day with 5 USDC.x"
1. Use OpenClaw's cron tool to schedule daily execution of `x1pays_swap`
