import type { WalletManager } from "@x1pay/sdk";
import type { XDex } from "@x1pay/dex";

export function registerPortfolioTools(
  api: any,
  wallet: WalletManager,
  dex: XDex
) {
  api.registerTool({
    name: "x1pays_stats",
    description: "Get spending statistics for the current agent session",
    parameters: {},
    handler: async () => {
      const stats = wallet.stats;
      return JSON.stringify(
        {
          address: stats.address,
          network: stats.network,
          totalSpent: `${stats.totalSpent / 1e6} USDX`,
          sessionBudget: `${stats.sessionBudget / 1e6} USDX`,
          budgetRemaining: `${stats.budgetRemaining / 1e6} USDX`,
          budgetUsedPercent: `${((stats.totalSpent / stats.sessionBudget) * 100).toFixed(1)}%`,
          transactionCount: stats.transactionCount,
        },
        null,
        2
      );
    },
  });

  api.registerTool({
    name: "x1pays_portfolio",
    description:
      "Get a full portfolio view showing all token balances with estimated USD values where available",
    parameters: {},
    handler: async () => {
      try {
        const balances = await wallet.getBalances();
        const portfolio: any[] = [];

        for (const [sym, bal] of Object.entries(balances)) {
          const entry: any = {
            token: sym,
            name: bal.name,
            balance: bal.uiAmount.toFixed(bal.decimals),
          };

          if (sym === "USDX") {
            entry.valueUsd = `$${bal.uiAmount.toFixed(2)}`;
          }

          portfolio.push(entry);
        }

        return JSON.stringify(
          { address: wallet.address, portfolio },
          null,
          2
        );
      } catch (err: any) {
        return `Portfolio error: ${err.message}`;
      }
    },
  });

  api.registerTool({
    name: "x1pays_history",
    description: "View recent transaction history for this agent session",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max transactions to show (default 10)" },
      },
    },
    handler: async ({ limit }: { limit?: number }) => {
      const history = wallet.history;
      const n = limit || 10;
      const recent = history.slice(-n);

      if (recent.length === 0) return "No transactions yet this session.";

      const formatted = recent.map((tx) => ({
        txHash: tx.txHash,
        amount: tx.amount,
        asset: tx.asset,
        to: tx.to,
        time: new Date(tx.timestamp).toISOString(),
      }));

      return JSON.stringify(formatted, null, 2);
    },
  });
}
