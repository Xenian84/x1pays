/**
 * Facilitator Discovery for X1Pays Client
 * 
 * Enables clients to discover and select facilitators dynamically from the X1Pays API.
 * Implements smart selection based on fees, health, and performance metrics.
 */

export interface FacilitatorInfo {
  id: string;
  name: string;
  url: string;
  fee: number; // Basis points (e.g., 10 = 0.1%)
  status: 'active' | 'inactive';
  network: 'x1-testnet' | 'x1-mainnet';
  address?: string;
  stats?: {
    uptime?: number;
    successRate?: number;
    avgResponseTime?: number;
    totalSettlements?: number;
  };
}

export interface FacilitatorSelectionOptions {
  network?: 'x1-testnet' | 'x1-mainnet';
  maxFee?: number; // Maximum fee in basis points
  minSuccessRate?: number; // Minimum success rate (0-100)
  minUptime?: number; // Minimum uptime in seconds
  preferredIds?: string[]; // Preferred facilitator IDs
  sortBy?: 'fee' | 'successRate' | 'uptime' | 'random';
}

/**
 * Fetch all facilitators from the X1Pays API
 */
export async function fetchFacilitators(
  apiUrl: string = 'http://localhost:3001',
  network: 'x1-testnet' | 'x1-mainnet' = 'x1-testnet'
): Promise<FacilitatorInfo[]> {
  try {
    const response = await fetch(`${apiUrl}/facilitators?network=${network}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000) // 5s timeout
    });

    if (!response.ok) {
      console.error(`Failed to fetch facilitators: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.facilitators || [];
  } catch (error: any) {
    console.error('Error fetching facilitators:', error.message);
    return [];
  }
}

/**
 * Select the best facilitator based on criteria
 */
export function selectBestFacilitator(
  facilitators: FacilitatorInfo[],
  options?: FacilitatorSelectionOptions
): FacilitatorInfo | null {
  if (facilitators.length === 0) {
    return null;
  }

  // Filter by status and network
  let filtered = facilitators.filter(f => f.status === 'active');

  if (options?.network) {
    filtered = filtered.filter(f => f.network === options.network);
  }

  if (filtered.length === 0) {
    return null;
  }

  // Apply filters
  if (options?.maxFee !== undefined) {
    filtered = filtered.filter(f => f.fee <= options.maxFee!);
  }

  if (options?.minSuccessRate !== undefined) {
    filtered = filtered.filter(f => 
      f.stats?.successRate !== undefined && f.stats.successRate >= options.minSuccessRate!
    );
  }

  if (options?.minUptime !== undefined) {
    filtered = filtered.filter(f => 
      f.stats?.uptime !== undefined && f.stats.uptime >= options.minUptime!
    );
  }

  if (filtered.length === 0) {
    return null;
  }

  // Check preferred IDs first
  if (options?.preferredIds && options.preferredIds.length > 0) {
    for (const preferredId of options.preferredIds) {
      const preferred = filtered.find(f => f.id === preferredId);
      if (preferred) {
        return preferred;
      }
    }
  }

  // Sort based on criteria
  const sortBy = options?.sortBy || 'fee';

  if (sortBy === 'random') {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  filtered.sort((a, b) => {
    if (sortBy === 'fee') {
      // Lowest fee first
      return a.fee - b.fee;
    } else if (sortBy === 'successRate') {
      // Highest success rate first
      const aRate = a.stats?.successRate ?? 0;
      const bRate = b.stats?.successRate ?? 0;
      return bRate - aRate;
    } else if (sortBy === 'uptime') {
      // Highest uptime first
      const aUptime = a.stats?.uptime ?? 0;
      const bUptime = b.stats?.uptime ?? 0;
      return bUptime - aUptime;
    }
    return 0;
  });

  return filtered[0] || null;
}

/**
 * Discover and select a facilitator
 * 
 * Combines fetching and selection into one convenient function
 */
export async function discoverFacilitator(
  apiUrl: string = 'http://localhost:3001',
  options?: FacilitatorSelectionOptions
): Promise<FacilitatorInfo | null> {
  const network = options?.network || 'x1-testnet';
  const facilitators = await fetchFacilitators(apiUrl, network);
  
  if (facilitators.length === 0) {
    console.warn('No facilitators found');
    return null;
  }

  const selected = selectBestFacilitator(facilitators, options);
  
  if (!selected) {
    console.warn('No facilitator matched the selection criteria');
  }

  return selected;
}

/**
 * Get facilitator with fallback strategy
 * 
 * Tries to discover facilitator from API, falls back to provided default if discovery fails
 */
export async function getFacilitatorWithFallback(
  apiUrl: string = 'http://localhost:3001',
  defaultFacilitatorUrl: string,
  options?: FacilitatorSelectionOptions
): Promise<string> {
  try {
    const facilitator = await discoverFacilitator(apiUrl, options);
    
    if (facilitator && facilitator.url) {
      return facilitator.url;
    }
    
    console.warn(`Using fallback facilitator: ${defaultFacilitatorUrl}`);
    return defaultFacilitatorUrl;
  } catch (error: any) {
    console.error('Facilitator discovery failed, using fallback:', error.message);
    return defaultFacilitatorUrl;
  }
}

/**
 * Check if a facilitator is healthy
 */
export async function checkFacilitatorHealth(facilitatorUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${facilitatorUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3s timeout
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    return false;
  }
}

/**
 * Select facilitator with health check
 * 
 * Selects best facilitator and verifies it's healthy, falls back to next best if not
 */
export async function selectHealthyFacilitator(
  apiUrl: string = 'http://localhost:3001',
  options?: FacilitatorSelectionOptions
): Promise<FacilitatorInfo | null> {
  const network = options?.network || 'x1-testnet';
  const facilitators = await fetchFacilitators(apiUrl, network);
  
  if (facilitators.length === 0) {
    return null;
  }

  // Get sorted list based on criteria
  let filtered = facilitators.filter(f => f.status === 'active');

  if (options?.network) {
    filtered = filtered.filter(f => f.network === options.network);
  }

  // Apply other filters
  if (options?.maxFee !== undefined) {
    filtered = filtered.filter(f => f.fee <= options.maxFee!);
  }

  if (options?.minSuccessRate !== undefined) {
    filtered = filtered.filter(f => 
      f.stats?.successRate !== undefined && f.stats.successRate >= options.minSuccessRate!
    );
  }

  if (options?.minUptime !== undefined) {
    filtered = filtered.filter(f => 
      f.stats?.uptime !== undefined && f.stats.uptime >= options.minUptime!
    );
  }

  // Sort by fee (lowest first) as default
  filtered.sort((a, b) => a.fee - b.fee);

  // Try each facilitator in order until we find a healthy one
  for (const facilitator of filtered) {
    const isHealthy = await checkFacilitatorHealth(facilitator.url);
    if (isHealthy) {
      return facilitator;
    } else {
      console.warn(`⚠️  Facilitator ${facilitator.name} failed health check, trying next...`);
    }
  }

  console.error('❌ No healthy facilitators found');
  return null;
}

