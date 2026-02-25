import type { WalletManager } from "@x1pay/sdk";
import type { XDex } from "@x1pay/dex";

export function registerCommands(
  api: any,
  wallet: WalletManager,
  dex: XDex
) {
  api.registerCommand({
    name: "balance",
    description: "Quick balance check (no AI needed)",
    handler: async () => {
      const balances = await wallet.getBalances();
      const lines = Object.entries(balances).map(
        ([sym, bal]) => `${sym}: ${bal.uiAmount.toFixed(bal.decimals)} ${bal.name}`
      );
      return { text: lines.join("\n") };
    },
  });

  api.registerCommand({
    name: "swap",
    description: "Swap tokens: /swap <amount> <from> <to>",
    acceptsArgs: true,
    handler: async (ctx: any) => {
      const args = (ctx.args || "").trim().split(/\s+/);
      if (args.length < 3) {
        return { text: "Usage: /swap <amount> <from> <to>\nExample: /swap 10 USDX WXNT" };
      }
      const [amount, from, to] = args;
      try {
        const result = await dex.swap(wallet.keypair, from, to, amount);
        return {
          text: `Swapped ${result.amountIn} ${from} → ${result.amountOut} ${to}\nTX: ${result.txHash}`,
        };
      } catch (err: any) {
        return { text: `Swap failed: ${err.message}` };
      }
    },
  });

  api.registerCommand({
    name: "send",
    description: "Send tokens: /send <amount> <asset> <address>",
    acceptsArgs: true,
    handler: async (ctx: any) => {
      const args = (ctx.args || "").trim().split(/\s+/);
      if (args.length < 3) {
        return { text: "Usage: /send <amount> <asset> <address>\nExample: /send 5 USDX 7xKp..." };
      }
      const [amount, asset, to] = args;
      try {
        const result = await wallet.send(to, amount, asset as any);
        return { text: `Sent ${amount} ${asset} to ${to}\nTX: ${result.txHash}` };
      } catch (err: any) {
        return { text: `Send failed: ${err.message}` };
      }
    },
  });

  api.registerCommand({
    name: "price",
    description: "Token price: /price <tokenA> <tokenB>",
    acceptsArgs: true,
    handler: async (ctx: any) => {
      const args = (ctx.args || "").trim().split(/\s+/);
      if (args.length < 2) {
        return { text: "Usage: /price <tokenA> <tokenB>\nExample: /price USDX WXNT" };
      }
      const [tokenA, tokenB] = args;
      try {
        const price = await dex.getPrice(tokenA, tokenB);
        return { text: `1 ${tokenA} = ${price.toFixed(6)} ${tokenB}` };
      } catch (err: any) {
        return { text: `Price error: ${err.message}` };
      }
    },
  });

  api.registerCommand({
    name: "portfolio",
    description: "Full portfolio view",
    handler: async () => {
      const balances = await wallet.getBalances();
      const lines = [`Wallet: ${wallet.address}`, ""];
      for (const [sym, bal] of Object.entries(balances)) {
        lines.push(`  ${sym}: ${bal.uiAmount.toFixed(bal.decimals)} ${bal.name}`);
      }
      const stats = wallet.stats;
      lines.push("");
      lines.push(`Session spent: ${stats.totalSpent / 1e6} USDX`);
      lines.push(`Budget remaining: ${stats.budgetRemaining / 1e6} USDX`);
      return { text: lines.join("\n") };
    },
  });
}
