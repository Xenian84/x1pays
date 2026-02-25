/**
 * Security utilities for sanitizing sensitive data in logs and outputs
 */

/**
 * Patterns that indicate sensitive data
 */
const SENSITIVE_PATTERNS = {
  privateKey: /private[_-]?key/i,
  secret: /secret/i,
  password: /password/i,
  token: /token/i,
  apiKey: /api[_-]?key/i,
  mnemonic: /mnemonic|seed[_-]?phrase/i,
  signature: /signature/i,
};

/**
 * Fields to always redact
 */
const SENSITIVE_FIELDS = [
  'privateKey',
  'private_key',
  'secretKey',
  'secret_key',
  'password',
  'mnemonic',
  'seedPhrase',
  'seed_phrase',
  'apiKey',
  'api_key',
  'authorization',
  'x-api-key',
];

/**
 * Truncate a string to show only first N and last N characters
 */
export function truncateString(str: string, showChars: number = 8): string {
  if (!str || str.length <= showChars * 2) return '***';
  return `${str.slice(0, showChars)}...${str.slice(-showChars)}`;
}

/**
 * Sanitize a single value for logging
 */
export function sanitizeValue(value: any, key?: string): any {
  if (value === null || value === undefined) return value;

  // Check if key name suggests sensitive data
  if (key) {
    const lowerKey = key.toLowerCase();
    
    // Always redact these fields
    if (SENSITIVE_FIELDS.includes(key) || SENSITIVE_FIELDS.includes(lowerKey)) {
      return '[REDACTED]';
    }
    
    // Check patterns
    for (const [type, pattern] of Object.entries(SENSITIVE_PATTERNS)) {
      if (pattern.test(key)) {
        // For signatures and public keys, truncate instead of full redaction
        if (type === 'signature' && typeof value === 'string') {
          return truncateString(value, 8);
        }
        return '[REDACTED]';
      }
    }
  }

  // If it's a long string that looks like a key/signature, truncate it
  if (typeof value === 'string' && value.length > 64) {
    // Base58/Base64 pattern (likely a key or signature)
    if (/^[A-Za-z0-9+/=]{64,}$/.test(value)) {
      return truncateString(value, 8);
    }
  }

  return value;
}

/**
 * Recursively sanitize an object for logging
 */
export function sanitizeForLog(obj: any, depth: number = 0, maxDepth: number = 10): any {
  // Prevent infinite recursion
  if (depth > maxDepth) return '[Max Depth Reached]';
  
  if (obj === null || obj === undefined) return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForLog(item, depth + 1, maxDepth));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeForLog(value, depth + 1, maxDepth);
      } else {
        sanitized[key] = sanitizeValue(value, key);
      }
    }
    return sanitized;
  }

  // Primitive values
  return obj;
}

/**
 * Sanitize blockchain transaction for logging
 * Keeps transaction hash and basic info, redacts signatures
 */
export function sanitizeTransaction(tx: any): any {
  if (!tx) return tx;

  return {
    signature: tx.signature ? truncateString(tx.signature, 16) : undefined,
    from: tx.from ? truncateString(tx.from, 8) : undefined,
    to: tx.to ? truncateString(tx.to, 8) : undefined,
    amount: tx.amount,
    memo: tx.memo,
    blockTime: tx.blockTime,
    slot: tx.slot,
    // Redact full transaction data
    transaction: '[REDACTED]',
  };
}

/**
 * Sanitize payment permit for logging
 */
export function sanitizePayment(payment: any): any {
  if (!payment) return payment;

  return {
    buyer: payment.buyer ? truncateString(payment.buyer, 8) : undefined,
    merchant: payment.merchant ? truncateString(payment.merchant, 8) : undefined,
    amount: payment.amount,
    nonce: payment.nonce,
    network: payment.network,
    signature: '[REDACTED]', // Never log full signatures
    timestamp: payment.timestamp,
  };
}

/**
 * Create a safe logger wrapper that auto-sanitizes
 */
export function createSafeLogger(logger: any) {
  return {
    info: (obj: any, msg?: string) => {
      logger.info(sanitizeForLog(obj), msg);
    },
    warn: (obj: any, msg?: string) => {
      logger.warn(sanitizeForLog(obj), msg);
    },
    error: (obj: any, msg?: string) => {
      logger.error(sanitizeForLog(obj), msg);
    },
    debug: (obj: any, msg?: string) => {
      logger.debug(sanitizeForLog(obj), msg);
    },
  };
}

/**
 * Sanitize error for logging (removes stack traces in production)
 */
export function sanitizeError(error: any, includeStack: boolean = false): any {
  if (!error) return error;

  const sanitized: any = {
    message: error.message || 'Unknown error',
    name: error.name,
    code: error.code,
  };

  // Only include stack traces in development
  if (includeStack && error.stack) {
    sanitized.stack = error.stack;
  }

  return sanitized;
}

