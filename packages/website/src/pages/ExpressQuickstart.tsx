const ExpressQuickstart = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/facilitator" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Facilitator
          </a>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Express.js Quickstart</h1>
          <p className="text-xl text-gray-600">
            Build an x402-enabled API server with Express.js in minutes.
          </p>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
          <p className="text-gray-700 mb-4">
            Install Express and the x402 middleware package:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">
              npm install express @x1pays/middleware
            </code>
          </div>
        </section>

        {/* Basic Setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Setup</h2>
          <p className="text-gray-700 mb-4">
            Create a simple Express server with x402 payment protection:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import express from 'express'
import { x402Middleware } from '@x1pays/middleware'

const app = express()
app.use(express.json())

// Configure x402 middleware
const paymentMiddleware = x402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: '1000'  // 0.001 wXNT
})

// Free endpoint - no payment required
app.get('/api/public/hello', (req, res) => {
  res.json({ message: 'This is free!' })
})

// Premium endpoint - requires payment
app.get('/api/premium/data',
  paymentMiddleware,
  (req, res) => {
    // Payment verified! Access payment details:
    const txHash = res.locals.txHash
    const amount = res.locals.amount
    
    res.json({
      data: 'Premium content here',
      payment: {
        txHash,
        amount,
        simulated: res.locals.simulated
      }
    })
  }
)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})`}
            </pre>
          </div>
        </section>

        {/* Environment Variables */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Environment Variables</h2>
          <p className="text-gray-700 mb-4">
            Create a <code className="px-2 py-1 bg-gray-100 rounded">.env</code> file:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`# Your merchant wallet (receives payments)
MERCHANT_WALLET=your_x1_wallet_address

# wXNT token contract on X1
WXNT_MINT=your_wxnt_mint_address

# Network (x1-mainnet or x1-devnet)
NETWORK=x1-mainnet

# Port
PORT=3000`}
            </pre>
          </div>
        </section>

        {/* Advanced: Dynamic Pricing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced: Dynamic Pricing</h2>
          <p className="text-gray-700 mb-4">
            Set different prices for different endpoints:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// Shared configuration
const baseConfig = {
  facilitatorUrl: 'https://facilitator.x1pays.network',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET,
  tokenMint: process.env.WXNT_MINT
}

// Cheap endpoint - $0.001
app.get('/api/basic',
  x402Middleware({ 
    ...baseConfig, 
    amount: '1000000' // 0.001 wXNT
  }),
  (req, res) => {
    res.json({ tier: 'basic' })
  }
)

// Premium endpoint - $0.01
app.get('/api/premium',
  x402Middleware({ 
    ...baseConfig, 
    amount: '10000000' // 0.01 wXNT
  }),
  (req, res) => {
    res.json({ tier: 'premium' })
  }
)

// Usage-based pricing
app.post('/api/analyze',
  async (req, res, next) => {
    // Calculate price based on request
    const dataSize = req.body.data.length
    const price = Math.max(1000000, dataSize * 100)
    
    // Attach dynamic price to request
    req.x402Price = price.toString()
    next()
  },
  x402Middleware({ 
    ...baseConfig,
    getDynamicAmount: (req) => req.x402Price
  }),
  (req, res) => {
    res.json({ analyzed: true })
  }
)`}
            </pre>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
          <p className="text-gray-700 mb-4">
            Handle payment errors gracefully:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`app.get('/api/premium/data',
  paymentMiddleware,
  (req, res) => {
    res.json({ data: 'Premium content' })
  }
)

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === 'PaymentRequired') {
    return res.status(402).json({
      error: 'Payment required',
      details: err.message
    })
  }
  
  if (err.name === 'InvalidPayment') {
    return res.status(400).json({
      error: 'Invalid payment',
      details: err.message
    })
  }
  
  res.status(500).json({ error: 'Server error' })
})`}
            </pre>
          </div>
        </section>

        {/* CORS Configuration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">CORS Configuration</h2>
          <p className="text-gray-700 mb-4">
            Enable CORS for payment headers:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import cors from 'cors'

app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  exposedHeaders: [
    'X-Payment-Required',
    'X-Payment-Response'
  ]
}))`}
            </pre>
          </div>
        </section>

        {/* Testing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing Your Server</h2>
          <p className="text-gray-700 mb-4">
            Test with cURL or any HTTP client:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
            <pre className="text-sm text-gray-300">
{`# First request - receive payment challenge
curl -v http://localhost:3000/api/premium/data

# Response: 402 Payment Required
# Headers include: X-Payment-Required with payment details`}
            </pre>
          </div>
          <p className="text-gray-700 mb-4">
            Use the x402 client to make automatic payments:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { x402Client } from '@x1pays/x402-client'

const response = await x402Client({
  url: 'http://localhost:3000/api/premium/data',
  wallet: myWallet
})

console.log('Data:', response.data)
console.log('Payment TX:', response.payment.txHash)`}
            </pre>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <div className="space-y-3">
            <a 
              href="/examples" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">View Complete Examples</h3>
              <p className="text-gray-700 text-sm">See full working examples with frontend integration</p>
            </a>
            <a 
              href="/quickstart/axios" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Build a Client</h3>
              <p className="text-gray-700 text-sm">Learn how to consume your x402 API from the client side</p>
            </a>
            <a 
              href="/troubleshooting" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Troubleshooting</h3>
              <p className="text-gray-700 text-sm">Common issues and solutions</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExpressQuickstart;
