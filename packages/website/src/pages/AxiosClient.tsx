const AxiosClient = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/facilitator" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Facilitator
          </a>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Axios Client Quickstart</h1>
          <p className="text-xl text-gray-600">
            Build x402-enabled HTTP clients with Axios for automatic payment handling.
          </p>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
          <p className="text-gray-700 mb-4">
            Install Axios and the x402 client package:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">
              npm install @x1pays/client
            </code>
          </div>
        </section>

        {/* Basic Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
          <p className="text-gray-700 mb-4">
            Make paid API calls with automatic payment handling:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { x402Client } from '@x1pays/client/axios'
import { Keypair } from '@solana/web3.js'

// Your wallet (for signing payments)
const wallet = Keypair.fromSecretKey(
  Buffer.from(process.env.WALLET_SECRET_KEY!, 'base64')
)

// Make a paid request - payment happens automatically!
async function getPremiumData() {
  try {
    const response = await x402Client({
      url: 'https://api.example.com/premium/data',
      method: 'GET',
      wallet: wallet
    })
    
    console.log('Data:', response.data)
    console.log('Payment TX:', response.payment?.txHash)
    console.log('Amount paid:', response.payment?.amount)
  } catch (error) {
    console.error('Request failed:', error)
  }
}`}
            </pre>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3">🔄 How It Works</h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Client makes initial request to protected endpoint</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Server responds with <code className="px-1 bg-white rounded">402 Payment Required</code> + payment details</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Client automatically signs payment and sends to facilitator</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Facilitator settles payment on X1 blockchain</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">5.</span>
              <span>Client retries request with payment proof</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">6.</span>
              <span>Server verifies payment and returns protected data</span>
            </li>
          </ol>
        </section>

        {/* POST Requests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">POST Requests with Data</h2>
          <p className="text-gray-700 mb-4">
            Send data along with payments:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`async function analyzeData(data: string) {
  const response = await x402Client({
    url: 'https://api.example.com/analyze',
    method: 'POST',
    wallet: wallet,
    data: {
      input: data,
      options: {
        detailed: true,
        format: 'json'
      }
    }
  })
  
  return response.data
}`}
            </pre>
          </div>
        </section>

        {/* Custom Headers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Headers</h2>
          <p className="text-gray-700 mb-4">
            Add custom headers to your requests:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`const response = await x402Client({
  url: 'https://api.example.com/premium/data',
  method: 'GET',
  wallet: wallet,
  headers: {
    'Authorization': \`Bearer \${apiToken}\`,
    'X-Client-Version': '1.0.0'
  }
})`}
            </pre>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
          <p className="text-gray-700 mb-4">
            Handle different error scenarios:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`async function robustRequest() {
  try {
    const response = await x402Client({
      url: 'https://api.example.com/premium/data',
      wallet: wallet
    })
    
    return response.data
  } catch (error: any) {
    if (error.response?.status === 402) {
      console.error('Payment required but failed:', error.message)
      // Handle payment failure
    } else if (error.response?.status === 400) {
      console.error('Invalid payment:', error.message)
      // Payment was invalid
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      console.error('Wallet has insufficient balance')
      // Handle insufficient funds
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network connection failed')
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

        {/* Retry Logic */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Retry Logic</h2>
          <p className="text-gray-700 mb-4">
            The client includes automatic retry logic for transient failures:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`const response = await x402Client({
  url: 'https://api.example.com/premium/data',
  wallet: wallet,
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // ms
    retryOn: [408, 429, 500, 502, 503, 504]
  }
})`}
            </pre>
          </div>
        </section>

        {/* Timeout Configuration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Timeout Configuration</h2>
          <p className="text-gray-700 mb-4">
            Set request timeouts:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`const response = await x402Client({
  url: 'https://api.example.com/long-task',
  wallet: wallet,
  timeout: 30000, // 30 seconds
  paymentTimeout: 10000 // 10 seconds for payment settlement
})`}
            </pre>
          </div>
        </section>

        {/* Multiple Requests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Multiple Requests</h2>
          <p className="text-gray-700 mb-4">
            Make multiple paid requests to the same API:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { x402Client } from '@x1pays/client/axios'

const baseConfig = {
  wallet: wallet,
  headers: {
    'X-Client-Version': '1.0.0'
  }
}

// Make multiple requests
const userData = await x402Client({
  ...baseConfig,
  url: 'https://api.example.com/users/me',
  method: 'GET'
})

const analytics = await x402Client({
  ...baseConfig,
  url: 'https://api.example.com/analytics',
  method: 'POST',
  data: { event: 'page_view' }
})

// Each request automatically handles x402 payments`}
            </pre>
          </div>
        </section>

        {/* React Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">React Integration</h2>
          <p className="text-gray-700 mb-4">
            Use x402 client in React applications:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { useState, useEffect } from 'react'
import { x402Client } from '@x1pays/client/axios'

function PremiumContent({ wallet }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchPremiumData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await x402Client({
        url: 'https://api.example.com/premium/data',
        method: 'GET',
        wallet: wallet
      })
      
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <button onClick={fetchPremiumData} disabled={loading}>
        {loading ? 'Processing Payment...' : 'Get Premium Data'}
      </button>
      
      {error && <p className="error">{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}`}
            </pre>
          </div>
        </section>

        {/* Browser Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Usage</h2>
          <p className="text-gray-700 mb-4">
            Use in browser with wallet extensions:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// Connect to browser wallet (e.g., Phantom, Backpack)
const wallet = window.solana

if (!wallet) {
  alert('Please install a Solana wallet extension')
  return
}

await wallet.connect()

// Make paid requests with connected wallet
const response = await x402Client({
  url: 'https://api.example.com/premium/data',
  wallet: wallet
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
              className="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">View Complete Examples</h3>
              <p className="text-gray-700 text-sm">See full React and Node.js applications</p>
            </a>
            <a 
              href="/quickstart/express" 
              className="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Build a Server</h3>
              <p className="text-gray-700 text-sm">Create an x402-enabled API to consume</p>
            </a>
            <a 
              href="/troubleshooting" 
              className="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
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

export default AxiosClient;
