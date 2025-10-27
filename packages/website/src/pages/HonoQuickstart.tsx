const HonoQuickstart = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/facilitator" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Facilitator
          </a>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hono Quickstart</h1>
          <p className="text-xl text-gray-600">
            Build ultra-fast x402-enabled APIs with Hono framework.
          </p>
        </div>

        {/* Why Hono */}
        <section className="mb-12 p-6 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Why Hono?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">⚡</span>
              <span><strong>Ultra-fast:</strong> Up to 4x faster than Express.js</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">🏃</span>
              <span><strong>Edge-ready:</strong> Works on Cloudflare Workers, Deno, Bun</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">🪶</span>
              <span><strong>Lightweight:</strong> Tiny bundle size, minimal dependencies</span>
            </li>
          </ul>
        </section>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
          <p className="text-gray-700 mb-4">
            Install Hono and the x402 middleware:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">
              npm install hono @x1pays/x402-middleware
            </code>
          </div>
        </section>

        {/* Basic Setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Setup</h2>
          <p className="text-gray-700 mb-4">
            Create a Hono server with x402 payment protection:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { Hono } from 'hono'
import { x402 } from '@x1pays/x402-middleware/hono'

const app = new Hono()

// Configure x402 middleware
const payment = x402({
  facilitatorUrl: 'https://facilitator.x1pays.network',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  amount: '1000000', // 0.001 wXNT
  tokenMint: process.env.WXNT_MINT!
})

// Free endpoint
app.get('/api/public/hello', (c) => {
  return c.json({ message: 'This is free!' })
})

// Premium endpoint - requires payment
app.get('/api/premium/data', payment, (c) => {
  // Payment verified! Access via context:
  const txHash = c.get('txHash')
  const amount = c.get('amount')
  
  return c.json({
    data: 'Premium content here',
    payment: {
      txHash,
      amount,
      simulated: c.get('simulated')
    }
  })
})

export default app`}
            </pre>
          </div>
        </section>

        {/* Development Server */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Development Server</h2>
          <p className="text-gray-700 mb-4">
            Run with Node.js adapter:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { serve } from '@hono/node-server'
import app from './app'

serve({
  fetch: app.fetch,
  port: 3000
})

console.log('Server running on http://localhost:3000')`}
            </pre>
          </div>
        </section>

        {/* Middleware Composition */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Middleware Composition</h2>
          <p className="text-gray-700 mb-4">
            Combine x402 with other Hono middleware:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Global middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  exposeHeaders: ['X-Payment-Required', 'X-Payment-Response']
}))

// Premium routes with payment + JSON formatting
app.get('/api/premium/*', payment, prettyJSON())
app.get('/api/premium/data', (c) => {
  return c.json({ data: 'Premium content' })
})`}
            </pre>
          </div>
        </section>

        {/* Dynamic Pricing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dynamic Pricing</h2>
          <p className="text-gray-700 mb-4">
            Set prices based on request parameters:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// Shared configuration
const config = {
  facilitatorUrl: 'https://facilitator.x1pays.network',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!
}

// Price tiers
const basicPayment = x402({ ...config, amount: '1000000' })
const premiumPayment = x402({ ...config, amount: '10000000' })

// Different endpoints, different prices
app.get('/api/basic', basicPayment, (c) => {
  return c.json({ tier: 'basic' })
})

app.get('/api/premium', premiumPayment, (c) => {
  return c.json({ tier: 'premium' })
})

// Dynamic pricing based on query params
app.post('/api/analyze', async (c) => {
  const body = await c.req.json()
  const dataSize = body.data.length
  const price = Math.max(1000000, dataSize * 100)
  
  // Create dynamic payment middleware
  const dynamicPayment = x402({ 
    ...config, 
    amount: price.toString() 
  })
  
  // Apply payment check
  await dynamicPayment(c, async () => {})
  
  return c.json({ analyzed: true })
})`}
            </pre>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
          <p className="text-gray-700 mb-4">
            Handle payment errors in Hono:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { HTTPException } from 'hono/http-exception'

// Custom error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Handle 402 Payment Required
    if (err.status === 402) {
      return c.json({
        error: 'Payment required',
        details: err.message
      }, 402)
    }
  }
  
  console.error('Error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})`}
            </pre>
          </div>
        </section>

        {/* Deploy to Edge */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deploy to Cloudflare Workers</h2>
          <p className="text-gray-700 mb-4">
            Hono works great on edge platforms:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
            <pre className="text-sm text-gray-300">
{`// wrangler.toml
name = "x402-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
NETWORK = "x1-mainnet"
MERCHANT_WALLET = "your_wallet_address"
WXNT_MINT = "your_wxnt_mint"`}
            </pre>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// src/index.ts
export default {
  fetch: app.fetch
}

// Deploy
npx wrangler deploy`}
            </pre>
          </div>
        </section>

        {/* Testing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing</h2>
          <p className="text-gray-700 mb-4">
            Test your Hono server:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { testClient } from 'hono/testing'

describe('Payment API', () => {
  const client = testClient(app)
  
  it('should return 402 for premium endpoint', async () => {
    const res = await client.api.premium.data.$get()
    expect(res.status).toBe(402)
  })
  
  it('should allow access with payment', async () => {
    const res = await client.api.premium.data.$get({
      headers: {
        'X-Payment': JSON.stringify(paymentProof)
      }
    })
    expect(res.status).toBe(200)
  })
})`}
            </pre>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <div className="space-y-3">
            <a 
              href="/examples" 
              className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">View Complete Examples</h3>
              <p className="text-gray-700 text-sm">See full working Hono applications</p>
            </a>
            <a 
              href="/quickstart/fetch" 
              className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Build a Client</h3>
              <p className="text-gray-700 text-sm">Learn how to consume your Hono x402 API</p>
            </a>
            <a 
              href="https://hono.dev/docs" 
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Hono Documentation</h3>
              <p className="text-gray-700 text-sm">Learn more about Hono framework</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HonoQuickstart;
