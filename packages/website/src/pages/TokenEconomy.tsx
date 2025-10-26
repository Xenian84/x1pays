import { Coins, ArrowRightLeft, Users, TrendingUp } from 'lucide-react'
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
          Dual-token model: wXNT for settlement, $XPY for governance
        </p>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The X1Pays Protocol operates on a <strong>dual-token model</strong> designed for the current stage 
          of the X1 blockchain (no stablecoins yet) while remaining forward-compatible with future USDC deployments.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg p-6 border border-indigo-200">
            <div className="flex items-center mb-3">
              <ArrowRightLeft className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">wXNT</h3>
            </div>
            <p className="text-sm text-gray-600">Settlement token for all blockchain transactions</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-indigo-200">
            <div className="flex items-center mb-3">
              <Users className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">$XPY</h3>
            </div>
            <p className="text-sm text-gray-600">Governance and rewards token</p>
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
              <span>Every API call or x402 payment is settled in <strong>wXNT</strong>, transferred directly from the user's wallet to the merchant via the facilitator</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-green-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>The facilitator charges a small protocol fee (default 1%) also in <strong>wXNT</strong></span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-green-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Because wXNT is SPL-compatible, it integrates seamlessly with X1Pays smart contracts and future DEX liquidity</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Transaction Flow</h3>
          <CodeBlock code={`// User pays 1000 wXNT for API access
Total Payment: 1000 wXNT

Payment Split:
├─ 990 wXNT  → Merchant (99%)
└─ 10 wXNT   → Treasury (1%)

Settlement:
Both transfers executed on X1 blockchain in wXNT`} language="text" />
        </div>
      </div>

      {/* Governance Layer - XPY */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Governance and Incentives — $XPY</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <p className="text-gray-700 mb-4">
            <strong>$XPY</strong> is the governance and rewards token of X1Pays:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>It is <strong>not used for settlement</strong> but governs key protocol parameters</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Controls fee percentage (<code className="bg-gray-100 px-1 rounded">FEE_PERCENT</code>)</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Governs treasury allocation and distribution</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Enables staking for protocol fee rewards</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span>Votes on future asset support (e.g., USDC integration)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Fee Distribution */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Fee Distribution</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-700 mb-4">
            When a user pays <strong>100 wXNT</strong> for an API call:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Merchant</span>
                <span className="text-2xl font-bold text-green-600">99%</span>
              </div>
              <p className="text-sm text-gray-600">99 wXNT transferred to merchant</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Treasury</span>
                <span className="text-2xl font-bold text-purple-600">1%</span>
              </div>
              <p className="text-sm text-gray-600">1 wXNT collected for protocol</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                The treasury later distributes accumulated <strong>wXNT rewards</strong> to $XPY stakers 
                or funds protocol development.
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
            The protocol includes placeholder logic for <strong>$XPY staking rewards</strong> (see <code className="bg-purple-100 px-2 py-1 rounded">packages/facilitator/src/rewards.ts</code>):
          </p>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Stake $XPY tokens to earn proportional wXNT fees from the treasury</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Lock periods with multipliers for higher rewards</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Governance voting power based on staked amounts</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">→</span>
              <span>Direct fee sharing from protocol revenue</span>
            </li>
          </ul>
          
          <div className="bg-white rounded-lg p-4 border border-purple-300">
            <h4 className="font-semibold text-gray-900 mb-2">Coming Soon</h4>
            <p className="text-sm text-gray-600">
              Staking functionality is currently in development. Check the rewards module 
              for implementation progress and upcoming features.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-900 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
        <p className="text-gray-300 mb-4">
          The fee splitting is implemented in the facilitator's <code className="bg-gray-800 px-2 py-1 rounded">/settle</code> endpoint:
        </p>
        <CodeBlock code={`// Calculate protocol fee
const feePercent = Number(process.env.FEE_PERCENT || 1);
const totalAmount = BigInt(payment.amount);
const feeAmount = (totalAmount * BigInt(feePercent)) / BigInt(100);
const merchantAmount = totalAmount - feeAmount;

// Transfer to merchant (99%)
const merchantTx = await tokenTransferTx({
  from: buyer,
  to: merchant,
  amount: merchantAmount
});

// Transfer fee to treasury (1%)
const feeTx = await tokenTransferTx({
  from: buyer,
  to: treasury,
  amount: feeAmount
});`} language="typescript" />
      </div>
    </div>
  )
}
