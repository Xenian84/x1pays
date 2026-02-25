/**
 * Facilitator Registry Logic
 * Handles facilitator discovery, selection, and health checks
 */

import axios from 'axios'
import type { Facilitator, FacilitatorSelectionCriteria, FacilitatorHealth } from './types/facilitator.js'

// Re-export types for external use
export type { Facilitator, FacilitatorSelectionCriteria, FacilitatorHealth } from './types/facilitator.js'

const DEFAULT_REGISTRY_URL = process.env.FACILITATOR_REGISTRY_URL || 'http://localhost:3001'

export interface FacilitatorRegistry {
  getFacilitators(network: string): Promise<Facilitator[]>
  getFacilitator(id: string): Promise<Facilitator | null>
  selectBestFacilitator(
    facilitators: Facilitator[],
    criteria?: FacilitatorSelectionCriteria
  ): Facilitator | null
  healthCheck(facilitator: Facilitator): Promise<FacilitatorHealth>
}

/**
 * Get facilitators from registry API
 */
export async function getFacilitatorsFromRegistry(
  registryUrl: string = DEFAULT_REGISTRY_URL,
  network: string = 'x1-testnet'
): Promise<Facilitator[]> {
  try {
    const response = await axios.get<{ facilitators: Facilitator[] }>(
      `${registryUrl}/facilitators?network=${network}`,
      { timeout: 5000 }
    )
    return response.data.facilitators || []
  } catch (error: any) {
    console.error('Failed to fetch facilitators from registry:', error.message)
    // Return empty array on error - fallback to default facilitator
    return []
  }
}

/**
 * Get a specific facilitator by ID
 */
export async function getFacilitatorById(
  id: string,
  registryUrl: string = DEFAULT_REGISTRY_URL
): Promise<Facilitator | null> {
  try {
    const response = await axios.get<Facilitator>(
      `${registryUrl}/facilitators/${id}`,
      { timeout: 5000 }
    )
    return response.data
  } catch (error: any) {
    console.error(`Failed to fetch facilitator ${id}:`, error.message)
    return null
  }
}

/**
 * Check facilitator health
 */
export async function checkFacilitatorHealth(
  facilitator: Facilitator
): Promise<FacilitatorHealth> {
  try {
    // Try to ping the facilitator's health endpoint
    const healthResponse = await fetch(`${facilitator.url}/health`, {
      signal: AbortSignal.timeout(5000)
    })
    
    const isHealthy = healthResponse.ok
    
    return {
      id: facilitator.id,
      name: facilitator.name,
      url: facilitator.url,
      healthy: isHealthy,
      status: isHealthy ? 'online' : 'offline',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      id: facilitator.id,
      name: facilitator.name,
      url: facilitator.url,
      healthy: false,
      status: 'offline',
      timestamp: new Date().toISOString(),
      error: error.message
    }
  }
}

/**
 * Select the best facilitator based on criteria
 */
export function selectBestFacilitator(
  facilitators: Facilitator[],
  criteria?: FacilitatorSelectionCriteria
): Facilitator | null {
  if (facilitators.length === 0) {
    return null
  }

  // Filter by network and status
  let filtered = facilitators.filter(f => 
    f.network === criteria?.network && 
    f.status === 'active'
  )

  if (filtered.length === 0) {
    return null
  }

  // Apply additional filters
  if (criteria?.minUptime !== undefined) {
    filtered = filtered.filter(f => 
      f.stats?.uptime && f.stats.uptime >= criteria.minUptime!
    )
  }

  if (criteria?.minSuccessRate !== undefined) {
    filtered = filtered.filter(f => 
      f.stats?.successRate && f.stats.successRate >= criteria.minSuccessRate!
    )
  }

  if (criteria?.maxFee !== undefined) {
    filtered = filtered.filter(f => f.fee <= criteria.maxFee!)
  }

  // If preferred IDs specified, prioritize them
  if (criteria?.preferredIds && criteria.preferredIds.length > 0) {
    const preferred = filtered.find(f => 
      criteria.preferredIds!.includes(f.id)
    )
    if (preferred) {
      return preferred
    }
  }

  // Sort by:
  // 1. Fee (ascending - lowest fee first)
  // 2. Success rate (descending - highest first)
  // 3. Uptime (descending - highest first)
  filtered.sort((a, b) => {
    // First by fee
    if (a.fee !== b.fee) {
      return a.fee - b.fee
    }
    
    // Then by success rate
    if (a.stats?.successRate && b.stats?.successRate) {
      if (a.stats.successRate !== b.stats.successRate) {
        return b.stats.successRate - a.stats.successRate
      }
    }
    
    // Finally by uptime
    if (a.stats?.uptime && b.stats?.uptime) {
      return b.stats.uptime - a.stats.uptime
    }
    
    return 0
  })

  return filtered[0] || null
}

/**
 * Default facilitator registry implementation
 */
export const facilitatorRegistry: FacilitatorRegistry = {
  async getFacilitators(network: string): Promise<Facilitator[]> {
    return getFacilitatorsFromRegistry(DEFAULT_REGISTRY_URL, network)
  },

  async getFacilitator(id: string): Promise<Facilitator | null> {
    return getFacilitatorById(id, DEFAULT_REGISTRY_URL)
  },

  selectBestFacilitator(
    facilitators: Facilitator[],
    criteria?: FacilitatorSelectionCriteria
  ): Facilitator | null {
    return selectBestFacilitator(facilitators, criteria)
  },

  async healthCheck(facilitator: Facilitator): Promise<FacilitatorHealth> {
    return checkFacilitatorHealth(facilitator)
  }
}

