export interface Facilitator {
  id: string
  name: string
  url: string
  fee: number
  status: 'active' | 'inactive' | 'offline'
  network: 'x1-testnet' | 'x1-mainnet'
  address?: string
  stats?: {
    uptime?: number
    successRate?: number
    totalTransactions?: number
    avgSettlementTime?: number
  }
}

export interface FacilitatorSelectionCriteria {
  network?: 'x1-testnet' | 'x1-mainnet'
  minUptime?: number
  minSuccessRate?: number
  maxFee?: number
  preferredIds?: string[]
}

export interface FacilitatorHealth {
  id: string
  name: string
  url: string
  healthy: boolean
  status: 'online' | 'offline'
  timestamp: string
  error?: string
}
