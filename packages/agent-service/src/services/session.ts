import type { UserSession, SpendingPolicies, EncryptedProfile } from '../types.js';
import { generateAgentKeypair, encryptKeypair, decryptKeypair, encryptString, decryptString } from '../crypto/keys.js';

const sessions = new Map<string, UserSession>();

const DEFAULT_POLICIES: SpendingPolicies = {
  maxPerTransaction: 10_000_000n,  // 10 USDC.x
  sessionBudget: 100_000_000n,     // 100 USDC.x
  allowedAssets: ['USDX', 'WXNT', 'XNT'],
};

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function createSession(walletAddress: string, network: string): UserSession {
  const existing = getSessionByWallet(walletAddress);
  if (existing) {
    existing.lastActiveAt = Date.now();
    return existing;
  }

  const agentKeypair = generateAgentKeypair();

  const session: UserSession = {
    id: `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    walletAddress,
    agentKeypair,
    agentAddress: agentKeypair.publicKey.toBase58(),
    network,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    policies: { ...DEFAULT_POLICIES },
    messageCount: 0,
  };

  sessions.set(session.id, session);
  return session;
}

export function restoreSession(
  walletAddress: string,
  profile: EncryptedProfile,
  network: string,
): UserSession {
  const existing = getSessionByWallet(walletAddress);
  if (existing) {
    existing.lastActiveAt = Date.now();
    return existing;
  }

  const agentKeypair = decryptKeypair(profile.agentKeypairEncrypted, walletAddress);

  const session: UserSession = {
    id: `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    walletAddress,
    agentKeypair,
    agentAddress: agentKeypair.publicKey.toBase58(),
    network,
    createdAt: profile.stats.createdAt,
    lastActiveAt: Date.now(),
    policies: {
      maxPerTransaction: BigInt(profile.policies.maxPerTransaction),
      sessionBudget: BigInt(profile.policies.sessionBudget),
      allowedAssets: profile.policies.allowedAssets,
    },
    messageCount: profile.stats.totalMessages,
  };

  if (profile.byokEncrypted) {
    const decrypted = decryptString(profile.byokEncrypted, walletAddress);
    const parsed = JSON.parse(decrypted) as { provider: string; key: string };
    session.byok = { provider: parsed.provider, encryptedKey: profile.byokEncrypted };
  }

  sessions.set(session.id, session);
  return session;
}

export function getSession(sessionId: string): UserSession | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;

  if (Date.now() - session.lastActiveAt > SESSION_TIMEOUT_MS) {
    evictSession(sessionId);
    return undefined;
  }

  session.lastActiveAt = Date.now();
  return session;
}

export function getSessionByWallet(walletAddress: string): UserSession | undefined {
  for (const session of sessions.values()) {
    if (session.walletAddress === walletAddress) {
      if (Date.now() - session.lastActiveAt > SESSION_TIMEOUT_MS) {
        evictSession(session.id);
        return undefined;
      }
      session.lastActiveAt = Date.now();
      return session;
    }
  }
  return undefined;
}

export function exportProfile(session: UserSession): EncryptedProfile {
  return {
    agentKeypairEncrypted: encryptKeypair(session.agentKeypair, session.walletAddress),
    byokEncrypted: session.byok?.encryptedKey,
    policies: {
      maxPerTransaction: session.policies.maxPerTransaction.toString(),
      sessionBudget: session.policies.sessionBudget.toString(),
      allowedAssets: session.policies.allowedAssets,
    },
    stats: {
      totalMessages: session.messageCount,
      totalSpent: '0',
      createdAt: session.createdAt,
    },
  };
}

export function setBYOK(
  sessionId: string,
  provider: string,
  apiKey: string,
): void {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');

  const encrypted = encryptString(
    JSON.stringify({ provider, key: apiKey }),
    session.walletAddress,
  );

  session.byok = { provider, encryptedKey: encrypted };
}

export function evictSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.agentKeypair = null as unknown as UserSession['agentKeypair'];
    sessions.delete(sessionId);
  }
}

export function cleanupExpiredSessions(): number {
  let evicted = 0;
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActiveAt > SESSION_TIMEOUT_MS) {
      evictSession(id);
      evicted++;
    }
  }
  return evicted;
}

export function getActiveSessionCount(): number {
  return sessions.size;
}

export function getAllSessions(): UserSession[] {
  return Array.from(sessions.values());
}
