const Pricing = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">
          Pay-per-use model with no subscriptions, no hidden fees
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">For Users</h3>
            <div className="text-4xl font-bold text-indigo-600 my-6">Pay Per Use</div>
            <p className="text-gray-600 mb-6">
              Only pay for the API requests you make. No monthly fees.
            </p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Pay only for what you use</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Instant payment verification</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>No API keys to manage</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Blockchain-verified receipts</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-2 border-indigo-600 rounded-lg p-8 transform scale-105 shadow-2xl">
          <div className="text-center">
            <div className="inline-block bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold mb-2">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">For Merchants</h3>
            <div className="text-4xl font-bold my-6">1% Protocol Fee</div>
            <p className="text-indigo-100 mb-6">
              Keep 99% of every payment. We only take 1% for protocol operation.
            </p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>Receive 99% of payments</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>No payment processing delays</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>No chargebacks ever</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>Free integration support</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span>Automatic fee splitting</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">For $XPY Holders</h3>
            <div className="text-4xl font-bold text-purple-600 my-6">Earn Rewards</div>
            <p className="text-gray-600 mb-6">
              Stake $XPY to earn protocol fees and governance rights.
            </p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Share in protocol revenue</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Vote on protocol changes</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Earn wXNT from fees</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">⏳</span>
              <span className="text-gray-500">Staking coming soon</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How Fee Distribution Works</h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">User pays</span>
              <span className="text-2xl font-bold text-indigo-600">100 wXNT</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 border-2 border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-green-700">Merchant receives</span>
                <span className="text-2xl font-bold text-green-600">99 wXNT</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '99%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">99% of payment goes to the merchant</p>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-purple-700">Protocol treasury</span>
                <span className="text-2xl font-bold text-purple-600">1 wXNT</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '1%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">1% fee funds protocol development</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Cost Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4">Provider</th>
                <th className="text-left py-3 px-4">Setup Fee</th>
                <th className="text-left py-3 px-4">Transaction Fee</th>
                <th className="text-left py-3 px-4">Chargeback Risk</th>
                <th className="text-left py-3 px-4">Settlement Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 bg-indigo-50">
                <td className="py-3 px-4 font-bold text-indigo-600">X1Pays (x402)</td>
                <td className="py-3 px-4">$0</td>
                <td className="py-3 px-4">1%</td>
                <td className="py-3 px-4">None</td>
                <td className="py-3 px-4">2-3 seconds</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">Stripe</td>
                <td className="py-3 px-4">$0</td>
                <td className="py-3 px-4">2.9% + $0.30</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4">2-7 days</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">PayPal</td>
                <td className="py-3 px-4">$0</td>
                <td className="py-3 px-4">3.49% + $0.49</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4">1-3 days</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">Traditional Processor</td>
                <td className="py-3 px-4">$500-2000</td>
                <td className="py-3 px-4">2-4%</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4">1-5 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-3xl font-bold mb-4">Start Accepting Payments Today</h3>
        <p className="text-xl mb-6 text-green-50">
          No setup fees. No monthly costs. Just 1% per transaction.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/docs/getting-started"
            className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors"
          >
            Integrate Now
          </a>
          <a
            href="/docs"
            className="px-8 py-4 bg-green-600 text-white border-2 border-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
          >
            Read Docs
          </a>
        </div>
      </div>
    </div>
  )
}

export default Pricing
