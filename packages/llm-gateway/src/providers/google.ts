import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, CompletionResponse } from '../types.js';
import { v4 as uuid } from 'uuid';

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) throw new Error('GOOGLE_API_KEY not set');
    client = new GoogleGenerativeAI(key);
  }
  return client;
}

export async function complete(
  model: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
): Promise<CompletionResponse> {
  const genAI = getClient();
  const genModel = genAI.getGenerativeModel({ model });

  const systemMsg = messages.find((m) => m.role === 'system');
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const contents = chatMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const result = await genModel.generateContent({
    contents,
    systemInstruction: systemMsg ? { role: 'user' as const, parts: [{ text: systemMsg.content }] } : undefined,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  });

  const response = result.response;
  const text = response.text();
  const usage = response.usageMetadata;

  return {
    id: `chatcmpl-${uuid()}`,
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: text },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: usage?.promptTokenCount ?? 0,
      completion_tokens: usage?.candidatesTokenCount ?? 0,
      total_tokens: usage?.totalTokenCount ?? 0,
    },
  };
}
