import { Link } from 'react-router-dom'
import { Zap, Shield, Code, DollarSign, ArrowRight } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Payments',
      description: 'Micropayments settled in seconds on X1 blockchain with minimal fees'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Verified',
      description: 'Ed25519 signatures ensure payment authenticity before access is granted'
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Easy Integration',
      description: 'Simple SDK and middleware for Node.js, browsers, and any HTTP client'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Pay-Per-Use',
      description: 'No subscriptions or upfront costs - users pay only for what they use'
    }
  ]

  const exampleCode = `import { getWithPayment } from "@x1pays/sdk";
import { Keypair } from "@solana/web3.js";

const payer = Keypair.fromSecretKey(yourSecretKey);

const data = await getWithPayment(
  "https://api.x1pays.xyz/premium/data",
  payer,
  {
    facilitatorUrl: "https://facilitator.x1pays.xyz",
    payTo: process.env.MERCHANT_WALLET,
    asset: process.env.WXNT_MINT,
    amountAtomic: "1000" // 0.001 wXNT
  }
);

console.log(data); // Access granted!`

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Micropayments for the
              <span className="block gradient-text mt-2">Modern Web</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              X1Pays implements HTTP 402 Payment Required using wXNT tokens on X1 blockchain.
              Enable pay-per-use APIs with instant settlement and minimal fees.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/docs/getting-started"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center px-8 py-3 border-2 border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50 transition-all duration-200"
              >
                View Docs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
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
              className="text-primary hover:text-indigo-400 font-medium inline-flex items-center"
            >
              View full API documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why X1Pays?
            </h2>
            <p className="text-xl text-gray-600">
              Built for developers who want to monetize APIs without subscriptions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative p-6 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-md text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to payment-gated APIs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Request Without Payment',
                description: 'Client requests your API endpoint. Server returns HTTP 402 with payment details.'
              },
              {
                step: '2',
                title: 'Sign & Pay',
                description: 'Client signs payment intent with their wallet and includes X-PAYMENT header in retry.'
              },
              {
                step: '3',
                title: 'Verify & Grant Access',
                description: 'Facilitator verifies signature, settles wXNT transfer, and API grants access.'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-primary/30" style={{ transform: 'translateX(-50%)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to monetize your API?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Get started with X1Pays in minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/docs/getting-started"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://github.com/x1pays/x1pays"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-all duration-200"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
