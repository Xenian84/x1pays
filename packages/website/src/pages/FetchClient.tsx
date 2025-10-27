const FetchClient = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/facilitator" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Facilitator
          </a>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fetch API Client Quickstart</h1>
          <p className="text-xl text-gray-600">
            Use native Fetch API with x402 payment protocol - zero dependencies.
          </p>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
          <p className="text-gray-700 mb-4">
            Install the lightweight x402 fetch wrapper:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">
              npm install @x1pays/client
            </code>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Uses native Fetch API with automatic x402 payment handling.
          </p>
        </section>

        {/* Basic Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
          <p className="text-gray-700 mb-4">
            Simple paid requests with fetch:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { fetchX402JSON } from '@x1pays/client/fetch'
import { Keypair } from '@solana/web3.js'

const wallet = Keypair.fromSecretKey(
  Buffer.from(process.env.WALLET_SECRET_KEY!, 'base64')
)

// Make paid request  
const response = await fetchX402JSON(
  'https://api.example.com/premium/data',
  { 
    method: 'GET',
    wallet 
  }
)

console.log('Data:', response.data)
console.log('Payment:', response.payment)`}
            </pre>
          </div>
        </section>

        {/* Manual Implementation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Manual Implementation</h2>
          <p className="text-gray-700 mb-4">
            Understand how x402 works by implementing it manually with native fetch:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import * as nacl from 'tweetnacl'
import bs58 from 'bs58'

async function fetchWithPayment(url, wallet) {
  // 1. Try initial request
  let response = await fetch(url)
  
  // 2. If payment required, handle it
  if (response.status === 402) {
    const paymentReq = JSON.parse(
      response.headers.get('X-Payment-Required')
    )
    
    // 3. Create and sign payment
    const payment = {
      scheme: paymentReq.scheme,
      network: paymentReq.network,
      payTo: paymentReq.payTo,
      asset: paymentReq.asset,
      amount: paymentReq.amount,
      buyer: wallet.publicKey.toBase58(),
      memo: null
    }
    
    const message = Buffer.from(JSON.stringify(payment))
    const signature = nacl.sign.detached(
      message,
      wallet.secretKey
    )
    payment.signature = bs58.encode(signature)
    
    // 4. Send to facilitator
    const settleRes = await fetch(
      \`\${paymentReq.facilitatorUrl}/settle\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }
    )
    
    const settlement = await settleRes.json()
    
    // 5. Retry original request with payment proof
    response = await fetch(url, {
      headers: {
        'X-Payment': JSON.stringify({
          ...payment,
          txHash: settlement.txHash
        })
      }
    })
  }
  
  return response
}

// Usage
const res = await fetchWithPayment(
  'https://api.example.com/premium/data',
  wallet
)
const data = await res.json()`}
            </pre>
          </div>
        </section>

        {/* POST Requests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">POST Requests</h2>
          <p className="text-gray-700 mb-4">
            Send data with paid requests:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`const response = await fetchX402(
  'https://api.example.com/analyze',
  {
    method: 'POST',
    wallet: wallet,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: 'data to analyze',
      options: {
        detailed: true
      }
    })
  }
)

const result = await response.json()`}
            </pre>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
          <p className="text-gray-700 mb-4">
            Handle errors gracefully:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`async function safeFetch(url, wallet) {
  try {
    const response = await fetchX402(url, { wallet })
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
    }
    
    return await response.json()
  } catch (error) {
    if (error.name === 'PaymentError') {
      console.error('Payment failed:', error.message)
      // Handle payment-specific errors
    } else if (error.name === 'NetworkError') {
      console.error('Network error:', error.message)
      // Handle network issues
    } else {
      console.error('Unknown error:', error)
    }
    
    throw error
  }
}`}
            </pre>
          </div>
        </section>

        {/* Browser Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Integration</h2>
          <p className="text-gray-700 mb-4">
            Use in browser with wallet extensions:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// index.html - include via CDN
<script src="https://unpkg.com/@x1pays/fetch-x402/dist/browser.js"></script>

// app.js
async function fetchPremiumData() {
  // Connect wallet
  const wallet = window.solana
  await wallet.connect()
  
  // Make paid request
  const response = await window.fetchX402(
    'https://api.example.com/premium/data',
    { wallet }
  )
  
  const data = await response.json()
  document.getElementById('result').textContent = 
    JSON.stringify(data, null, 2)
}`}
            </pre>
          </div>
        </section>

        {/* React Hooks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">React Hooks</h2>
          <p className="text-gray-700 mb-4">
            Create reusable hooks for paid API calls:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { useState, useCallback } from 'react'
import { fetchX402 } from '@x1pays/fetch-x402'

function usePaidFetch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetch = useCallback(async (url, wallet, options = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetchX402(url, {
        ...options,
        wallet
      })
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`)
      }
      
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { fetch, loading, error }
}

// Usage in component
function PremiumContent({ wallet }) {
  const { fetch, loading, error } = usePaidFetch()
  const [data, setData] = useState(null)
  
  const loadData = async () => {
    const result = await fetch(
      'https://api.example.com/premium/data',
      wallet
    )
    setData(result)
  }
  
  return (
    <div>
      <button onClick={loadData} disabled={loading}>
        {loading ? 'Loading...' : 'Get Data'}
      </button>
      {error && <p className="error">{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}`}
            </pre>
          </div>
        </section>

        {/* Streaming Responses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Streaming Responses</h2>
          <p className="text-gray-700 mb-4">
            Handle streaming responses with payments:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`async function streamPaidData(url, wallet) {
  const response = await fetchX402(url, { wallet })
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    console.log('Received chunk:', chunk)
    
    // Process streaming data
    processChunk(chunk)
  }
}

// Usage for AI streaming responses
await streamPaidData(
  'https://api.example.com/ai/stream',
  wallet
)`}
            </pre>
          </div>
        </section>

        {/* Comparison with Axios */}
        <section className="mb-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Fetch vs Axios</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">✅ Fetch Advantages</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Zero dependencies (native browser API)</li>
                <li>• Smaller bundle size</li>
                <li>• Modern Promise-based API</li>
                <li>• Better streaming support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">⚡ Axios Advantages</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Automatic JSON transformation</li>
                <li>• Built-in timeout support</li>
                <li>• Better error handling</li>
                <li>• Request/response interceptors</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <div className="space-y-3">
            <a 
              href="/examples" 
              className="block p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">View Complete Examples</h3>
              <p className="text-gray-700 text-sm">See full fetch-based applications</p>
            </a>
            <a 
              href="/quickstart/axios" 
              className="block p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Compare with Axios</h3>
              <p className="text-gray-700 text-sm">See the Axios client implementation</p>
            </a>
            <a 
              href="/quickstart/servers" 
              className="block p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Build a Server</h3>
              <p className="text-gray-700 text-sm">Create an x402-enabled API</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FetchClient;
