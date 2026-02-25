#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createX1PaysMcp } from "./index.js";

const privateKey = process.env.X1PAYS_PRIVATE_KEY;
if (!privateKey) {
  console.error("Error: X1PAYS_PRIVATE_KEY environment variable is required");
  console.error("Set it to the base58-encoded secret key of the agent wallet");
  process.exit(1);
}

const server = createX1PaysMcp({
  privateKey,
  rpcUrl: process.env.X1PAYS_RPC_URL || "https://rpc.mainnet.x1.xyz",
  network: (process.env.X1PAYS_NETWORK as "x1-mainnet" | "x1-testnet") || "x1-mainnet",
  facilitatorUrl: process.env.X1PAYS_FACILITATOR_URL,
  maxPaymentPerRequest: process.env.X1PAYS_MAX_PER_REQUEST
    ? parseInt(process.env.X1PAYS_MAX_PER_REQUEST, 10)
    : undefined,
  budgetLimit: process.env.X1PAYS_BUDGET_LIMIT
    ? parseInt(process.env.X1PAYS_BUDGET_LIMIT, 10)
    : undefined,
});

const transport = new StdioServerTransport();
await server.connect(transport);
