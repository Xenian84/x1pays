import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is x402?",
          a: "x402 is a payment protocol that uses HTTP 402 (Payment Required) status code to enable seamless micropayments for API access. Instead of API keys or subscriptions, users pay per request using cryptocurrency on the X1 blockchain."
        },
        {
          q: "Why X1 blockchain?",
          a: "X1 is a high-performance Layer 1 blockchain with extremely low transaction fees (fractions of a cent) and fast finality. This makes it perfect for micropayments where traditional payment rails would be too expensive."
        },
        {
          q: "Do I need to run my own blockchain node?",
          a: "No! X1Pays provides a Facilitator service that handles all blockchain interactions for you. You just integrate the API middleware and we handle the rest."
        }
      ]
    },
    {
      category: "Payments & Tokens",
      questions: [
        {
          q: "What's the difference between wXNT and $XPY?",
          a: "wXNT is the settlement token - users pay with it for API access. $XPY is the governance and value capture token - holders can stake it for governance rights and future treasury distributions. X1Pays charges 0% protocol fees, so all payments go directly to merchants."
        },
        {
          q: "How much does each payment cost?",
          a: "Payment amounts are set by the merchant (API provider). X1Pays charges 0% protocol fees and covers all gas costs. For example, if an API endpoint costs 100 wXNT, the merchant receives 100 wXNT (100%). Zero fees, instant settlement."
        },
        {
          q: "Where can I get wXNT tokens?",
          a: "wXNT is a wrapped version of XNT (X1's native token). You can get XNT from X1 exchanges and wrap it to wXNT using the official X1 bridge or DEX protocols on X1."
        },
        {
          q: "How does X1Pays make money with 0% fees?",
          a: "X1Pays monetizes through $XPY token appreciation rather than transaction fees. As the protocol grows and more value flows through the network, $XPY holders benefit from increased demand and ecosystem value, not by taking a cut of merchant revenue."
        }
      ]
    },
    {
      category: "Integration",
      questions: [
        {
          q: "How do I integrate x402 into my API?",
          a: "It's simple! Install the x402 middleware, configure your merchant wallet address, and wrap your premium routes. The middleware automatically handles payment verification and settlement. Check our Getting Started guide for detailed steps."
        },
        {
          q: "Can I use x402 with any programming language?",
          a: "Yes! While we provide official SDKs for Node.js/TypeScript, the x402 protocol is just HTTP - any language that can make HTTP requests can integrate. We have examples for Python, Go, and more in our documentation."
        },
        {
          q: "Do my users need a special wallet?",
          a: "Users need any X1-compatible wallet that supports Ed25519 signatures. Popular options include X1 Wallet, Phantom (if X1 support added), or any programmatic wallet using the X1 SDK."
        },
        {
          q: "How long does payment verification take?",
          a: "Payment verification is near-instant (< 1 second) because we verify signatures cryptographically. Blockchain settlement happens in the background and takes 2-3 seconds on X1."
        }
      ]
    },
    {
      category: "Security & Privacy",
      questions: [
        {
          q: "Is x402 secure?",
          a: "Yes! Payments are cryptographically signed using Ed25519 signatures, the same standard used by major blockchains. The Facilitator verifies signatures before settlement, preventing fraud and double-spending."
        },
        {
          q: "What if a user sends an invalid payment?",
          a: "The middleware rejects invalid payments before they reach your API logic. Users receive a 402 response with details about what's wrong (invalid signature, insufficient amount, etc.)."
        },
        {
          q: "Can users reverse payments?",
          a: "No. Blockchain transactions are irreversible once confirmed. This protects merchants from chargebacks while ensuring instant, final settlement."
        },
        {
          q: "Do you store payment data?",
          a: "The Facilitator only processes payments transiently. All payment records exist on the X1 blockchain, which is public and immutable. We don't maintain a centralized payment database."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          q: "Why am I getting 'Invalid signature' errors?",
          a: "This usually means the payment signature doesn't match the payment data. Check that: 1) The signature was created with the correct private key, 2) The payment amount and recipient match exactly, 3) The timestamp is recent (within 5 minutes)."
        },
        {
          q: "Payments verify but don't settle - what's wrong?",
          a: "Check your Facilitator configuration. Ensure PAYTO_ADDRESS (merchant wallet) environment variable is set correctly in your API. In development mode, settlements are simulated by default."
        },
        {
          q: "How do I test without spending real tokens?",
          a: "Use the simulation mode! Set your environment to development and the Facilitator will simulate settlements without actual blockchain transactions. Perfect for testing your integration."
        },
        {
          q: "Can I refund a payment?",
          a: "x402 doesn't have built-in refunds since blockchain transactions are irreversible. However, you can manually send tokens back to a user's wallet address if needed for customer service reasons."
        }
      ]
    }
  ]

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  let questionIndex = 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">
          Everything you need to know about x402 payments on X1 blockchain
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((category, catIndex) => (
          <div key={catIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((faq) => {
                const currentIndex = questionIndex++
                const isOpen = openIndex === currentIndex
                
                return (
                  <div key={currentIndex} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                    <button
                      onClick={() => toggleQuestion(currentIndex)}
                      className="w-full text-left py-3 flex justify-between items-start hover:text-indigo-600 transition-colors"
                    >
                      <span className="font-medium pr-8">{faq.q}</span>
                      <span className="text-2xl text-gray-400 flex-shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-3 text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-semibold mb-3">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Check out our documentation or join our community.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/docs"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Read the Docs
          </a>
          <a
            href="https://github.com/x1pays"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            GitHub Community
          </a>
        </div>
      </div>
    </div>
  )
}

export default FAQ
