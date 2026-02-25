import express from 'express';
import rateLimit from 'express-rate-limit';
import { route, RateLimitError } from './router.js';
import { MODEL_REGISTRY } from './models.js';
import { getOrCreateSession, getUsageStats, setBYOK, addCredits } from './usage.js';
import type { CompletionRequest } from './types.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.set('trust proxy', 1);

const ipLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP' },
});
app.use(ipLimiter);

function extractUserId(req: express.Request): string {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer x1p_')) return auth.slice(7);
  if (auth?.startsWith('Bearer ')) return auth.slice(7).slice(0, 16);
  const sessionId = req.headers['x-session-id'] as string;
  if (sessionId) return sessionId;
  return `anon-${req.ip ?? 'unknown'}`;
}

// Health
app.get('/health', (_req, res) => {
  const providers: string[] = [];
  if (process.env.GOOGLE_API_KEY) providers.push('google');
  if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
  if (process.env.OPENAI_API_KEY) providers.push('openai');

  res.json({
    status: 'ok',
    service: 'x1pays-llm-gateway',
    providers,
    models: MODEL_REGISTRY.length,
    freeModel: MODEL_REGISTRY.find((m) => m.free)?.id,
  });
});

// OpenAI-compatible: POST /v1/chat/completions
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const userId = extractUserId(req);
    const body = req.body as CompletionRequest;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    const result = await route({
      userId,
      model: body.model,
      messages: body.messages,
      maxTokens: body.max_tokens,
      temperature: body.temperature,
    });

    res.json({
      ...result.response,
      x1pays: {
        routedTo: result.routedTo,
        tier: result.tier,
      },
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      res.status(429).json({ error: err.message });
      return;
    }
    console.error('[LLM Gateway] Error:', (err as Error).message);
    res.status(500).json({ error: 'Internal gateway error' });
  }
});

// Anthropic-compatible: POST /v1/messages
app.post('/v1/messages', async (req, res) => {
  try {
    const userId = extractUserId(req);
    const body = req.body as {
      model?: string;
      messages: { role: string; content: string }[];
      max_tokens?: number;
      temperature?: number;
      system?: string;
    };

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    const messages = body.system
      ? [{ role: 'system' as const, content: body.system }, ...body.messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))]
      : body.messages.map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        }));

    const result = await route({
      userId,
      model: body.model,
      messages,
      maxTokens: body.max_tokens,
      temperature: body.temperature,
    });

    // Return Anthropic-format response
    res.json({
      id: result.response.id,
      type: 'message',
      role: 'assistant',
      model: result.model,
      content: [{ type: 'text', text: result.response.choices[0].message.content }],
      stop_reason: result.response.choices[0].finish_reason === 'stop' ? 'end_turn' : result.response.choices[0].finish_reason,
      usage: {
        input_tokens: result.response.usage.prompt_tokens,
        output_tokens: result.response.usage.completion_tokens,
      },
      x1pays: {
        routedTo: result.routedTo,
        tier: result.tier,
      },
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      res.status(429).json({ error: { type: 'rate_limit_error', message: err.message } });
      return;
    }
    console.error('[LLM Gateway] Error:', (err as Error).message);
    res.status(500).json({ error: { type: 'api_error', message: 'Internal gateway error' } });
  }
});

// Models list
app.get('/v1/models', (_req, res) => {
  res.json({
    object: 'list',
    data: MODEL_REGISTRY.map((m) => ({
      id: m.id,
      object: 'model',
      owned_by: m.provider,
      display_name: m.displayName,
      pricing: {
        input_per_1m: m.inputPrice,
        output_per_1m: m.outputPrice,
      },
      free: m.free ?? false,
    })),
  });
});

// Usage stats
app.get('/v1/usage', (req, res) => {
  const userId = extractUserId(req);
  res.json(getUsageStats(userId));
});

// Session info
app.get('/v1/session', (req, res) => {
  const userId = extractUserId(req);
  const session = getOrCreateSession(userId);
  res.json({
    id: session.id,
    tier: session.tier,
    byokProvider: session.byokProvider ?? null,
    dailyMessages: session.dailyMessages,
    creditBalance: session.creditBalance,
  });
});

// Set BYOK key
app.post('/v1/byok', (req, res) => {
  const userId = extractUserId(req);
  const { provider, apiKey } = req.body as { provider: string; apiKey: string };

  if (!provider || !apiKey) {
    res.status(400).json({ error: 'provider and apiKey required' });
    return;
  }

  if (!['anthropic', 'openai', 'google'].includes(provider)) {
    res.status(400).json({ error: 'provider must be anthropic, openai, or google' });
    return;
  }

  setBYOK(userId, provider, apiKey);
  res.json({ status: 'ok', tier: 'byok', provider });
});

// Add credits
app.post('/v1/credits', (req, res) => {
  const userId = extractUserId(req);
  const { amount } = req.body as { amount: number };

  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'positive amount required' });
    return;
  }

  addCredits(userId, amount);
  const session = getOrCreateSession(userId);
  res.json({ status: 'ok', creditBalance: session.creditBalance });
});

const PORT = parseInt(process.env.PORT || '4006', 10);

app.listen(PORT, () => {
  const providers: string[] = [];
  if (process.env.GOOGLE_API_KEY) providers.push('Google');
  if (process.env.ANTHROPIC_API_KEY) providers.push('Anthropic');
  if (process.env.OPENAI_API_KEY) providers.push('OpenAI');

  console.log(`[LLM Gateway] Running on port ${PORT}`);
  console.log(`[LLM Gateway] Providers: ${providers.join(', ') || 'none (BYOK only)'}`);
  console.log(`[LLM Gateway] Free model: ${MODEL_REGISTRY.find((m) => m.free)?.id}`);
  console.log(`[LLM Gateway] Models: ${MODEL_REGISTRY.length}`);
});

export { app };
