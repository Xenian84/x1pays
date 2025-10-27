import { useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import CircularProgress from '@mui/material/CircularProgress'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import BoltIcon from '@mui/icons-material/Bolt'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CodeBlock from '../components/CodeBlock'

export default function Echo() {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string>('')

  const curlExample = `curl -X POST https://api.x1pays.xyz/premium/data \\
  -H "Content-Type: application/json" \\
  -H "X-PAYMENT: <your_payment_payload>"

# Response includes X-PAYMENT-RESPONSE header with settlement details
# 100% of payment will be refunded automatically
# X1Pays covers all gas fees`

  const sdkExample = `import { getWithPayment } from "@x1pays/sdk";
import { Keypair } from "@solana/web3.js";

// Try x402 Echo - Get 100% refund
const data = await getWithPayment(
  "https://x402.payai.network/echo",
  payer,
  {
    facilitatorUrl: "https://facilitator.x1pays.xyz",
    payTo: "ECHO_MERCHANT_ADDRESS",
    asset: process.env.WXNT_MINT,
    amountAtomic: "1000" // Will be refunded!
  }
);

console.log(data); // Echo response + refund confirmed`

  const simulateTest = () => {
    setTestStatus('testing')
    setTimeout(() => {
      setTestStatus('success')
      setTxHash(`SIM_TX_${Math.random().toString(36).substring(7).toUpperCase()}`)
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6">
          <BoltIcon sx={{ fontSize: 16, mr: 1 }} />
          Live on X1 Mainnet
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            x402 Echo Merchant
          </span>
        </h1>
        <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-4">
          Test X402 Payments, <span className="font-bold text-green-600">Zero Cost</span>
        </p>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto">
          Run real X402 transactions against a live merchant—for free. 
          Get <span className="font-bold">100% of your payment refunded</span>, with X1Pays covering the network fees.
        </p>
      </div>

      {/* Live Demo Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Test Interface */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Try It Now</h2>
          <p className="text-gray-600 mb-6">
            Click below to simulate a real x402 payment. In production, you'll use our SDK or curl.
          </p>

          {testStatus === 'idle' && (
            <button
              onClick={simulateTest}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Simulate x402 Payment
            </button>
          )}

          {testStatus === 'testing' && (
            <div className="flex items-center justify-center py-8">
              <CircularProgress sx={{ fontSize: 32, mr: 1.5 }} className="text-indigo-600" />
              <span className="text-gray-700 font-medium">Processing payment on X1...</span>
            </div>
          )}

          {testStatus === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <CheckCircleIcon sx={{ fontSize: 24 }} className="text-green-600 mr-2" />
                  <span className="font-bold text-green-700 text-lg">Payment Successful!</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-mono font-semibold">1000 wXNT (0.001)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Settlement:</span>
                    <span className="font-semibold text-green-600">&lt;1 second</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protocol Fee:</span>
                    <span className="font-bold text-green-600">0% (FREE)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gas Fees:</span>
                    <span className="font-semibold text-green-600">Covered by X1Pays</span>
                  </div>
                  <div className="flex justify-between items-start pt-2 border-t border-green-200 mt-2">
                    <span className="text-gray-600">TX Hash:</span>
                    <span className="font-mono text-xs break-all max-w-[200px] text-right">{txHash}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <AttachMoneyIcon sx={{ fontSize: 20 }} className="text-blue-600 mr-2" />
                  <span className="font-bold text-blue-700">Refund Initiated</span>
                </div>
                <p className="text-sm text-gray-700">
                  Your <span className="font-bold">1000 wXNT</span> will be refunded within 1 minute. 
                  X1Pays covers all costs for Echo testing.
                </p>
              </div>

              <button
                onClick={() => setTestStatus('idle')}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Test Again
              </button>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <CancelIcon sx={{ fontSize: 24 }} className="text-red-600 mr-2" />
                <span className="font-bold text-red-700">Payment Failed</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Something went wrong. In production, check your payment signature and wallet balance.
              </p>
              <button
                onClick={() => setTestStatus('idle')}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">How Echo Works</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-bold text-indigo-600 mr-2">1.</span>
                <span>You send a real x402 payment on X1 mainnet</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-indigo-600 mr-2">2.</span>
                <span>Echo merchant verifies and settles instantly</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-indigo-600 mr-2">3.</span>
                <span>You receive 100% refund automatically (gas covered)</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900">What You Get</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><span className="font-semibold">Real blockchain transactions</span> on X1 mainnet</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><span className="font-semibold">100% refund</span> of all test payments</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><span className="font-semibold">Gas fees covered</span> by X1Pays treasury</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><span className="font-semibold">Full x402 flow</span> including verification & settlement</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><span className="font-semibold">Real transaction receipts</span> with on-chain proof</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">0%</div>
                <div className="text-sm text-gray-600 mt-1">Protocol Fee</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Refund Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">&lt;1s</div>
                <div className="text-sm text-gray-600 mt-1">Settlement</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">$0</div>
                <div className="text-sm text-gray-600 mt-1">Gas Cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Integration Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Using cURL</h3>
            <CodeBlock code={curlExample} language="bash" filename="test-echo.sh" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Using X1Pays SDK</h3>
            <CodeBlock code={sdkExample} language="typescript" filename="test-echo.ts" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Build with x402?</h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Start accepting instant payments on your API with zero fees and sub-second settlement.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/docs/getting-started"
            className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg"
          >
            Get Started
            <ArrowForwardIcon sx={{ fontSize: 20, ml: 1 }} />
          </a>
          <a
            href="/docs/examples"
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
          >
            View Examples
          </a>
        </div>
      </div>
    </div>
  )
}
