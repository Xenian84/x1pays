import { Link } from 'react-router-dom'
import { Zap, Shield, Code, DollarSign, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'

export default function Home() {
  const exampleCode = `import { x402Client } from "@x1pays/client/axios";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(yourSecretKey);

const response = await x402Client({
  url: "https://api.x1pays.xyz/premium/data",
  method: "GET",
  wallet: wallet
});

console.log(response.data);        // Your data
console.log(response.payment);     // Payment proof`

  return (
    <div className="bg-white">
      {/* Hero Section - PayAI Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>X1-first, multi-network x402 facilitator</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6">
              Instant, Invisible
              <span className="block mt-2 bg-gradient-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent">
                Payments
              </span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Accept payments from <span className="font-bold text-white">$0.001</span> in under a second. 
              Perfect for AI agents, microtransactions, and lightning-fast commerce — <span className="font-bold text-green-300">live on X1</span>.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/docs/getting-started"
                className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-green-500/20"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/echo"
                className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 transition-all duration-200"
              >
                Try x402 Echo
              </Link>
            </div>
            
            {/* Live Stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">0%</div>
                <div className="text-indigo-200 text-sm">Protocol Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">&lt;1s</div>
                <div className="text-indigo-200 text-sm">Settlement Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">$0.001</div>
                <div className="text-indigo-200 text-sm">Minimum Payment</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlight Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why X1Pays?
            </h2>
            <p className="text-xl text-gray-600">
              Built for developers who want instant, gasless payments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-4 bg-green-500 rounded-xl text-white mb-6">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Zero Protocol Fees
              </h3>
              <p className="text-gray-700 text-lg mb-4">
                <span className="font-bold text-green-600">0%</span> fees for merchants and buyers. We cover all gas costs.
                Revenue comes from <span className="font-semibold">$XPY token</span> appreciation.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>100% of payments to merchant</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Gas fees covered by X1Pays</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Lower than Stripe's 2.9%</span>
                </li>
              </ul>
            </div>

            <div className="relative p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-xl text-white mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Lightning Fast Settlement
              </h3>
              <p className="text-gray-700 text-lg mb-4">
                Payments settle in <span className="font-bold text-indigo-600">&lt;1 second</span> on X1 blockchain.
                No waiting days for funds.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-3" />
                  <span>Instant finality on X1</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-3" />
                  <span>No chargebacks ever</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-3" />
                  <span>Perfect for AI agents</span>
                </li>
              </ul>
            </div>

            <div className="relative p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-xl text-white mb-6">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                1-Line Integration
              </h3>
              <p className="text-gray-700 text-lg mb-4">
                Add x402 payments with <span className="font-bold text-blue-600">one line of code</span>.
                No complex setup or API keys.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Simple SDK for Node.js</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Works with any HTTP client</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                  <span>5 minute setup time</span>
                </li>
              </ul>
            </div>

            <div className="relative p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-4 bg-purple-600 rounded-xl text-white mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Cryptographically Secure
              </h3>
              <p className="text-gray-700 text-lg mb-4">
                Ed25519 signatures verify every payment before access.
                <span className="font-bold text-purple-600"> No trust required</span>.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3" />
                  <span>Signature verification</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3" />
                  <span>On-chain settlement proof</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3" />
                  <span>No intermediary custody</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example Section */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Simple to Integrate
            </h2>
            <p className="text-xl text-gray-400">
              Add x402 micropayments to your API in minutes
            </p>
          </div>
          <CodeBlock code={exampleCode} language="typescript" filename="client.ts" />
          <div className="mt-8 flex justify-center">
            <Link
              to="/docs/api-reference"
              className="text-green-400 hover:text-green-300 font-medium inline-flex items-center text-lg"
            >
              View full API documentation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to payment-gated APIs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '1',
                title: 'Request Without Payment',
                description: 'Client requests your API endpoint. Server returns HTTP 402 with payment details in wXNT.',
                color: 'indigo'
              },
              {
                step: '2',
                title: 'Sign & Pay',
                description: 'Client signs payment intent with their wallet and includes X-PAYMENT header in retry.',
                color: 'purple'
              },
              {
                step: '3',
                title: 'Instant Settlement',
                description: 'X1Pays verifies signature, settles on X1 blockchain (<1s), and API grants access.',
                color: 'green'
              }
            ].map((item, index) => (
              <div key={index} className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white text-2xl font-bold mb-6 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to accept instant payments?
          </h2>
          <p className="text-xl sm:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join the payment revolution. <span className="font-bold text-white">Zero fees</span>, instant settlement, built for the AI age.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/docs/getting-started"
              className="inline-flex items-center px-10 py-5 text-lg font-bold rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-green-400/30"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
            <Link
              to="/echo"
              className="inline-flex items-center px-10 py-5 text-lg font-bold rounded-lg text-white bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white/20 transition-all duration-200"
            >
              Try Live Demo
            </Link>
          </div>
          <p className="mt-8 text-indigo-200 text-sm">
            No credit card required • 100% refund on test transactions • Gas fees covered
          </p>
        </div>
      </div>
    </div>
  )
}
