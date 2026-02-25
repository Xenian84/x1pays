import { WalletManager } from "@x1pay/sdk";
import { XDex } from "@x1pay/dex";
import { registerPaymentTools } from "./tools/payments.js";
import { registerTradingTools } from "./tools/trading.js";
import { registerPortfolioTools } from "./tools/portfolio.js";
import { registerCommands } from "./commands.js";
import { createPriceMonitorService } from "./services/price-monitor.js";
import { createPaymentListenerService } from "./services/payment-listener.js";
import type { Network } from "@x1pay/sdk";

interface PluginConfig {
  privateKey: string;
  rpcUrl?: string;
  network?: Network;
  facilitatorUrl?: string;
  maxPerTransaction?: number;
  sessionBudget?: number;
  dailyBudget?: number;
  priceAlerts?: boolean;
}

interface PluginApi {
  config: { plugins?: { entries?: { x1pays?: { config?: PluginConfig } } } };
  logger: { info: (...args: any[]) => void; error: (...args: any[]) => void };
  registerTool: (tool: {
    name: string;
    description: string;
    parameters: Record<string, any>;
    handler: (params: any) => Promise<string>;
  }) => void;
  registerCommand: (cmd: {
    name: string;
    description: string;
    acceptsArgs?: boolean;
    handler: (ctx: any) => Promise<{ text: string }>;
  }) => void;
  registerService: (svc: {
    id: string;
    start: () => void;
    stop: () => void;
  }) => void;
}

export const id = "x1pays";
export const name = "X1Pays";

export function register(api: PluginApi) {
  const cfg = api.config.plugins?.entries?.x1pays?.config;
  if (!cfg?.privateKey) {
    api.logger.error("X1Pays plugin: privateKey is required in config");
    return;
  }

  const network: Network = cfg.network || "x1-mainnet";

  const wallet = new WalletManager(cfg.privateKey, {
    rpcUrl: cfg.rpcUrl,
    network,
    facilitatorUrl: cfg.facilitatorUrl,
  });

  if (cfg.maxPerTransaction || cfg.sessionBudget || cfg.dailyBudget) {
    wallet.setPolicy({
      maxPerTransaction: cfg.maxPerTransaction ? BigInt(cfg.maxPerTransaction) : undefined,
      sessionBudget: cfg.sessionBudget ? BigInt(cfg.sessionBudget) : undefined,
      dailyBudget: cfg.dailyBudget ? BigInt(cfg.dailyBudget) : undefined,
    });
  }

  const dex = XDex.create(network, cfg.rpcUrl);

  api.logger.info(`X1Pays plugin loaded. Wallet: ${wallet.address} | Network: ${network}`);

  registerPaymentTools(api, wallet);
  registerTradingTools(api, wallet, dex);
  registerPortfolioTools(api, wallet, dex);
  registerCommands(api, wallet, dex);

  const priceMonitor = createPriceMonitorService(api, dex, cfg.priceAlerts ?? false);
  api.registerService(priceMonitor);

  const paymentListener = createPaymentListenerService(api, wallet);
  api.registerService(paymentListener);
}

export default { id, name, register };
