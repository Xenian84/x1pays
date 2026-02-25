# X1Pays DeFi - Advanced Operations

Advanced DeFi operations combining X1Pays tools with OpenClaw built-in capabilities.

## DCA (Dollar-Cost Averaging)

Use OpenClaw cron tool to schedule recurring swaps.

Example: "Buy 5 USDX worth of wXNT every day at 9am"
1. Create a cron job that calls x1pays_swap with input_token="USDX", output_token="WXNT", amount="5"
2. The cron runs daily and executes the swap automatically

## Price Alerts

If the X1Pays price monitor service is enabled (priceAlerts: true in config), it polls xDEX pools every 30 seconds.

Example: "Alert me when wXNT drops below 0.5 USDX"
- The price monitor watches the WXNT/USDX pool
- When the condition is met, the agent is notified

## Portfolio Management

Combine x1pays_portfolio and x1pays_swap for rebalancing.

Example: "Keep my portfolio 50/50 between USDX and wXNT"
1. Call x1pays_portfolio to get current balances
2. Calculate the imbalance
3. Call x1pays_swap to rebalance

## Available Tools for DeFi

- x1pays_portfolio: Full portfolio view with all balances
- x1pays_stats: Session spending statistics
- x1pays_history: Recent transaction history
- x1pays_swap: Execute swaps
- x1pays_quote: Preview swaps
- x1pays_price: Current prices
- x1pays_pools: Available pools
