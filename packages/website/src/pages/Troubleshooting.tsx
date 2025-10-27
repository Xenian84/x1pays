const Troubleshooting = () => {
  const issues = [
    {
      category: "Payment Verification Errors",
      icon: "🔐",
      problems: [
        {
          title: "Invalid Signature Error",
          symptoms: ["HTTP 402 with 'Invalid signature' message", "Payment rejected immediately"],
          causes: [
            "Signature created with wrong private key",
            "Payment data modified after signing",
            "Timestamp expired (> 5 minutes old)",
            "Incorrect signature encoding"
          ],
          solutions: [
            "Verify you're using the correct wallet private key",
            "Ensure payment object matches exactly what was signed",
            "Generate fresh signatures (don't reuse old ones)",
            "Check that signature is base64-encoded Ed25519 format",
            "Example: const sig = ed.sign(JSON.stringify(payment), privateKey)"
          ]
        },
        {
          title: "Insufficient Payment Amount",
          symptoms: ["402 response: 'Amount too low'", "Payment verification fails"],
          causes: [
            "Payment amount less than required by endpoint",
            "Fee not included in payment calculation"
          ],
          solutions: [
            "Check the 'amount' field in HTTP 402 response",
            "Ensure you're sending exact amount or more",
            "Remember: merchant sets the price, not the protocol"
          ]
        },
        {
          title: "Recipient Mismatch",
          symptoms: ["Payment sent but not accepted", "Wrong recipient error"],
          causes: [
            "Payment sent to wrong wallet address",
            "Merchant wallet configuration incorrect"
          ],
          solutions: [
            "Verify merchant's wallet address from 402 response",
            "Check MERCHANT_WALLET env variable on server",
            "Ensure 'to' field in payment matches merchant address"
          ]
        }
      ]
    },
    {
      category: "Settlement Issues",
      icon: "⛓️",
      problems: [
        {
          title: "Payment Verifies But Doesn't Settle",
          symptoms: ["Signature valid but no blockchain transaction", "Settlement timeout"],
          causes: [
            "Facilitator not configured correctly",
            "Simulation mode enabled in production",
            "RPC connection issues"
          ],
          solutions: [
            "Check Facilitator logs for errors",
            "Verify PAYTO_ADDRESS (merchant wallet) is set in API",
            "Ensure X1_RPC_URL is reachable",
            "Check if NODE_ENV=development (enables simulation)",
            "Verify FEE_PAYER wallet has funds for gas costs"
          ]
        },
        {
          title: "Transaction Failed on Blockchain",
          symptoms: ["Settlement attempted but transaction reverted", "Blockchain error in logs"],
          causes: [
            "Insufficient gas/funds in merchant wallet",
            "Invalid token contract address",
            "Network congestion"
          ],
          solutions: [
            "Ensure merchant wallet has native XNT for gas",
            "Verify wXNT token contract address is correct",
            "Check X1 network status",
            "Review transaction hash on X1 explorer"
          ]
        }
      ]
    },
    {
      category: "Integration Problems",
      icon: "🔧",
      problems: [
        {
          title: "Middleware Not Intercepting Requests",
          symptoms: ["No 402 response on premium routes", "Requests bypass payment check"],
          causes: [
            "Middleware not applied to route",
            "Route defined before middleware",
            "Incorrect middleware order"
          ],
          solutions: [
            "Ensure x402Middleware is applied: app.use('/premium', x402Middleware, router)",
            "Check middleware comes before route handlers",
            "Verify route path matches middleware application",
            "Example: app.use('/api/premium', x402, premiumRoutes)"
          ]
        },
        {
          title: "CORS Errors with Payment Headers",
          symptoms: ["Browser blocks X-Payment header", "Payment data not accessible"],
          causes: [
            "CORS not configured for custom headers",
            "Payment header not in Access-Control-Expose-Headers"
          ],
          solutions: [
            "Add to CORS config: exposedHeaders: ['X-Payment', 'X-Payment-Response']",
            "Enable credentials if needed: credentials: true",
            "Ensure API domain matches or is in allowed origins"
          ]
        },
        {
          title: "Environment Variables Not Loading",
          symptoms: ["Undefined MERCHANT_WALLET", "Missing configuration errors"],
          causes: [
            ".env file not in correct location",
            "Environment variables not loaded",
            "Typos in variable names"
          ],
          solutions: [
            "Place .env in package root (same level as package.json)",
            "Import dotenv: require('dotenv').config()",
            "Check variable names match exactly (case-sensitive)",
            "Restart server after changing .env",
            "Use .env.example as template"
          ]
        }
      ]
    },
    {
      category: "Client SDK Issues",
      icon: "📱",
      problems: [
        {
          title: "Payment Client Creation Fails",
          symptoms: ["Cannot create PaymentClient", "Initialization errors"],
          causes: [
            "Missing API URL configuration",
            "Invalid facilitator URL",
            "Network connectivity issues"
          ],
          solutions: [
            "Verify API_URL is correct and reachable",
            "Check facilitator is running and accessible",
            "Test connectivity: curl $FACILITATOR_URL/health",
            "Ensure URLs include protocol (http:// or https://)"
          ]
        },
        {
          title: "Auto-Payment Not Working",
          symptoms: ["Requests fail even with wallet configured", "No automatic payment"],
          causes: [
            "Wallet not properly initialized",
            "Insufficient wXNT balance",
            "Private key format incorrect"
          ],
          solutions: [
            "Check wallet initialization: new Wallet(privateKey)",
            "Verify wallet has wXNT tokens",
            "Ensure private key is valid Ed25519 format",
            "Test manual payment first before auto-payment"
          ]
        }
      ]
    },
    {
      category: "Testing & Development",
      icon: "🧪",
      problems: [
        {
          title: "Want to Test Without Real Tokens",
          symptoms: ["Need to test without blockchain costs"],
          causes: [],
          solutions: [
            "Set NODE_ENV=development in .env",
            "Facilitator will simulate settlements",
            "All signatures still verified (security maintained)",
            "No actual blockchain transactions occur",
            "Response includes 'simulated: true' flag"
          ]
        },
        {
          title: "How to Debug Payment Flow",
          symptoms: ["Need to see what's happening"],
          causes: [],
          solutions: [
            "Enable debug logging in facilitator",
            "Check X-Payment-Response header in successful requests",
            "Examine facilitator /settle response",
            "Use browser dev tools Network tab",
            "Log payment object before signing",
            "Verify signature matches: console.log(signature)"
          ]
        }
      ]
    }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Troubleshooting Guide</h1>
        <p className="text-xl text-gray-600">
          Solutions to common issues when integrating x402 payments
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Debugging Tips</h3>
        <ul className="space-y-1 text-blue-800 text-sm">
          <li>• Check facilitator logs first - most errors show up there</li>
          <li>• Verify all environment variables are set correctly</li>
          <li>• Use simulation mode (NODE_ENV=development) for testing</li>
          <li>• Inspect HTTP 402 response - it contains required payment details</li>
          <li>• Check X-Payment-Response header for settlement info</li>
        </ul>
      </div>

      <div className="space-y-8">
        {issues.map((category, catIndex) => (
          <div key={catIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <span className="text-3xl mr-3">{category.icon}</span>
                {category.category}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {category.problems.map((problem, probIndex) => (
                <div key={probIndex} className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {problem.title}
                  </h3>
                  
                  {problem.symptoms.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-red-600 mb-1">Symptoms:</h4>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {problem.symptoms.map((symptom, i) => (
                          <li key={i}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {problem.causes.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-orange-600 mb-1">Common Causes:</h4>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {problem.causes.map((cause, i) => (
                          <li key={i}>{cause}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-green-600 mb-1">Solutions:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      {problem.solutions.map((solution, i) => (
                        <li key={i} className="leading-relaxed">{solution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-3">Still stuck?</h3>
        <p className="mb-6 text-purple-50">
          If you can't find a solution here, check our documentation or reach out to the community.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/docs/api-reference"
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            API Reference
          </a>
          <a
            href="/faq"
            className="px-6 py-3 bg-purple-600 text-white border-2 border-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Check FAQ
          </a>
          <a
            href="https://github.com/x1pays"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
          >
            GitHub Issues
          </a>
        </div>
      </div>
    </div>
  )
}

export default Troubleshooting
