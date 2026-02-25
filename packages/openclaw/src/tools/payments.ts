import type { WalletManager } from "@x1pay/sdk";
import { ASSETS, resolveAsset } from "@x1pay/sdk";

export function registerPaymentTools(
  api: any,
  wallet: WalletManager
) {
  api.registerTool({
    name: "x1pays_balance",
    description: "Check the agent wallet's token balances on X1 blockchain (XNT, USDX, wXNT)",
    parameters: {},
    handler: async () => {
      const balances = await wallet.getBalances();
      const result: Record<string, string> = { address: wallet.address };
      for (const [sym, bal] of Object.entries(balances)) {
        result[sym] = `${bal.uiAmount.toFixed(bal.decimals)} ${bal.name}`;
      }
      const stats = wallet.stats;
      result.sessionSpent = `${stats.totalSpent / 1e6} USDX`;
      result.budgetRemaining = `${stats.budgetRemaining / 1e6} USDX`;
      return JSON.stringify(result, null, 2);
    },
  });

  api.registerTool({
    name: "x1pays_send",
    description: "Send a direct token payment to any X1 address",
    parameters: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient wallet address" },
        amount: { type: "string", description: "Amount in human-readable form (e.g. '0.5')" },
        asset: { type: "string", enum: ["USDX", "WXNT"], description: "Token to send" },
      },
      required: ["to", "amount", "asset"],
    },
    handler: async ({ to, amount, asset }: { to: string; amount: string; asset: string }) => {
      try {
        const result = await wallet.send(to, amount, asset as any);
        return `Payment sent!\nTX: ${result.txHash}\nAmount: ${amount} ${asset}\nTo: ${to}`;
      } catch (err: any) {
        return `Error: ${err.message}`;
      }
    },
  });

  api.registerTool({
    name: "x1pays_pay",
    description: "Pay for and access an x402-protected resource on X1. Handles the full flow: probe, sign, verify, settle, and return the resource data.",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "The x402-protected URL to access" },
        asset: { type: "string", enum: ["USDX", "WXNT"], description: "Token to pay with (default USDX)" },
      },
      required: ["url"],
    },
    handler: async ({ url, asset }: { url: string; asset?: string }) => {
      try {
        const result = await wallet.payForResource(url, {
          preferredAsset: (asset as any) || undefined,
        });
        if (!result.txHash) return typeof result.data === "string" ? result.data : JSON.stringify(result.data);
        const stats = wallet.stats;
        return [
          `Payment OK | TX: ${result.txHash}`,
          `Amount: ${result.amount} | Session: ${stats.totalSpent / 1e6} USDX`,
          "---",
          typeof result.data === "string" ? result.data : JSON.stringify(result.data),
        ].join("\n");
      } catch (err: any) {
        return `Error: ${err.message}`;
      }
    },
  });

  api.registerTool({
    name: "x1pays_probe",
    description: "Check if a URL requires x402 payment and show pricing without paying",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL to probe" },
      },
      required: ["url"],
    },
    handler: async ({ url }: { url: string }) => {
      const req = await wallet.probeResource(url);
      if (!req) return `URL returned OK — no payment required.`;

      const summary = (req.accepts || []).map((a) => {
        const asset = Object.entries(ASSETS).find(([, v]) => v.mint === a.asset);
        const sym = asset ? asset[0] : a.asset;
        const dec = asset ? asset[1].decimals : 6;
        return `${sym}: ${Number(a.maxAmountRequired || 0) / 10 ** dec} tokens`;
      });

      return [`x402 Payment Required: ${url}`, ...summary, "", JSON.stringify(req, null, 2)].join("\n");
    },
  });

  api.registerTool({
    name: "x1pays_assets",
    description: "List all supported payment assets on X1",
    parameters: {},
    handler: async () => {
      const list = Object.entries(ASSETS).map(([sym, info]) => ({
        symbol: sym,
        name: info.name,
        mint: info.mint,
        decimals: info.decimals,
        type: info.type,
      }));
      return JSON.stringify(list, null, 2);
    },
  });
}
