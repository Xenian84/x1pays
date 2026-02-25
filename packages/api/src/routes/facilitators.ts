import express from 'express'
import pino from 'pino'

const router: express.Router = express.Router()
const logger = pino({ transport: { target: 'pino-pretty' } })

const FACILITATORS = [
  {
    id: 'x1pays-testnet',
    name: 'X1Pays Testnet',
    url: process.env.FACILITATOR_URL_TESTNET || 'http://localhost:4000',
    fee: 10,
    status: 'active' as const,
    network: 'x1-testnet' as const,
    address: '',
  },
  {
    id: 'x1pays-mainnet',
    name: 'X1Pays Mainnet',
    url: process.env.FACILITATOR_URL_MAINNET || 'http://localhost:4003',
    fee: 10,
    status: 'active' as const,
    network: 'x1-mainnet' as const,
    address: '',
  },
]

// Backward compat: map old IDs to new ones
const ID_ALIASES: Record<string, string> = {
  'alpha': 'x1pays-testnet',
  'beta': 'x1pays-testnet',
  'gamma': 'x1pays-testnet',
  'alpha-mainnet': 'x1pays-mainnet',
  'beta-mainnet': 'x1pays-mainnet',
  'gamma-mainnet': 'x1pays-mainnet',
}

function findFacilitator(id: string) {
  const resolved = ID_ALIASES[id] || id
  return FACILITATORS.find(f => f.id === resolved)
}

router.get('/', async (req, res) => {
  try {
    const network = (req.query.network as string) || 'x1-mainnet'
    const facilitators = FACILITATORS.filter(f => f.network === network)

    res.json({
      facilitators: facilitators.map(f => ({
        id: f.id,
        name: f.name,
        url: f.url,
        fee: f.fee,
        feePercent: '0.1%',
        status: f.status,
        network: f.network,
        address: f.address,
      })),
      network,
      total: facilitators.length,
    })
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to list facilitators')
    res.status(500).json({ error: 'Failed to fetch facilitators' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Facilitator ID is required' })
    }
    const facilitator = findFacilitator(req.params.id)
    if (!facilitator) {
      return res.status(404).json({ error: 'Facilitator not found', id: req.params.id })
    }

    // Proxy to the actual facilitator health to get live address/fee
    try {
      const healthRes = await fetch(`${facilitator.url}/health`, {
        signal: AbortSignal.timeout(5000),
      })
      if (healthRes.ok) {
        let data: any
        try {
          data = await healthRes.json()
        } catch {
          // fall through to cached if JSON parsing fails
          data = null
        }
        if (data) {
          return res.json({
            id: facilitator.id,
            name: facilitator.name,
            url: facilitator.url,
            fee: data.feeBasisPoints ?? facilitator.fee,
            feePercent: `${((data.feeBasisPoints ?? facilitator.fee) / 100).toFixed(1)}%`,
            status: 'active',
            network: facilitator.network,
            address: data.facilitatorAddress || '',
            treasuryAddress: data.treasuryAddress || '',
          })
        }
      }
    } catch {
      // fall through to cached
    }

    res.json({
      id: facilitator.id,
      name: facilitator.name,
      url: facilitator.url,
      fee: facilitator.fee,
      feePercent: '0.1%',
      status: facilitator.status,
      network: facilitator.network,
      address: facilitator.address,
    })
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to get facilitator')
    res.status(500).json({ error: 'Failed to fetch facilitator' })
  }
})

router.get('/:id/health', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Facilitator ID is required' })
    }
    const facilitator = findFacilitator(req.params.id)
    if (!facilitator) {
      return res.status(404).json({ error: 'Facilitator not found' })
    }

    try {
      const healthRes = await fetch(`${facilitator.url}/health`, {
        signal: AbortSignal.timeout(5000),
      })
      let data: any = null
      if (healthRes.ok) {
        try {
          data = await healthRes.json()
        } catch {
          data = null
        }
      }

      res.json({
        id: facilitator.id,
        healthy: healthRes.ok,
        status: healthRes.ok ? 'online' : 'offline',
        uptime: data?.uptime as number | undefined,
        timestamp: new Date().toISOString(),
      })
    } catch {
      res.json({
        id: facilitator.id,
        healthy: false,
        status: 'offline',
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Health check failed' })
  }
})

router.get('/:id/stats', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Facilitator ID is required' })
    }
    const facilitator = findFacilitator(req.params.id)
    if (!facilitator) {
      return res.status(404).json({ error: 'Facilitator not found' })
    }

    try {
      const statsRes = await fetch(`${facilitator.url}/stats`, {
        signal: AbortSignal.timeout(5000),
      })
      if (statsRes.ok) {
        let data: Record<string, unknown>
        try {
          data = await statsRes.json() as Record<string, unknown>
        } catch {
          return res.json({ id: facilitator.id, note: 'Stats response was not valid JSON' })
        }
        return res.json({ id: facilitator.id, ...data })
      }
    } catch {
      // fall through
    }

    res.json({ id: facilitator.id, note: 'Stats unavailable' })
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
