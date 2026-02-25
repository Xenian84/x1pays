import type { UsageRecord, UserSession } from './types.js';

const FREE_DAILY_LIMIT = 15;

const sessions = new Map<string, UserSession>();
const usageLog: UsageRecord[] = [];

export function getOrCreateSession(userId: string): UserSession {
  let session = sessions.get(userId);
  if (!session) {
    session = {
      id: userId,
      tier: 'free',
      dailyMessages: 0,
      dailyResetAt: nextMidnight(),
      totalTokens: 0,
      creditBalance: 0,
    };
    sessions.set(userId, session);
  }

  if (Date.now() > session.dailyResetAt) {
    session.dailyMessages = 0;
    session.dailyResetAt = nextMidnight();
  }

  return session;
}

export function canSendMessage(session: UserSession): { allowed: boolean; reason?: string } {
  if (session.tier === 'byok') return { allowed: true };

  if (session.tier === 'credits') {
    if (session.creditBalance <= 0) {
      return { allowed: false, reason: 'Credit balance exhausted. Add credits or set a BYOK key.' };
    }
    return { allowed: true };
  }

  if (session.dailyMessages >= FREE_DAILY_LIMIT) {
    return {
      allowed: false,
      reason: `Free tier limit reached (${FREE_DAILY_LIMIT}/day). Add an API key or purchase credits.`,
    };
  }

  return { allowed: true };
}

export function recordUsage(
  userId: string,
  model: string,
  promptTokens: number,
  completionTokens: number,
  inputPricePer1M: number,
  outputPricePer1M: number,
): void {
  const session = getOrCreateSession(userId);

  const costMicrocents = Math.ceil(
    (promptTokens * inputPricePer1M + completionTokens * outputPricePer1M) / 1_000_000 * 100_000,
  );

  session.dailyMessages++;
  session.totalTokens += promptTokens + completionTokens;

  if (session.tier === 'credits') {
    session.creditBalance = Math.max(0, session.creditBalance - costMicrocents);
  }

  usageLog.push({
    userId,
    model,
    promptTokens,
    completionTokens,
    costMicrocents,
    timestamp: Date.now(),
  });
}

export function setBYOK(userId: string, provider: string, apiKey: string): void {
  const session = getOrCreateSession(userId);
  session.tier = 'byok';
  session.byokProvider = provider;
  session.byokKey = apiKey;
}

export function addCredits(userId: string, microcents: number): void {
  const session = getOrCreateSession(userId);
  session.creditBalance += microcents;
  if (session.tier === 'free') session.tier = 'credits';
}

export function getUsageStats(userId: string) {
  const session = getOrCreateSession(userId);
  const userRecords = usageLog.filter((r) => r.userId === userId);
  const last24h = userRecords.filter((r) => r.timestamp > Date.now() - 86_400_000);

  return {
    tier: session.tier,
    dailyMessages: session.dailyMessages,
    dailyLimit: session.tier === 'free' ? FREE_DAILY_LIMIT : null,
    totalTokens: session.totalTokens,
    creditBalance: session.tier === 'credits' ? session.creditBalance : null,
    last24h: {
      requests: last24h.length,
      tokens: last24h.reduce((sum, r) => sum + r.promptTokens + r.completionTokens, 0),
      cost: last24h.reduce((sum, r) => sum + r.costMicrocents, 0),
    },
  };
}

function nextMidnight(): number {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.getTime();
}
