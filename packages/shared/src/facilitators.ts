/**
 * Centralized Facilitator Configuration
 * These addresses match the wallets generated in packages/facilitator/WALLETS.md
 */

export interface FacilitatorConfig {
  id: string
  name: string
  address: string
  fee: number // basis points
  port: number
  network: 'x1-testnet' | 'x1-mainnet'
}

/**
 * TESTNET FACILITATORS
 * These addresses are from WALLETS.md - generated on 2025-11-04
 */
export const TESTNET_FACILITATORS: FacilitatorConfig[] = [
  {
    id: 'alpha',
    name: 'Alpha Facilitator',
    address: 'FYb71cjBkjjn6pE8mpY4rJmfTnyZhaMATpZY4pPZQ8QT',
    fee: 10, // 0.1%
    port: 4000,
    network: 'x1-testnet'
  },
  {
    id: 'beta',
    name: 'Beta Facilitator',
    address: '4hxEHJ76H68Yohee9fxgcynZeKtWbFRF5WcxCbHA2kWB',
    fee: 15, // 0.15%
    port: 4001,
    network: 'x1-testnet'
  },
  {
    id: 'gamma',
    name: 'Gamma Facilitator',
    address: 'Ed3E5SEXzcdvUYSJ1nJKt2mPJ45sqTAmF1Ub6szZtyey',
    fee: 20, // 0.2%
    port: 4002,
    network: 'x1-testnet'
  }
]

/**
 * MAINNET FACILITATORS
 * To be configured when mainnet launches
 */
export const MAINNET_FACILITATORS: FacilitatorConfig[] = []

/**
 * Get facilitators for a specific network
 */
export function getFacilitators(network: 'x1-testnet' | 'x1-mainnet'): FacilitatorConfig[] {
  return network === 'x1-testnet' ? TESTNET_FACILITATORS : MAINNET_FACILITATORS
}

/**
 * Get a specific facilitator by ID
 */
export function getFacilitator(id: string, network: 'x1-testnet' | 'x1-mainnet'): FacilitatorConfig | undefined {
  return getFacilitators(network).find(f => f.id === id)
}

/**
 * Get facilitator URL
 */
export function getFacilitatorUrl(id: string, hostname: string = 'localhost'): string {
  const facilitator = TESTNET_FACILITATORS.find(f => f.id === id) || MAINNET_FACILITATORS.find(f => f.id === id)
  if (!facilitator) return `http://localhost:4000`
  return `http://${hostname}:${facilitator.port}`
}

