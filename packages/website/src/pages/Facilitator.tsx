const Facilitator = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          X1‑first payment facilitator.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Process x402 payments on X1 blockchain with one drop‑in endpoint. 
          No API keys, no blockchain headaches—just plug and play.
        </p>
        
        <div className="bg-gray-900 rounded-lg p-4 max-w-2xl mx-auto mb-8 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Facilitator URL</span>
            <button 
              onClick={() => navigator.clipboard.writeText('https://facilitator.x1pays.network')}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Copy
            </button>
          </div>
          <code className="text-green-400 text-sm md:text-base">
            https://facilitator.x1pays.network
          </code>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a 
            href="#get-started" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start in 2m
          </a>
          <a 
            href="/getting-started" 
            className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors"
          >
            Docs
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>0% protocol fees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Gas fees covered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>No API keys required</span>
          </div>
        </div>
      </div>

      {/* Quick Setup Section */}
      <div id="get-started" className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Drop‑in setup.
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Point your merchant at the facilitator and you're done.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-2">Set <code className="px-2 py-1 bg-gray-100 rounded text-sm">FACILITATOR_URL=https://facilitator.x1pays.network</code> in your server.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-2">Choose a <strong>network</strong>:</p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <code className="text-sm text-gray-800">
                    x1-mainnet, x1-devnet
                  </code>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-gray-700">Ship. The facilitator verifies & settles payments on your behalf.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-2xl">🚀</span>
              <span className="ml-2 text-blue-900 font-medium">X1 Blockchain</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">X1‑native</h3>
              <p className="text-gray-600">
                Built specifically for X1 blockchain with wXNT token support. Optimized for the fastest settlement times and lowest gas costs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Any token</h3>
              <p className="text-gray-600">
                Use wXNT stablecoin or your own tokens. Configure per‑endpoint pricing in fiat or atomic units.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">0% fees</h3>
              <p className="text-gray-600">
                100% of payments go to merchants. No protocol fees, no hidden costs. We cover blockchain gas fees for both buyers and merchants.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">1‑second start</h3>
              <p className="text-gray-600">
                No API keys. Just plug & play. Start with a single env var and standard endpoints (<code>/verify</code>, <code>/settle</code>).
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Consistent API</h3>
              <p className="text-gray-600">
                One simple interface. You get reliability, observability, and reuse across multiple merchants and apps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Built for scale</h3>
              <p className="text-gray-600">
                Designed for human & agentic use‑cases. From pay‑per‑call APIs to AI agents, settle payments in under a second.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Merchants Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Merchants</h2>
          <p className="text-lg text-gray-600 mb-12 text-center">Set up your resource server.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="/quickstart/express" 
              className="block bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Express Quickstart</h3>
              <p className="text-gray-700">Get started with Express.js in minutes.</p>
            </a>

            <a 
              href="/quickstart/hono" 
              className="block bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hono</h3>
              <p className="text-gray-700">Quickstart for building an x402-enabled server with Hono.</p>
            </a>

            <a 
              href="/quickstart/servers" 
              className="block bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200 hover:border-green-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">All Server Options</h3>
              <p className="text-gray-700">Explore all available server frameworks.</p>
            </a>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Clients</h2>
          <p className="text-lg text-gray-600 mb-12 text-center">Buyers: make paid calls automatically.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="/quickstart/axios" 
              className="block bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Axios Client</h3>
              <p className="text-gray-700">TypeScript client with Axios for HTTP requests.</p>
            </a>

            <a 
              href="/quickstart/fetch" 
              className="block bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-2 border-red-200 hover:border-red-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fetch Client</h3>
              <p className="text-gray-700">TypeScript client using native Fetch API.</p>
            </a>

            <a 
              href="/quickstart/clients" 
              className="block bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">All Client Options</h3>
              <p className="text-gray-700">Explore all available client frameworks.</p>
            </a>
          </div>
        </div>
      </div>

      {/* Try It Free */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Try it free</h2>
          <p className="text-lg text-gray-600 mb-12 text-center">Run real payments—instantly refunded.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="/echo" 
              className="block bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Echo Merchant</h3>
              <p className="text-gray-700">Test the complete payment flow with our demo merchant.</p>
            </a>

            <a 
              href="/getting-started#echo" 
              className="block bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Echo Merchant Docs</h3>
              <p className="text-gray-700">Learn how the demo merchant works under the hood.</p>
            </a>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Pricing</h2>
          <p className="text-lg text-gray-600 mb-12 text-center">Choose a plan that fits your volume.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Most popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">FREE</h3>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>100,000 settlements per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>4 requests per second</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>480 burst requests per minute</span>
                </li>
              </ul>
              <div className="text-3xl font-bold text-gray-900 mb-4">0 $XPY</div>
              <p className="text-sm text-gray-600">Default plan</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Coming soon
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">BASIC</h3>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>500,000 settlements per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>10 requests per second</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>1200 burst requests per minute</span>
                </li>
              </ul>
              <div className="text-3xl font-bold text-gray-900 mb-4">$1500 worth of $XPY</div>
              <button className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed">
                Coming soon
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Coming soon
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">PRO</h3>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>1M settlements per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>25 requests per second</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>3000 burst requests per minute</span>
                </li>
              </ul>
              <div className="text-3xl font-bold text-gray-900 mb-4">$2800 worth of $XPY</div>
              <button className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation & Support */}
      <div className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentation</h2>
              <p className="text-gray-600 mb-6">Everything you need to integrate x402 with X1Pays.</p>
              <ul className="space-y-3">
                <li>
                  <a href="/getting-started" className="text-blue-600 hover:text-blue-700 hover:underline">
                    Facilitator Overview
                  </a>
                </li>
                <li>
                  <a href="/getting-started" className="text-blue-600 hover:text-blue-700 hover:underline">
                    Quickstart
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-blue-600 hover:text-blue-700 hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/examples" className="text-blue-600 hover:text-blue-700 hover:underline">
                    Code Examples
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Support</h2>
              <p className="text-gray-600 mb-6">We're here to help.</p>
              <a 
                href="https://discord.gg/x1pays" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilitator;
