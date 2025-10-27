import { Coins, ArrowRightLeft, Users, TrendingUp, Zap } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'

export default function TokenEconomy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <Coins className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Token Economy</h1>
        </div>
        <p className="text-xl text-gray-600">
          Dual-token model: wXNT for settlement, $XPY for value capture
        </p>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The X1Pays Protocol operates on a <strong>dual-token model</strong> with a revolutionary 0% fee structure. 
          Instead of taking fees from transactions, X1Pays monetizes through <strong>$XPY token appreciation</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg p-6 border border-indigo-200">
            <div className="flex items-center mb-3">
              <ArrowRightLeft className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">wXNT</h3>
            </div>
            <p className="text-sm text-gray-600">Settlement token - merchants receive 100% of payments</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-indigo-200">
            <div className="flex items-center mb-3">
              <Users className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">$XPY</h3>
            </div>
            <p className="text-sm text-gray-600">Governance and value capture token</p>
          </div>
        </div>
      </div>

      {/* Settlement Layer - wXNT */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Settlement Layer — wXNT</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <p className="text-gray-700 mb-4">
            <strong>wXNT (Wrapped XNT)</strong> is the settlement token used for all transactions:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-green-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Every API call or x402 payment is settled in <strong>wXNT</strong>, transferred directly from the user's wallet to the merchant</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-green-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>The facilitator charges <strong>0% protocol fees</strong> - merchants receive 100% of payments</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-green-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>X1Pays covers all gas costs from treasury reserves</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-green-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>wXNT is SPL-compatible and integrates seamlessly with X1 blockchain infrastructure</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Transaction Flow</h3>
          <CodeBlock code={`// User pays 1000 wXNT for API access
Total Payment: 1000 wXNT

Payment Split:
├─ 1000 wXNT → Merchant (100%)
└─ 0 wXNT    → Protocol Fee (0%)

Gas Fees:
└─ Covered by X1Pays Treasury

Settlement:
Instant transfer on X1 blockchain in wXNT`} language="text" />
        </div>
      </div>

      {/* Governance Layer - XPY */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Value Capture — $XPY</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <p className="text-gray-700 mb-4">
            <strong>$XPY</strong> is the governance and value capture token of X1Pays:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>It is <strong>not used for settlement</strong> - only wXNT is accepted for payments</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Appreciates in value as protocol transaction volume grows</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Governs treasury allocation and protocol parameters</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Future staking for governance participation and treasury distributions</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Votes on future asset support (e.g., USDC integration)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Zero Fee Model */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Zero Fee Model</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-700 mb-4">
            When a user pays <strong>100 wXNT</strong> for an API call:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Merchant</span>
                <span className="text-2xl font-bold text-green-600">100%</span>
              </div>
              <p className="text-sm text-gray-600">100 wXNT transferred to merchant</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Protocol Fee</span>
                <span className="text-2xl font-bold text-purple-600">0%</span>
              </div>
              <p className="text-sm text-gray-600">Zero fees charged</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Gas Cost</span>
                <span className="text-2xl font-bold text-blue-600">$0</span>
              </div>
              <p className="text-sm text-gray-600">Covered by X1Pays</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Value Capture:</strong> Instead of charging fees, X1Pays monetizes through $XPY token appreciation. 
                As more transactions flow through the protocol, $XPY holders benefit from increased demand and ecosystem value.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Staking Model */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Future Staking Model</h2>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
          <p className="text-gray-700 mb-4">
            The protocol will introduce <strong>$XPY staking</strong> for governance and rewards:
          </p>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Stake $XPY tokens to participate in protocol governance</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Earn rewards from treasury reserves (funded by token sales and partnerships)</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Lock periods with multipliers for higher governance weight</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Direct participation in protocol development decisions</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Early stakers receive bonus rewards</span>
            </li>
          </ul>
          
          <div className="bg-white rounded-lg p-4 border border-purple-300">
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Coming Soon</h4>
            </div>
            <p className="text-sm text-gray-600">
              Staking functionality is under development. Follow our progress for updates on governance 
              participation and treasury distribution mechanisms.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-900 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
        <p className="text-gray-300 mb-4">
          The 0% fee model is implemented in the facilitator's <code className="bg-gray-800 px-2 py-1 rounded">/settle</code> endpoint:
        </p>
        <CodeBlock code={`// Simple: Transfer 100% to merchant
const totalAmount = BigInt(payment.amount);

// Transfer full amount to merchant (100%)
const tx = await tokenTransferTx({
  from: buyer,
  to: merchant,
  amount: totalAmount  // No fee deduction!
});

// Gas costs covered by X1Pays treasury via FEE_PAYER
await connection.sendTransaction(tx, [feePayer]);`} language="typescript" />
      </div>
    </div>
  )
}
