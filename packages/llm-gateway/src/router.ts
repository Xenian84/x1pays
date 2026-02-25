import type { ChatMessage, CompletionResponse } from './types.js';
import { findModel, FREE_MODEL } from './models.js';
import { getOrCreateSession, canSendMessage, recordUsage } from './usage.js';
import * as google from './providers/google.js';
import * as anthropic from './providers/anthropic.js';
import * as openai from './providers/openai.js';

export interface RouteOptions {
  userId: string;
  model?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface RouteResult {
  response: CompletionResponse;
  routedTo: string;
  model: string;
  tier: string;
}

export async function route(opts: RouteOptions): Promise<RouteResult> {
  const session = getOrCreateSession(opts.userId);

  const check = canSendMessage(session);
  if (!check.allowed) {
    throw new RateLimitError(check.reason!);
  }

  const maxTokens = opts.maxTokens ?? 2048;
  const temperature = opts.temperature ?? 0.7;

  // BYOK: route directly to user's provider
  if (session.tier === 'byok' && session.byokKey && session.byokProvider) {
    const requestedModel = opts.model || getDefaultModelForProvider(session.byokProvider);
    const modelInfo = findModel(requestedModel);

    const response = await callProvider(
      session.byokProvider,
      requestedModel,
      opts.messages,
      maxTokens,
      temperature,
      session.byokKey,
    );

    recordUsage(
      opts.userId,
      requestedModel,
      response.usage.prompt_tokens,
      response.usage.completion_tokens,
      modelInfo?.inputPrice ?? 0,
      modelInfo?.outputPrice ?? 0,
    );

    return {
      response,
      routedTo: `${session.byokProvider} (BYOK)`,
      model: requestedModel,
      tier: 'byok',
    };
  }

  // Credits or free: use requested model or free model
  const useModel = session.tier === 'credits' && opts.model
    ? findModel(opts.model) ?? FREE_MODEL
    : FREE_MODEL;

  const response = await callProvider(
    useModel.provider,
    useModel.id,
    opts.messages,
    maxTokens,
    temperature,
  );

  recordUsage(
    opts.userId,
    useModel.id,
    response.usage.prompt_tokens,
    response.usage.completion_tokens,
    useModel.inputPrice,
    useModel.outputPrice,
  );

  return {
    response,
    routedTo: `${useModel.provider} (gateway)`,
    model: useModel.id,
    tier: session.tier,
  };
}

async function callProvider(
  provider: string,
  model: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
  apiKey?: string,
): Promise<CompletionResponse> {
  switch (provider) {
    case 'google':
      return google.complete(model, messages, maxTokens, temperature);
    case 'anthropic':
      return anthropic.complete(model, messages, maxTokens, temperature, apiKey);
    case 'openai':
      return openai.complete(model, messages, maxTokens, temperature, apiKey);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function getDefaultModelForProvider(provider: string): string {
  switch (provider) {
    case 'anthropic': return 'claude-sonnet-4-20250514';
    case 'openai': return 'gpt-4o-mini';
    case 'google': return 'gemini-2.5-flash';
    default: return 'gemini-2.5-flash';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}
