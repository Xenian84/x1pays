import { Link } from 'react-router-dom'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import BoltIcon from '@mui/icons-material/Bolt'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const Pricing = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6">
          <BoltIcon sx={{ fontSize: 16, mr: 1 }} />
          Zero Protocol Fees Forever
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Pay Nothing.
          <br />
          Keep Everything.
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
          X1Pays charges <span className="font-bold text-green-600">0% fees</span> and covers all gas costs.
          We monetize via <span className="font-bold text-purple-600">$XPY token</span> appreciation, not your revenue.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {/* For Users */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:border-indigo-300 transition-all duration-300">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">For Users</h3>
            <div className="text-5xl font-bold text-indigo-600 my-6">
              Pay Per Use
            </div>
            <p className="text-gray-600 text-lg">
              Only pay for API calls you make. Zero monthly fees, zero hidden costs.
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Pay only for what you use</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Instant payment verification</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">No API keys to manage</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Blockchain-verified receipts</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700"><span className="font-bold">Gas fees covered</span> by X1Pays</span>
            </li>
          </ul>
        </div>

        {/* For Merchants - Highlighted */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 transform lg:scale-105 shadow-2xl border-2 border-indigo-400">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>
          </div>
          <div className="text-center mb-8 mt-2">
            <h3 className="text-2xl font-bold mb-2">For Merchants</h3>
            <div className="text-6xl font-bold my-6">
              0%
            </div>
            <p className="text-indigo-100 text-lg">
              Keep <span className="font-bold text-white">100%</span> of every payment. 
              We charge absolutely nothing. Ever.
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-300 mr-3 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">Receive 100% of payments</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-300 mr-3 flex-shrink-0 mt-0.5" />
              <span>Instant settlement (&lt;1 second)</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-300 mr-3 flex-shrink-0 mt-0.5" />
              <span>No chargebacks, ever</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-300 mr-3 flex-shrink-0 mt-0.5" />
              <span>Free integration support</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-300 mr-3 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">Gas fees covered by X1Pays</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-green-300 mr-3 flex-shrink-0 mt-0.5" />
              <span>Real-time analytics dashboard</span>
            </li>
          </ul>
          <div className="mt-8">
            <Link
              to="/docs/getting-started"
              className="block w-full py-4 bg-white text-indigo-600 text-center font-bold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg"
            >
              Start Accepting Payments
            </Link>
          </div>
        </div>

        {/* For $XPY Holders */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 hover:shadow-2xl hover:border-purple-300 transition-all duration-300">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">For $XPY Holders</h3>
            <div className="flex items-center justify-center text-5xl font-bold text-purple-600 my-6">
              <TrendingUpIcon sx={{ fontSize: 48, mr: 1.5 }} />
              Earn
            </div>
            <p className="text-gray-700 text-lg">
              Hold $XPY to capture protocol value and participate in governance.
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Token appreciation from protocol growth</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Vote on protocol changes</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Treasury-backed value</span>
            </li>
            <li className="flex items-start">
              <CheckIcon sx={{ fontSize: 24 }} className="text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Exclusive holder benefits</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                Coming Soon: Staking Rewards
              </span>
            </li>
          </ul>
          <div className="mt-8">
            <Link
              to="/token-economy"
              className="block w-full py-4 bg-purple-600 text-white text-center font-bold rounded-lg hover:bg-purple-700 transition-all duration-200"
            >
              Learn About $XPY
            </Link>
          </div>
        </div>
      </div>

      {/* How We Make Money */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 mb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">How X1Pays Makes Money</h2>
          <p className="text-xl text-gray-700 text-center mb-8">
            We don't charge transaction fees. Our revenue model is simple and aligned with your success.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-3">$XPY Token</div>
              <p className="text-gray-700">
                X1Pays holds $XPY tokens. As protocol usage grows, <span className="font-semibold">$XPY value increases</span> from:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Increased demand from ecosystem growth</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Governance rights for protocol decisions</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Future staking rewards and utility</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-3">Premium Services</div>
              <p className="text-gray-700">
                Once we achieve market leadership, we'll offer <span className="font-semibold">optional premium features</span>:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics & reporting</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support & SLA guarantees</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>White-label solutions for enterprises</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-4 italic">Core payments always free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Comparison */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-20 shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Cost Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-4 px-6 font-bold text-gray-900">Provider</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900">Transaction Fee</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900">Gas Fees</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900">Settlement</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900">Chargebacks</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <td className="py-4 px-6 font-bold text-green-700 text-lg">
                  <div className="flex items-center">
                    <CheckIcon sx={{ fontSize: 20 }} className="text-green-600 mr-2" />
                    X1Pays
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                    0%
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                    Covered
                  </span>
                </td>
                <td className="py-4 px-6 font-semibold text-green-600">&lt;1 second</td>
                <td className="py-4 px-6">
                  <CloseIcon sx={{ fontSize: 20 }} className="text-green-600" />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 text-gray-700">Stripe</td>
                <td className="py-4 px-6 text-gray-700">2.9% + $0.30</td>
                <td className="py-4 px-6 text-gray-700">N/A</td>
                <td className="py-4 px-6 text-gray-700">2-7 days</td>
                <td className="py-4 px-6">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-red-500" />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 text-gray-700">PayPal</td>
                <td className="py-4 px-6 text-gray-700">3.49% + $0.49</td>
                <td className="py-4 px-6 text-gray-700">N/A</td>
                <td className="py-4 px-6 text-gray-700">1-3 days</td>
                <td className="py-4 px-6">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-red-500" />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 text-gray-700">PayAI.network</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    0%
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    Covered
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-700">~2 seconds</td>
                <td className="py-4 px-6">
                  <CloseIcon sx={{ fontSize: 20 }} className="text-blue-600" />
                </td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-4 px-6 text-gray-500 italic">Traditional Processor</td>
                <td className="py-4 px-6 text-gray-500">2-4%</td>
                <td className="py-4 px-6 text-gray-500">N/A</td>
                <td className="py-4 px-6 text-gray-500">1-5 days</td>
                <td className="py-4 px-6">
                  <CheckIcon sx={{ fontSize: 20 }} className="text-red-400" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-center text-gray-600 mt-6">
          <span className="font-semibold">X1 blockchain advantage:</span> Lower gas fees than Ethereum, faster than Solana for finality
        </p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-12 text-center shadow-2xl">
        <h3 className="text-4xl font-bold mb-4">Start Accepting Payments Today</h3>
        <p className="text-2xl mb-8 text-indigo-100">
          <span className="font-bold">0%</span> fees. <span className="font-bold">0</span> gas costs. <span className="font-bold">100%</span> of payments to you.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/docs/getting-started"
            className="px-10 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center"
          >
            Integrate Now
            <BoltIcon sx={{ fontSize: 20, ml: 1 }} />
          </Link>
          <Link
            to="/echo"
            className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-200"
          >
            Try Demo
          </Link>
        </div>
        <p className="mt-6 text-indigo-200">
          No credit card • No setup fees • 5 minute integration
        </p>
      </div>
    </div>
  )
}

export default Pricing
