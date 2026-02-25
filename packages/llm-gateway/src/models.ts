import type { ModelInfo } from './types.js';

export const MODEL_REGISTRY: ModelInfo[] = [
  {
    id: 'gemini-2.5-flash',
    provider: 'google',
    displayName: 'Gemini 2.5 Flash',
    inputPrice: 0.075,
    outputPrice: 0.30,
    maxTokens: 8192,
    free: true,
  },
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    displayName: 'Gemini 2.5 Pro',
    inputPrice: 1.25,
    outputPrice: 5.00,
    maxTokens: 8192,
  },
  {
    id: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    displayName: 'Claude Sonnet 4',
    inputPrice: 3.00,
    outputPrice: 15.00,
    maxTokens: 8192,
  },
  {
    id: 'claude-haiku-3-5',
    provider: 'anthropic',
    displayName: 'Claude 3.5 Haiku',
    inputPrice: 0.80,
    outputPrice: 4.00,
    maxTokens: 8192,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    displayName: 'GPT-4o Mini',
    inputPrice: 0.15,
    outputPrice: 0.60,
    maxTokens: 4096,
  },
  {
    id: 'gpt-4o',
    provider: 'openai',
    displayName: 'GPT-4o',
    inputPrice: 2.50,
    outputPrice: 10.00,
    maxTokens: 4096,
  },
];

export const FREE_MODEL = MODEL_REGISTRY.find((m) => m.free)!;

export function findModel(id: string): ModelInfo | undefined {
  return MODEL_REGISTRY.find(
    (m) => m.id === id || m.displayName.toLowerCase() === id.toLowerCase(),
  );
}

export function getProviderModels(provider: string): ModelInfo[] {
  return MODEL_REGISTRY.filter((m) => m.provider === provider);
}
