import type { UserSession, ChatResponse, ToolCallResult } from '../types.js';

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are an AI assistant powered by X1Pays on the X1 blockchain.
You can help users with:
- Checking wallet balances (XNT, USDC.x, wXNT)
- Sending tokens to other wallets
- Swapping tokens on xDEX
- Paying for x402-protected API resources
- Managing spending policies
- Viewing transaction history and portfolio

When users ask to perform blockchain operations, use the available tools.
Always confirm amounts before executing transactions.
Be concise and helpful.`;

const conversationHistory = new Map<string, LLMMessage[]>();
const MAX_HISTORY = 20;

export async function processMessage(
  session: UserSession,
  message: string,
  gatewayUrl: string,
): Promise<ChatResponse> {
  const history = getHistory(session.id);

  history.push({ role: 'user', content: message });
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  const messages: LLMMessage[] = [
    { role: 'system', content: buildSystemPrompt(session) },
    ...history,
  ];

  const toolCalls: ToolCallResult[] = [];
  const parsed = parseDirectCommand(message);

  if (parsed) {
    const result = await executeToolCall(parsed.tool, parsed.input, session);
    toolCalls.push(result);

    const toolContext = `Tool result for ${parsed.tool}: ${JSON.stringify(result.output)}`;
    messages.push({ role: 'assistant', content: toolContext });
  }

  const llmResponse = await callGateway(gatewayUrl, session, messages);

  history.push({ role: 'assistant', content: llmResponse.reply });

  session.messageCount++;

  return {
    sessionId: session.id,
    reply: llmResponse.reply,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    usage: llmResponse.usage,
  };
}

function buildSystemPrompt(session: UserSession): string {
  return `${SYSTEM_PROMPT}

Current session:
- Agent wallet: ${session.agentAddress}
- Network: ${session.network}
- Allowed assets: ${session.policies.allowedAssets.join(', ')}
- Max per tx: ${session.policies.maxPerTransaction.toString()} atomic units
- Session budget: ${session.policies.sessionBudget.toString()} atomic units`;
}

function parseDirectCommand(message: string): { tool: string; input: Record<string, unknown> } | null {
  const trimmed = message.trim();
  if (!trimmed.startsWith('/')) return null;

  const parts = trimmed.slice(1).split(/\s+/);
  const cmd = parts[0]?.toLowerCase();

  switch (cmd) {
    case 'balance':
      return { tool: 'x1pays_balance', input: {} };
    case 'portfolio':
      return { tool: 'x1pays_portfolio', input: {} };
    case 'swap':
      if (parts.length >= 4) {
        return {
          tool: 'x1pays_swap',
          input: { amount: parts[1], input_token: parts[2], output_token: parts[3] },
        };
      }
      return null;
    case 'send':
      if (parts.length >= 4) {
        return {
          tool: 'x1pays_send',
          input: { to: parts[1], amount: parts[2], asset: parts[3] },
        };
      }
      return null;
    case 'price':
      if (parts.length >= 2) {
        return {
          tool: 'x1pays_price',
          input: { token_a: parts[1], token_b: parts[2] || 'USDX' },
        };
      }
      return null;
    default:
      return null;
  }
}

async function executeToolCall(
  tool: string,
  input: Record<string, unknown>,
  _session: UserSession,
): Promise<ToolCallResult> {
  // Tool execution will be wired up when OpenClaw runtime is integrated
  return {
    tool,
    input,
    output: { status: 'pending', message: `Tool ${tool} will be executed via OpenClaw runtime` },
  };
}

async function callGateway(
  gatewayUrl: string,
  session: UserSession,
  messages: LLMMessage[],
): Promise<{ reply: string; usage?: { promptTokens: number; completionTokens: number } }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Session-Id': session.id,
    };

    const response = await fetch(`${gatewayUrl}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gateway error ${response.status}: ${err}`);
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    return {
      reply: data.choices[0]?.message?.content ?? 'No response from LLM',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
      } : undefined,
    };
  } catch (err) {
    console.error('[Agent LLM] Gateway call failed:', (err as Error).message);
    return { reply: 'I encountered an error connecting to the LLM service. Please try again.' };
  }
}

function getHistory(sessionId: string): LLMMessage[] {
  let h = conversationHistory.get(sessionId);
  if (!h) {
    h = [];
    conversationHistory.set(sessionId, h);
  }
  return h;
}

export function clearHistory(sessionId: string): void {
  conversationHistory.delete(sessionId);
}
