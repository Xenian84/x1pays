import type { XDex } from "@x1pay/dex";
import type { WalletManager } from "@x1pay/sdk";

export function registerTradingTools(
  api: any,
  wallet: WalletManager,
  dex: XDex
) {
  api.registerTool({
    name: "x1pays_swap",
    description:
      "Swap tokens on xDEX (X1's decentralized exchange). Supports USDX, wXNT, and any xDEX-listed token. Always gets a quote first and warns about high price impact.",
    parameters: {
      type: "object",
      properties: {
        input_token: {
          type: "string",
          description: "Input token symbol or mint address (e.g. 'USDX', 'WXNT', or mint address)",
        },
        output_token: {
          type: "string",
          description: "Output token symbol or mint address",
        },
        amount: {
          type: "string",
          description: "Amount to swap in human-readable form (e.g. '10.0')",
        },
        slippage_bps: {
          type: "number",
          description: "Slippage tolerance in basis points (default 100 = 1%)",
        },
      },
      required: ["input_token", "output_token", "amount"],
    },
    handler: async ({
      input_token,
      output_token,
      amount,
      slippage_bps,
    }: {
      input_token: string;
      output_token: string;
      amount: string;
      slippage_bps?: number;
    }) => {
      try {
        const slippage = slippage_bps ?? 100;

        const quote = await dex.getQuote(input_token, output_token, amount, slippage);
        if (quote.priceImpact > 5) {
          return `WARNING: High price impact (${quote.priceImpact}%). Aborting swap. Try a smaller amount.`;
        }

        const result = await dex.swap(
          wallet.keypair,
          input_token,
          output_token,
          amount,
          slippage
        );

        return [
          `Swap successful!`,
          `TX: ${result.txHash}`,
          `Sold: ${result.amountIn} ${input_token}`,
          `Received: ${result.amountOut} ${output_token}`,
          `Price impact: ${result.priceImpact}%`,
          `Pool: ${result.pool}`,
        ].join("\n");
      } catch (err: any) {
        return `Swap failed: ${err.message}`;
      }
    },
  });

  api.registerTool({
    name: "x1pays_quote",
    description:
      "Get a swap quote from xDEX without executing the trade. Shows expected output, fees, and price impact.",
    parameters: {
      type: "object",
      properties: {
        input_token: { type: "string", description: "Input token symbol or mint" },
        output_token: { type: "string", description: "Output token symbol or mint" },
        amount: { type: "string", description: "Amount to swap (human-readable)" },
      },
      required: ["input_token", "output_token", "amount"],
    },
    handler: async ({
      input_token,
      output_token,
      amount,
    }: {
      input_token: string;
      output_token: string;
      amount: string;
    }) => {
      try {
        const quote = await dex.getQuote(input_token, output_token, amount);
        return JSON.stringify(
          {
            input: `${amount} ${input_token}`,
            expectedOutput: quote.amountOut.toString(),
            fee: quote.fee.toString(),
            priceImpact: `${quote.priceImpact}%`,
            spotPriceBefore: quote.spotPriceBefore,
            spotPriceAfter: quote.spotPriceAfter,
            minimumReceived: quote.minimumReceived.toString(),
            warning: quote.priceImpact > 2 ? "High price impact — consider smaller amount" : undefined,
          },
          null,
          2
        );
      } catch (err: any) {
        return `Quote failed: ${err.message}`;
      }
    },
  });

  api.registerTool({
    name: "x1pays_price",
    description: "Get the current price of a token pair from xDEX pool",
    parameters: {
      type: "object",
      properties: {
        token_a: { type: "string", description: "First token (e.g. 'USDX')" },
        token_b: { type: "string", description: "Second token (e.g. 'WXNT')" },
      },
      required: ["token_a", "token_b"],
    },
    handler: async ({ token_a, token_b }: { token_a: string; token_b: string }) => {
      try {
        const price = await dex.getPrice(token_a, token_b);
        return `1 ${token_a} = ${price.toFixed(6)} ${token_b}`;
      } catch (err: any) {
        return `Price lookup failed: ${err.message}`;
      }
    },
  });

  api.registerTool({
    name: "x1pays_pools",
    description: "List available xDEX liquidity pools with their reserves and prices",
    parameters: {},
    handler: async () => {
      try {
        const pools = await dex.listPools();
        if (pools.length === 0) return "No xDEX pools found on this network.";

        const formatted = pools.map((p) => ({
          address: p.address.toBase58(),
          pair: `${p.token0.symbol || p.token0.mint.toBase58().slice(0, 8)}/${p.token1.symbol || p.token1.mint.toBase58().slice(0, 8)}`,
          reserve0: p.reserve0.toString(),
          reserve1: p.reserve1.toString(),
          spotPrice: p.spotPrice.toFixed(6),
          feeRate: `${Number(p.tradeFeeRate) / 10000}%`,
          status: p.status,
        }));

        return JSON.stringify(formatted, null, 2);
      } catch (err: any) {
        return `Failed to list pools: ${err.message}`;
      }
    },
  });
}
