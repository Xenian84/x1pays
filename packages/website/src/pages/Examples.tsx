import { useState } from 'react'

const Examples = () => {
  const [selectedTab, setSelectedTab] = useState('nodejs')

  const examples = {
    nodejs: {
      title: 'Node.js / TypeScript',
      icon: '🟢',
      code: `import { PaymentClient } from '@x1pays/client'
import { Wallet } from '@x1pays/wallet'

// Initialize client
const client = new PaymentClient({
  apiUrl: 'https://api.yourapp.com'
})

// Create wallet from private key
const wallet = new Wallet(process.env.PRIVATE_KEY!)

// Make a paid request
async function fetchPremiumData() {
  try {
    const response = await client.request({
      url: '/api/premium/data',
      method: 'GET',
      wallet: wallet // Auto-pays if needed
    })
    
    console.log('Premium data:', response.data)
    console.log('Payment TX:', response.payment?.merchantTx)
  } catch (error) {
    console.error('Request failed:', error)
  }
}

fetchPremiumData()`
    },
    python: {
      title: 'Python',
      icon: '🐍',
      code: `import requests
import json
from nacl.signing import SigningKey
from nacl.encoding import Base64Encoder
import time

class X402Client:
    def __init__(self, api_url, private_key_hex):
        self.api_url = api_url
        self.signing_key = SigningKey(bytes.fromhex(private_key_hex))
        
    def make_request(self, endpoint):
        url = f"{self.api_url}{endpoint}"
        
        # First request to get payment details
        response = requests.get(url)
        
        if response.status_code == 402:
            # Payment required
            payment_info = response.json()
            
            # Create payment
            payment = {
                'from': self.signing_key.verify_key.encode().hex(),
                'to': payment_info['recipient'],
                'amount': payment_info['amount'],
                'timestamp': int(time.time() * 1000)
            }
            
            # Sign payment
            message = json.dumps(payment, separators=(',', ':')).encode()
            signature = self.signing_key.sign(message).signature
            sig_b64 = Base64Encoder.encode(signature).decode()
            
            # Retry with payment
            headers = {
                'X-Payment': json.dumps({
                    **payment,
                    'signature': sig_b64
                })
            }
            
            response = requests.get(url, headers=headers)
        
        return response.json()

# Usage
client = X402Client(
    api_url='https://api.yourapp.com',
    private_key_hex='your_private_key_hex'
)

data = client.make_request('/api/premium/data')
print(data)`
    },
    curl: {
      title: 'cURL',
      icon: '📡',
      code: `# Step 1: Try to access endpoint (will get 402)
curl -i https://api.yourapp.com/api/premium/data

# Response:
# HTTP/1.1 402 Payment Required
# {
#   "recipient": "MERCHANT_WALLET_ADDRESS",
#   "amount": "100",
#   "feePercent": 1
# }

# Step 2: Create and sign payment (use your preferred signing tool)
# Payment object:
PAYMENT='{
  "from": "YOUR_WALLET_ADDRESS",
  "to": "MERCHANT_WALLET_ADDRESS",
  "amount": "100",
  "timestamp": 1234567890000,
  "signature": "BASE64_SIGNATURE_HERE"
}'

# Step 3: Make request with payment header
curl -H "X-Payment: $PAYMENT" \\
     https://api.yourapp.com/api/premium/data

# Response:
# {
#   "ok": true,
#   "service": "x1pays-premium",
#   "paidTx": "TRANSACTION_HASH",
#   "payment": {
#     "merchantTx": "TX_HASH_1",
#     "feeTx": "TX_HASH_2",
#     "merchantAmount": "99",
#     "feeAmount": "1"
#   }
# }`
    },
    express: {
      title: 'Express.js Server',
      icon: '🚂',
      code: `import express from 'express'
import { x402Middleware } from '@x1pays/middleware'

const app = express()

// Configure x402 middleware
const paymentMiddleware = x402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  merchantWallet: process.env.MERCHANT_WALLET!
})

// Public endpoints (no payment required)
app.get('/api/public/hello', (req, res) => {
  res.json({ message: 'This is free!' })
})

// Premium endpoints (payment required)
app.get('/api/premium/data',
  paymentMiddleware,
  (req, res) => {
    // Payment verified - user paid to access this
    const txHash = res.locals.merchantTx
    
    res.json({
      data: 'Premium content here',
      paidTx: txHash,
      payment: {
        merchantTx: res.locals.merchantTx,
        feeTx: res.locals.feeTx,
        merchantAmount: res.locals.merchantAmount,
        feeAmount: res.locals.feeAmount
      }
    })
  }
)

// Start server
app.listen(3000, () => {
  console.log('Server with x402 running on port 3000')
})`
    },
    react: {
      title: 'React Frontend',
      icon: '⚛️',
      code: `import { useState } from 'react'
import { PaymentClient } from '@x1pays/client'
import { useWallet } from '@x1pays/react-hooks'

function PremiumContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { wallet, connect } = useWallet()
  
  const client = new PaymentClient({
    apiUrl: 'https://api.yourapp.com'
  })
  
  const fetchPremiumData = async () => {
    if (!wallet) {
      await connect()
      return
    }
    
    setLoading(true)
    try {
      const response = await client.request({
        url: '/api/premium/data',
        wallet: wallet
      })
      
      setData(response.data)
      
      // Show payment confirmation
      alert(\`Paid! TX: \${response.payment.merchantTx}\`)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <h2>Premium Content</h2>
      {!wallet ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <button onClick={fetchPremiumData} disabled={loading}>
          {loading ? 'Loading...' : 'Get Premium Data (100 wXNT)'}
        </button>
      )}
      
      {data && (
        <div>
          <h3>Your Premium Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default PremiumContent`
    }
  }

  const tabs = Object.keys(examples) as Array<keyof typeof examples>

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Integration Examples</h1>
        <p className="text-xl text-gray-600">
          Real-world code examples showing how to integrate x402 payments
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Start</h3>
        <p className="text-blue-800 text-sm">
          These examples show both client-side (making paid requests) and server-side (accepting payments).
          Choose the language that matches your stack and follow along!
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
          <h3 className="text-xl font-semibold mb-3">📚 Client-Side Integration</h3>
          <p className="text-gray-600 mb-4">
            Users making requests to x402-enabled APIs need to:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Attempt the API request</li>
            <li>Receive HTTP 402 with payment details</li>
            <li>Sign payment with wallet private key</li>
            <li>Retry request with X-Payment header</li>
            <li>Receive data + payment confirmation</li>
          </ol>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">🔧 Server-Side Integration</h3>
          <p className="text-gray-600 mb-4">
            APIs accepting x402 payments need to:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Apply x402 middleware to premium routes</li>
            <li>Configure merchant wallet address</li>
            <li>Set price per endpoint (amount required)</li>
            <li>Let middleware handle verification/settlement</li>
            <li>Access payment details from res.locals</li>
          </ol>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="text-3xl mb-3">✅</div>
          <h4 className="font-semibold mb-2">Best Practices</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Use simulation mode for testing</li>
            <li>• Cache wallet signatures securely</li>
            <li>• Handle 402 responses gracefully</li>
            <li>• Log transaction hashes for records</li>
            <li>• Set reasonable payment amounts</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="text-3xl mb-3">⚠️</div>
          <h4 className="font-semibold mb-2">Common Pitfalls</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Not checking env variables</li>
            <li>• Reusing old signatures</li>
            <li>• Wrong signature encoding</li>
            <li>• Forgetting middleware order</li>
            <li>• Missing CORS headers</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="text-3xl mb-3">🔒</div>
          <h4 className="font-semibold mb-2">Security Notes</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Never expose private keys</li>
            <li>• Validate payment amounts</li>
            <li>• Use HTTPS in production</li>
            <li>• Verify signatures server-side</li>
            <li>• Rate limit your endpoints</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Need More Help?</h3>
        <p className="mb-6 text-indigo-100">
          Check out our complete API reference and documentation for detailed guides.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/docs/api-reference"
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            API Reference
          </a>
          <a
            href="/docs/getting-started"
            className="px-6 py-3 bg-indigo-700 text-white border-2 border-white rounded-lg font-medium hover:bg-indigo-800 transition-colors"
          >
            Getting Started Guide
          </a>
          <a
            href="/troubleshooting"
            className="px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
          >
            Troubleshooting
          </a>
        </div>
      </div>
    </div>
  )
}

export default Examples
