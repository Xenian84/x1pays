import { Link } from 'react-router-dom'
import { Book, Rocket, Code, Coins } from 'lucide-react'

export default function Docs() {
  const sections = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Getting Started',
      description: 'Quick start guide to integrating X1Pays into your project',
      link: '/docs/getting-started',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'API Reference',
      description: 'Complete API documentation for facilitator and client SDK',
      link: '/docs/api-reference',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: 'Token Economy',
      description: 'Dual-token model: wXNT for settlement, $XPY for governance',
      link: '/docs/token-economy',
      color: 'bg-green-100 text-green-600'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <Book className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Documentation</h1>
        </div>
        <p className="text-xl text-gray-600">
          Everything you need to integrate HTTP 402 micropayments into your application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sections.map((section, index) => (
          <Link
            key={index}
            to={section.link}
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200"
          >
            <div className={`inline-flex items-center justify-center p-3 ${section.color} rounded-md mb-4`}>
              {section.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {section.title}
            </h3>
            <p className="text-gray-600">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What is x402?</h2>
        <p className="text-gray-700 mb-4">
          HTTP 402 (Payment Required) is a standard HTTP status code reserved for digital micropayments.
          X1Pays implements this protocol using:
        </p>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-primary rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
            <span><strong>X1 Blockchain</strong> - High-performance L1 with low transaction fees</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-primary rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
            <span><strong>wXNT Tokens</strong> - SPL token standard for seamless payments</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-primary rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
            <span><strong>Ed25519 Signatures</strong> - Cryptographic verification of payment authorization</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-primary rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">✓</span>
            <span><strong>Facilitator Pattern</strong> - Sponsors transaction fees while maintaining security</span>
          </li>
        </ul>
      </div>

      <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Architecture</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            X1Pays is built as a TypeScript monorepo with three main packages:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Facilitator</h3>
              <p className="text-sm text-gray-600">
                Verifies payment signatures and settles wXNT token transfers on X1 blockchain.
                Provides /supported, /verify, and /settle endpoints.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Server</h3>
              <p className="text-sm text-gray-600">
                Express-based server with x402 middleware that returns HTTP 402 until valid
                payment is provided. Includes x420 rate limiting.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Client SDK</h3>
              <p className="text-sm text-gray-600">
                JavaScript/TypeScript library for browsers and Node.js that handles payment
                signing and x402 handshake automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ MVP vs Production</h3>
        <p className="text-yellow-800">
          The current implementation is an MVP that demonstrates the x402 protocol.
          For production deployment, please review the{' '}
          <code className="bg-yellow-100 px-2 py-1 rounded">PRODUCTION_NOTES.md</code>{' '}
          file for critical security considerations including delegate approval patterns,
          replay attack prevention, and comprehensive validation.
        </p>
      </div>
    </div>
  )
}
