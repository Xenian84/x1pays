/**
 * Network constants for X1 blockchain
 */

export const NETWORKS = {
  X1_MAINNET: 'x1-mainnet',
  X1_DEVNET: 'x1-devnet',
  X1_TESTNET: 'x1-testnet'
} as const;

export type Network = typeof NETWORKS[keyof typeof NETWORKS];

/**
 * Payment scheme constant
 */
export const PAYMENT_SCHEME = 'x402' as const;

/**
 * x402 protocol version
 */
export const X402_VERSION = 1;

/**
 * Default facilitator URLs
 */
export const FACILITATOR_URLS = {
  MAINNET: 'https://facilitator.x1pays.network',
  DEVNET: 'https://facilitator-devnet.x1pays.network',
  TESTNET: 'https://facilitator-testnet.x1pays.network'
} as const;

/**
 * Maximum payment amount (safety limit)
 * 1 billion atomic units = 1,000 wXNT
 */
export const MAX_PAYMENT_AMOUNT = 1_000_000_000;

/**
 * HTTP headers used in x402 protocol
 */
export const X402_HEADERS = {
  PAYMENT_REQUIRED: 'X-Payment-Required',
  PAYMENT: 'X-Payment',
  PAYMENT_RESPONSE: 'X-Payment-Response'
} as const;

/**
 * Check if a network string is valid
 */
export function isValidNetwork(network: string): network is Network {
  return Object.values(NETWORKS).includes(network as Network);
}

/**
 * Assert that a network is valid, throw error if not
 */
export function assertValidNetwork(network: string): asserts network is Network {
  if (!isValidNetwork(network)) {
    throw new Error(
      `Invalid network: ${network}. Must be one of: ${Object.values(NETWORKS).join(', ')}`
    );
  }
}
