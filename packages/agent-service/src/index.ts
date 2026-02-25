import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import {
  createSession,
  getSession,
  getSessionByWallet,
  exportProfile,
  evictSession,
  setBYOK,
  cleanupExpiredSessions,
  getActiveSessionCount,
} from './services/session.js';
import { processMessage, clearHistory } from './services/llm.js';
import type { ChatRequest } from './types.js';

const app = express();
app.use(express.json());
app.set('trust proxy', 1);

const NETWORK = process.env.NETWORK || 'x1-mainnet';
const LLM_GATEWAY_URL = process.env.LLM_GATEWAY_URL || 'http://localhost:4006';
const PORT = parseInt(process.env.PORT || '4007', 10);

// Health
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'x1pays-agent-service',
    network: NETWORK,
    activeSessions: getActiveSessionCount(),
    llmGateway: LLM_GATEWAY_URL,
  });
});

// Create or restore session
app.post('/agent/session', (req, res) => {
  const { walletAddress } = req.body as { walletAddress: string };

  if (!walletAddress) {
    res.status(400).json({ error: 'walletAddress required' });
    return;
  }

  const existing = getSessionByWallet(walletAddress);
  if (existing) {
    res.json({
      sessionId: existing.id,
      agentAddress: existing.agentAddress,
      network: existing.network,
      restored: true,
    });
    return;
  }

  const session = createSession(walletAddress, NETWORK);

  res.json({
    sessionId: session.id,
    agentAddress: session.agentAddress,
    network: session.network,
    restored: false,
    message: `Agent wallet created: ${session.agentAddress}. Fund it to enable sends and swaps.`,
  });
});

// Chat via REST
app.post('/agent/chat', async (req, res) => {
  const { sessionId, message } = req.body as ChatRequest;

  if (!sessionId || !message) {
    res.status(400).json({ error: 'sessionId and message required' });
    return;
  }

  const session = getSession(sessionId);
  if (!session) {
    res.status(404).json({ error: 'Session not found or expired' });
    return;
  }

  try {
    const response = await processMessage(session, message, LLM_GATEWAY_URL);
    res.json(response);
  } catch (err) {
    console.error('[Agent] Chat error:', (err as Error).message);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get session info
app.get('/agent/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found or expired' });
    return;
  }

  res.json({
    sessionId: session.id,
    walletAddress: session.walletAddress,
    agentAddress: session.agentAddress,
    network: session.network,
    messageCount: session.messageCount,
    policies: {
      maxPerTransaction: session.policies.maxPerTransaction.toString(),
      sessionBudget: session.policies.sessionBudget.toString(),
      allowedAssets: session.policies.allowedAssets,
    },
    hasBYOK: !!session.byok,
    createdAt: session.createdAt,
  });
});

// Export profile (for AegisMemory persistence)
app.post('/agent/session/:id/export', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found or expired' });
    return;
  }

  const profile = exportProfile(session);
  res.json(profile);
});

// Set BYOK key
app.post('/agent/session/:id/byok', (req, res) => {
  const { provider, apiKey } = req.body as { provider: string; apiKey: string };

  if (!provider || !apiKey) {
    res.status(400).json({ error: 'provider and apiKey required' });
    return;
  }

  try {
    setBYOK(req.params.id, provider, apiKey);
    res.json({ status: 'ok', provider });
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
});

// End session
app.delete('/agent/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  const profile = exportProfile(session);
  clearHistory(session.id);
  evictSession(session.id);

  res.json({ status: 'ok', profile });
});

// WebSocket server for real-time chat
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/agent/ws' });

wss.on('connection', (ws: WebSocket) => {
  let sessionId: string | null = null;

  ws.on('message', async (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString()) as {
        type: string;
        sessionId?: string;
        walletAddress?: string;
        message?: string;
      };

      switch (msg.type) {
        case 'auth': {
          if (!msg.walletAddress) {
            ws.send(JSON.stringify({ type: 'error', error: 'walletAddress required' }));
            return;
          }

          const existing = getSessionByWallet(msg.walletAddress);
          const session = existing || createSession(msg.walletAddress, NETWORK);
          sessionId = session.id;

          ws.send(JSON.stringify({
            type: 'session',
            sessionId: session.id,
            agentAddress: session.agentAddress,
            network: session.network,
            restored: !!existing,
          }));
          break;
        }

        case 'chat': {
          if (!sessionId) {
            ws.send(JSON.stringify({ type: 'error', error: 'Not authenticated. Send auth first.' }));
            return;
          }

          const session = getSession(sessionId);
          if (!session) {
            ws.send(JSON.stringify({ type: 'error', error: 'Session expired' }));
            return;
          }

          const response = await processMessage(session, msg.message || '', LLM_GATEWAY_URL);
          ws.send(JSON.stringify({ type: 'response', ...response }));
          break;
        }

        default:
          ws.send(JSON.stringify({ type: 'error', error: `Unknown message type: ${msg.type}` }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', error: (err as Error).message }));
    }
  });

  ws.on('close', () => {
    sessionId = null;
  });
});

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const evicted = cleanupExpiredSessions();
  if (evicted > 0) {
    console.log(`[Agent] Cleaned up ${evicted} expired sessions`);
  }
}, 5 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`[Agent Service] Running on port ${PORT}`);
  console.log(`[Agent Service] Network: ${NETWORK}`);
  console.log(`[Agent Service] LLM Gateway: ${LLM_GATEWAY_URL}`);
  console.log(`[Agent Service] WebSocket: ws://localhost:${PORT}/agent/ws`);
});

export { app, server };
