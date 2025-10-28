/**
 * Network constants for X1 blockchain
 */

export const NETWORKS = {
  X1_MAINNET: 'x1-mainnet',
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
  MAINNET: 'https://facilitator.x1pays.xyz',
  TESTNET: 'https://facilitator-testnet.x1pays.xyz'
} as const;

/**
 * X1 Explorer URLs by network
 */
export const EXPLORER_URLS = {
  'x1-mainnet': 'https://explorer.x1.xyz',
  'x1-testnet': 'https://explorer.testnet.x1.xyz'
} as const;

/**
 * Get explorer URL for a transaction on a specific network
 */
export function getExplorerUrl(txHash: string, network: Network): string {
  const baseUrl = EXPLORER_URLS[network] || EXPLORER_URLS['x1-mainnet'];
  return `${baseUrl}/tx/${txHash}`;
}

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
