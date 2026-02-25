import type { Keypair } from '@solana/web3.js';

export interface UserSession {
  id: string;
  walletAddress: string;
  agentKeypair: Keypair;
  agentAddress: string;
  network: string;
  createdAt: number;
  lastActiveAt: number;
  byok?: BYOKConfig;
  policies: SpendingPolicies;
  messageCount: number;
}

export interface BYOKConfig {
  provider: string;
  encryptedKey: string;
}

export interface SpendingPolicies {
  maxPerTransaction: bigint;
  sessionBudget: bigint;
  allowedAssets: string[];
}

export interface AgentConfig {
  port: number;
  network: string;
  llmGatewayUrl: string;
  sessionTimeoutMs: number;
  maxSessions: number;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  walletAddress?: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  toolCalls?: ToolCallResult[];
  usage?: { promptTokens: number; completionTokens: number };
}

export interface ToolCallResult {
  tool: string;
  input: Record<string, unknown>;
  output: unknown;
}

export interface EncryptedProfile {
  agentKeypairEncrypted: string;
  byokEncrypted?: string;
  policies: {
    maxPerTransaction: string;
    sessionBudget: string;
    allowedAssets: string[];
  };
  stats: {
    totalMessages: number;
    totalSpent: string;
    createdAt: number;
  };
}
