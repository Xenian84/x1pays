/**
 * Shared Facilitator Types
 * Used across middleware, API, and website packages
 */

export interface Facilitator {
  id: string
  name: string
  url: string
  fee: number // Fee in basis points (e.g., 0 = 0.0%, 50 = 0.5%, 100 = 1.0%)
  status: 'active' | 'inactive' | 'offline'
  network: 'x1-testnet' | 'x1-mainnet'
  address: string // Facilitator wallet address
  bond?: number // Staked amount (future feature - placeholder)
  stats?: FacilitatorStats
}

export interface FacilitatorStats {
  uptime: number // Percentage (0-100)
  successRate: number // Percentage (0-100)
  avgResponseTime: number // Milliseconds
  totalSettlements: number
  lastSettlement?: string // ISO timestamp
  lastHealthCheck?: string // ISO timestamp
}

export interface FacilitatorHealth {
  id: string
  name: string
  url: string
  healthy: boolean
  status: 'online' | 'offline' | 'degraded'
  timestamp: string
  error?: string
}

export interface FacilitatorSelectionCriteria {
  network: 'x1-testnet' | 'x1-mainnet'
  minUptime?: number
  minSuccessRate?: number
  maxFee?: number
  preferredIds?: string[]
}




