import { useState } from 'react'

const Examples = () => {
  const [selectedTab, setSelectedTab] = useState('nodejs')

  const examples = {
    nodejs: {
      title: 'Node.js / TypeScript',
      icon: '🟢',
      code: `import { x402Client } from '@x1pays/client/axios'
import { Keypair } from '@solana/web3.js'
import fs from 'fs'

// Load wallet from secret key file
const secretKey = JSON.parse(
  fs.readFileSync('./wallet-secret.json', 'utf-8')
)
const wallet = Keypair.fromSecretKey(new Uint8Array(secretKey))

// Make a paid request
async function fetchPremiumData() {
  try {
    const response = await x402Client({
      url: 'https://api.yourapp.com/premium/data',
      method: 'GET',
      wallet: wallet,
      retry: {
        maxRetries: 3,
        retryDelay: 1000
      }
    })
    
    console.log('Premium data:', response.data)
    console.log('Payment TX:', response.payment?.txHash)
    console.log('Amount paid:', response.payment?.amount)
    console.log('Simulated:', response.payment?.simulated)
  } catch (error) {
    console.error('Request failed:', error)
  }
}

fetchPremiumData()`
    },
    fetch: {
      title: 'Native Fetch API',
      icon: '🌐',
      code: `import { fetchX402JSON } from '@x1pays/client/fetch'
import { Keypair } from '@solana/web3.js'

// Load wallet
const wallet = Keypair.fromSecretKey(secretKeyBytes)

// Make paid request with automatic JSON parsing
async function getPremiumData() {
  try {
    const response = await fetchX402JSON(
      'https://api.yourapp.com/premium/data',
      { 
        method: 'GET',
        wallet: wallet 
      }
    )
    
    console.log('Data:', response.data)
    console.log('Payment:', response.payment)
  } catch (error) {
    console.error('Failed:', error)
  }
}

// Or use fetchX402() for raw Response object
import { fetchX402 } from '@x1pays/client/fetch'

async function getPremiumDataRaw() {
  const response = await fetchX402(url, { wallet, method: 'GET' })
  const data = await response.json()
  console.log('Payment info:', response.x402Payment)
  return data
}

getPremiumData()`
    },
    python: {
      title: 'Python',
      icon: '🐍',
      code: `import requests
import json
from nacl.signing import SigningKey
import base58
import time

class X402Client:
    def __init__(self, wallet_secret_key_hex):
        """Initialize with ed25519 secret key (64 bytes hex)"""
        self.signing_key = SigningKey(bytes.fromhex(wallet_secret_key_hex))
        self.public_key = self.signing_key.verify_key.encode().hex()
        
    def make_request(self, url):
        """Make x402-enabled request"""
        # Step 1: Try request (will get 402)
        response = requests.get(url)
        
        if response.status_code != 402:
            return response.json()
        
        # Step 2: Parse payment requirement
        payment_req_header = response.headers.get('X-Payment-Required')
        requirement = json.loads(payment_req_header)
        accept = requirement['accepts'][0]
        
        # Step 3: Create payment payload
        payment = {
            'scheme': accept['scheme'],
            'network': accept['network'],
            'payTo': accept['payTo'],
            'asset': accept['asset'],
            'amount': accept['maxAmountRequired'],
            'buyer': self.public_key,
            'memo': None
        }
        
        # Step 4: Sign payment
        message = json.dumps(payment, separators=(',', ':')).encode()
        signature = self.signing_key.sign(message).signature
        payment['signature'] = base58.b58encode(signature).decode()
        
        # Step 5: Verify with facilitator
        facilitator_url = accept['facilitatorUrl']
        verify_resp = requests.post(
            f"{facilitator_url}/verify",
            json=payment
        )
        
        if not verify_resp.json()['valid']:
            raise Exception('Payment verification failed')
        
        # Step 6: Settle payment
        settle_resp = requests.post(
            f"{facilitator_url}/settle",
            json=payment
        )
        settlement = settle_resp.json()
        
        # Step 7: Retry with payment proof
        payment['txHash'] = settlement['txHash']
        headers = {'X-Payment': json.dumps(payment)}
        response = requests.get(url, headers=headers)
        
        return response.json()

# Usage
client = X402Client(wallet_secret_key_hex='your_64_byte_hex_key')
data = client.make_request('https://api.yourapp.com/premium/data')
print(data)`
    },
    curl: {
      title: 'cURL (Manual)',
      icon: '📡',
      code: `# Step 1: Try to access endpoint (will get 402)
curl -i https://api.yourapp.com/premium/data

# Response:
# HTTP/1.1 402 Payment Required
# X-Payment-Required: {
#   "accepts": [{
#     "scheme": "exact",
#     "network": "x1-mainnet",
#     "payTo": "MERCHANT_WALLET",
#     "asset": "WXNT_MINT",
#     "maxAmountRequired": "1000",
#     "facilitatorUrl": "https://facilitator.x1pays.xyz"
#   }],
#   "x402Version": 1
# }

# Step 2: Create payment payload
PAYMENT='{
  "scheme": "exact",
  "network": "x1-mainnet",
  "payTo": "MERCHANT_WALLET",
  "asset": "WXNT_MINT",
  "amount": "1000",
  "buyer": "YOUR_PUBKEY",
  "signature": "BASE58_ED25519_SIGNATURE",
  "memo": null
}'

# Step 3: Verify payment with facilitator
curl -X POST https://facilitator.x1pays.xyz/verify \\
  -H "Content-Type: application/json" \\
  -d "$PAYMENT"

# Step 4: Settle payment with facilitator
curl -X POST https://facilitator.x1pays.xyz/settle \\
  -H "Content-Type: application/json" \\
  -d "$PAYMENT"

# Response: {"txHash": "SIM_ABC123...", "amount": "1000", "simulated": true}

# Step 5: Retry request with payment proof
curl -H "X-Payment: $PAYMENT" \\
     https://api.yourapp.com/premium/data

# Success! You get the data`
    },
    express: {
      title: 'Express.js Server',
      icon: '🚂',
      code: `import express from 'express'
import { x402Middleware } from '@x1pays/middleware'

const app = express()

// Public endpoints (no payment required)
app.get('/api/public/hello', (req, res) => {
  res.json({ message: 'This is free!' })
})

// Premium endpoints (payment required)
app.get('/api/premium/data',
  x402Middleware({
    facilitatorUrl: process.env.FACILITATOR_URL!,
    network: 'x1-mainnet',
    payToAddress: process.env.MERCHANT_WALLET!,
    tokenMint: process.env.WXNT_MINT!,
    amount: '1000'  // 0.001 wXNT
  }),
  (req, res) => {
    // Payment verified! Access payment details
    const payment = (req as any).x402Payment
    
    res.json({
      data: 'Premium content here',
      payment: {
        txHash: payment.txHash,
        amount: payment.amount,
        simulated: payment.simulated
      }
    })
  }
)

// Dynamic pricing example
app.get('/api/premium/custom',
  x402Middleware({
    facilitatorUrl: process.env.FACILITATOR_URL!,
    network: 'x1-mainnet',
    payToAddress: process.env.MERCHANT_WALLET!,
    tokenMint: process.env.WXNT_MINT!,
    amount: '1000',
    getDynamicAmount: async (req) => {
      // Custom pricing logic
      const tier = req.query.tier
      return tier === 'premium' ? '5000' : '1000'
    }
  }),
  (req, res) => {
    res.json({ data: 'Custom priced content' })
  }
)

app.listen(3000, () => {
  console.log('x402-enabled server running on port 3000')
})`
    },
    hono: {
      title: 'Hono (Edge)',
      icon: '🔥',
      code: `import { Hono } from 'hono'
import { x402 } from '@x1pays/middleware/hono'

const app = new Hono()

// Public route
app.get('/public', (c) => {
  return c.json({ message: 'Free content' })
})

// Paid route with x402 middleware
app.get('/premium', 
  x402({
    facilitatorUrl: process.env.FACILITATOR_URL!,
    network: 'x1-mainnet',
    payToAddress: process.env.MERCHANT_WALLET!,
    tokenMint: process.env.WXNT_MINT!,
    amount: '1000'
  }),
  (c) => {
    // Payment verified!
    const payment = c.get('x402Payment')
    
    return c.json({ 
      data: 'Premium content',
      payment: payment
    })
  }
)

export default app`
    },
    nextjs: {
      title: 'Next.js API Route',
      icon: '▲',
      code: `// pages/api/premium/data.ts
import { x402Handler } from '@x1pays/middleware/nextjs'

export default x402Handler({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: '1000',
  handler: async (req, res) => {
    // Payment verified! Access payment info
    const payment = req.x402Payment
    
    res.status(200).json({
      data: 'Premium content from Next.js',
      payment: {
        txHash: payment?.txHash,
        amount: payment?.amount,
        simulated: payment?.simulated
      }
    })
  }
})

// With dynamic pricing
export const dynamicPricing = x402Handler({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: '1000',
  getDynamicAmount: async (req) => {
    const premium = req.query.premium === 'true'
    return premium ? '5000' : '1000'
  },
  handler: async (req, res) => {
    res.status(200).json({ data: 'content' })
  }
})`
    }
  }

  const tabs = Object.keys(examples) as Array<keyof typeof examples>

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Integration Examples</h1>
        <p className="text-xl text-gray-600">
          Real-world code examples using our actual @x1pays packages
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">💡 All Examples Use Real APIs</h3>
        <p className="text-blue-800 text-sm">
          These examples use the actual <code className="bg-blue-100 px-1 rounded">@x1pays/client</code> and <code className="bg-blue-100 px-1 rounded">@x1pays/middleware</code> packages.
          Copy and paste directly into your project!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                selectedTab === tab
                  ? 'bg-indigo-600 text-white border-b-2 border-indigo-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{examples[tab].icon}</span>
              {examples[tab].title}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {examples[selectedTab as keyof typeof examples].title} Example
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(examples[selectedTab as keyof typeof examples].code)
                alert('Code copied to clipboard!')
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              📋 Copy Code
            </button>
          </div>
          
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
            <code>{examples[selectedTab as keyof typeof examples].code}</code>
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">📚 Client-Side (Making Paid Requests)</h3>
          <p className="text-gray-600 mb-4">
            Use <code className="bg-gray-100 px-1 rounded">@x1pays/client</code> to make requests:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>Install: <code className="bg-gray-100 px-1 rounded text-xs">pnpm add @x1pays/client</code></li>
            <li>Import x402Client (Axios) or fetchX402 (Fetch)</li>
            <li>Provide your Solana wallet/keypair</li>
            <li>Make requests - payment happens automatically!</li>
            <li>Access response.data and response.payment</li>
          </ol>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">🔧 Server-Side (Accepting Payments)</h3>
          <p className="text-gray-600 mb-4">
            Use <code className="bg-gray-100 px-1 rounded">@x1pays/middleware</code> on your API:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>Install: <code className="bg-gray-100 px-1 rounded text-xs">pnpm add @x1pays/middleware</code></li>
            <li>Choose: Express, Hono, Fastify, or Next.js</li>
            <li>Configure facilitator URL and merchant wallet</li>
            <li>Set amount per endpoint (in atomic units)</li>
            <li>Middleware handles verify + settle automatically</li>
          </ol>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="text-3xl mb-3">✅</div>
          <h4 className="font-semibold mb-2">Best Practices</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Use MVP/simulated mode for testing</li>
            <li>• Store wallet keys in environment variables</li>
            <li>• Set reasonable payment amounts</li>
            <li>• Log transaction hashes for records</li>
            <li>• Test with small amounts first</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="text-3xl mb-3">⚠️</div>
          <h4 className="font-semibold mb-2">Common Mistakes</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Missing facilitatorUrl in config</li>
            <li>• Wrong package names (@x1pays not @x402)</li>
            <li>• Using bs58.encode() instead of base58</li>
            <li>• Forgetting to await signPayment()</li>
            <li>• Not checking environment variables</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="text-3xl mb-3">🔒</div>
          <h4 className="font-semibold mb-2">Security</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Never commit private keys to git</li>
            <li>• Use .env files for secrets</li>
            <li>• Verify signatures on server-side</li>
            <li>• Use HTTPS in production</li>
            <li>• Validate payment amounts match</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Ready to Integrate?</h3>
        <p className="mb-6 text-indigo-100">
          Check out our complete API reference and quickstart guides.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/docs/api-reference"
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Complete API Reference
          </a>
          <a
            href="/docs/getting-started"
            className="px-6 py-3 bg-indigo-700 text-white border-2 border-white rounded-lg font-medium hover:bg-indigo-800 transition-colors"
          >
            Getting Started
          </a>
          <a
            href="/facilitator"
            className="px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
          >
            Server Setup Guide
          </a>
        </div>
      </div>
    </div>
  )
}

export default Examples
