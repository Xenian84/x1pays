import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  WalletManager,
  ASSETS,
  resolveAsset,
} from "@x1pay/sdk";
import { XDex } from "@x1pay/dex";
import type { Network } from "@x1pay/sdk";

export interface X1PaysMcpConfig {
  privateKey: string;
  rpcUrl?: string;
  network?: Network;
  facilitatorUrl?: string;
  maxPaymentPerRequest?: number;
  budgetLimit?: number;
}

export function createX1PaysMcp(config: X1PaysMcpConfig) {
  const server = new McpServer({
    name: "x1pays",
    version: "0.3.0",
  });

  const network: Network = config.network || "x1-mainnet";

  const wallet = new WalletManager(config.privateKey, {
    rpcUrl: config.rpcUrl,
    network,
    facilitatorUrl: config.facilitatorUrl,
  });

  if (config.maxPaymentPerRequest || config.budgetLimit) {
    wallet.setPolicy({
      maxPerTransaction: config.maxPaymentPerRequest
        ? BigInt(config.maxPaymentPerRequest)
        : undefined,
      sessionBudget: config.budgetLimit
        ? BigInt(config.budgetLimit)
        : undefined,
    });
  }

  const dex = XDex.create(network, config.rpcUrl);

  // ── Payment Tools ──

  server.tool(
    "x1pays_balance",
    "Check the agent wallet's token balances on X1 (XNT, USDC.x, wXNT)",
    {},
    async () => {
      const balances = await wallet.getBalances();
      const result: Record<string, string> = { address: wallet.address };
      for (const [sym, bal] of Object.entries(balances)) {
        result[sym] = `${bal.uiAmount.toFixed(bal.decimals)} ${bal.name}`;
      }
      const stats = wallet.stats;
      result.sessionSpent = `${stats.totalSpent / 1e6} USDC.x`;
      result.budgetRemaining = `${stats.budgetRemaining / 1e6} USDC.x`;
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "x1pays_pay",
    "Access an x402-protected resource by automatically handling the 402 payment flow",
    {
      url: z.string().url().describe("The URL of the x402-protected resource"),
      preferred_asset: z.enum(["USDX", "WXNT"]).optional().describe("Preferred token (default: USDC.x)"),
    },
    async ({ url, preferred_asset }) => {
      try {
        const result = await wallet.payForResource(url, {
          preferredAsset: preferred_asset as any,
        });
        if (!result.txHash) {
          const data = typeof result.data === "string" ? result.data : JSON.stringify(result.data);
          return { content: [{ type: "text", text: data }] };
        }
        const stats = wallet.stats;
        const summary = [
          `Payment successful! TX: ${result.txHash}`,
          `Amount: ${result.amount} | Session total: ${stats.totalSpent / 1e6} USDC.x`,
          "---",
          typeof result.data === "string" ? result.data : JSON.stringify(result.data),
        ].join("\n");
        return { content: [{ type: "text", text: summary }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `Error: ${err.message}` }] };
      }
    }
  );

  server.tool(
    "x1pays_probe",
    "Probe a URL to check if it requires x402 payment and return pricing without paying",
    { url: z.string().url().describe("URL to probe") },
    async ({ url }) => {
      const req = await wallet.probeResource(url);
      if (!req) {
        return { content: [{ type: "text", text: "No payment required." }] };
      }
      return { content: [{ type: "text", text: JSON.stringify(req, null, 2) }] };
    }
  );

  server.tool(
    "x1pays_send",
    "Send a direct token payment to any X1 address",
    {
      to: z.string().describe("Recipient wallet address"),
      amount: z.string().describe("Amount (e.g. '0.5')"),
      asset: z.enum(["USDX", "WXNT"]).describe("Token to send"),
    },
    async ({ to, amount, asset }) => {
      try {
        const result = await wallet.send(to, amount, asset as any);
        return {
          content: [{ type: "text", text: `Sent ${amount} ${asset} to ${to}\nTX: ${result.txHash}` }],
        };
      } catch (err: any) {
        return { content: [{ type: "text", text: `Error: ${err.message}` }] };
      }
    }
  );

  server.tool(
    "x1pays_assets",
    "List all supported payment assets on X1",
    {},
    async () => {
      const list = Object.entries(ASSETS).map(([sym, info]) => ({
        symbol: sym, name: info.name, mint: info.mint, decimals: info.decimals, type: info.type,
      }));
      return { content: [{ type: "text", text: JSON.stringify(list, null, 2) }] };
    }
  );

  // ── Trading Tools ──

  server.tool(
    "x1pays_swap",
    "Swap tokens on xDEX (X1 DEX). Gets a quote, checks price impact, and executes.",
    {
      input_token: z.string().describe("Input token symbol or mint (e.g. 'USDC.x')"),
      output_token: z.string().describe("Output token symbol or mint (e.g. 'WXNT')"),
      amount: z.string().describe("Amount to swap (human-readable, e.g. '10.0')"),
      slippage_bps: z.number().optional().describe("Slippage in basis points (default 100 = 1%)"),
    },
    async ({ input_token, output_token, amount, slippage_bps }) => {
      try {
        const slippage = slippage_bps ?? 100;
        const quote = await dex.getQuote(input_token, output_token, amount, slippage);
        if (quote.priceImpact > 5) {
          return {
            content: [{ type: "text", text: `WARNING: Price impact ${quote.priceImpact}%. Aborting. Try smaller amount.` }],
          };
        }
        const result = await dex.swap(wallet.keypair, input_token, output_token, amount, slippage);
        return {
          content: [{
            type: "text",
            text: `Swap OK!\nTX: ${result.txHash}\nSold: ${result.amountIn} ${input_token}\nReceived: ${result.amountOut} ${output_token}\nImpact: ${result.priceImpact}%`,
          }],
        };
      } catch (err: any) {
        return { content: [{ type: "text", text: `Swap failed: ${err.message}` }] };
      }
    }
  );

  server.tool(
    "x1pays_quote",
    "Get a swap quote from xDEX without executing",
    {
      input_token: z.string().describe("Input token"),
      output_token: z.string().describe("Output token"),
      amount: z.string().describe("Amount (human-readable)"),
    },
    async ({ input_token, output_token, amount }) => {
      try {
        const quote = await dex.getQuote(input_token, output_token, amount);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              input: `${amount} ${input_token}`,
              expectedOutput: quote.amountOut.toString(),
              fee: quote.fee.toString(),
              priceImpact: `${quote.priceImpact}%`,
              minimumReceived: quote.minimumReceived.toString(),
            }, null, 2),
          }],
        };
      } catch (err: any) {
        return { content: [{ type: "text", text: `Quote failed: ${err.message}` }] };
      }
    }
  );

  server.tool(
    "x1pays_price",
    "Get current token price from xDEX pool",
    {
      token_a: z.string().describe("First token (e.g. 'USDC.x')"),
      token_b: z.string().describe("Second token (e.g. 'WXNT')"),
    },
    async ({ token_a, token_b }) => {
      try {
        const price = await dex.getPrice(token_a, token_b);
        return { content: [{ type: "text", text: `1 ${token_a} = ${price.toFixed(6)} ${token_b}` }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `Price error: ${err.message}` }] };
      }
    }
  );

  server.tool(
    "x1pays_pools",
    "List available xDEX liquidity pools",
    {},
    async () => {
      try {
        const pools = await dex.listPools();
        if (pools.length === 0) return { content: [{ type: "text", text: "No pools found." }] };
        const formatted = pools.map((p) => ({
          address: p.address.toBase58(),
          pair: `${p.token0.symbol || p.token0.mint.toBase58().slice(0, 8)}/${p.token1.symbol || p.token1.mint.toBase58().slice(0, 8)}`,
          spotPrice: p.spotPrice.toFixed(6),
          status: p.status,
        }));
        return { content: [{ type: "text", text: JSON.stringify(formatted, null, 2) }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `Error: ${err.message}` }] };
      }
    }
  );

  // ── Portfolio Tools ──

  server.tool(
    "x1pays_stats",
    "Get spending statistics for the current session",
    {},
    async () => {
      const stats = wallet.stats;
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            address: stats.address,
            network: stats.network,
            totalSpent: `${stats.totalSpent / 1e6} USDC.x`,
            budgetRemaining: `${stats.budgetRemaining / 1e6} USDC.x`,
            transactions: stats.transactionCount,
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "x1pays_portfolio",
    "Full portfolio view with all token balances",
    {},
    async () => {
      const balances = await wallet.getBalances();
      const portfolio = Object.entries(balances).map(([sym, bal]) => ({
        token: sym, name: bal.name, balance: bal.uiAmount.toFixed(bal.decimals),
      }));
      return {
        content: [{ type: "text", text: JSON.stringify({ address: wallet.address, portfolio }, null, 2) }],
      };
    }
  );

  server.tool(
    "x1pays_history",
    "View recent transaction history",
    { limit: z.number().optional().describe("Max transactions (default 10)") },
    async ({ limit }) => {
      const history = wallet.history.slice(-(limit || 10));
      if (history.length === 0) return { content: [{ type: "text", text: "No transactions yet." }] };
      const formatted = history.map((tx) => ({
        txHash: tx.txHash, amount: tx.amount, asset: tx.asset, to: tx.to,
        time: new Date(tx.timestamp).toISOString(),
      }));
      return { content: [{ type: "text", text: JSON.stringify(formatted, null, 2) }] };
    }
  );

  return server;
}

export { McpServer };
