export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface CompletionResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ProviderConfig {
  name: string;
  apiKey: string;
  models: ModelInfo[];
}

export interface ModelInfo {
  id: string;
  provider: string;
  displayName: string;
  inputPrice: number;  // per 1M tokens
  outputPrice: number; // per 1M tokens
  maxTokens: number;
  free?: boolean;
}

export interface UsageRecord {
  userId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  costMicrocents: number;
  timestamp: number;
}

export interface UserSession {
  id: string;
  tier: 'free' | 'byok' | 'credits';
  byokProvider?: string;
  byokKey?: string;
  dailyMessages: number;
  dailyResetAt: number;
  totalTokens: number;
  creditBalance: number; // microcents
}
