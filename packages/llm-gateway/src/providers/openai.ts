import type { ChatMessage, CompletionResponse } from '../types.js';
import { v4 as uuid } from 'uuid';

export async function complete(
  model: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
  apiKey?: string,
): Promise<CompletionResponse> {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    id: string;
    choices: { index: number; message: { role: string; content: string }; finish_reason: string }[];
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };

  return {
    id: data.id || `chatcmpl-${uuid()}`,
    model,
    choices: data.choices.map((c) => ({
      index: c.index,
      message: { role: 'assistant' as const, content: c.message.content },
      finish_reason: c.finish_reason,
    })),
    usage: data.usage,
  };
}
