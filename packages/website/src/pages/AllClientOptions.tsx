const AllClientOptions = () => {
  const clients = [
    {
      name: "Axios",
      icon: "📡",
      color: "yellow",
      description: "Popular HTTP client with rich features",
      pros: [
        "Automatic JSON transformation",
        "Built-in timeout and retry logic",
        "Request/response interceptors",
        "Better error handling",
        "Wide browser support"
      ],
      cons: [
        "Additional dependency (~13KB)",
        "Slightly larger bundle size",
        "Less modern than native fetch"
      ],
      bestFor: "Complex applications, teams familiar with Axios, projects needing advanced HTTP features",
      quickstartLink: "/quickstart/axios",
      example: `import { x402Client } from '@x1pays/client/axios'

const response = await x402Client({
  url: 'https://api.example.com/premium',
  method: 'GET',
  wallet: wallet,
  retry: {
    maxRetries: 3,
    retryDelay: 1000
  }
})

console.log(response.data)
console.log(response.payment.txHash)`
    },
    {
      name: "Fetch API",
      icon: "🌐",
      color: "red",
      description: "Native browser API for HTTP requests",
      pros: [
        "Zero dependencies (native)",
        "Smallest bundle size",
        "Modern Promise-based API",
        "Excellent streaming support",
        "Built into all modern browsers"
      ],
      cons: [
        "Manual JSON parsing",
        "No built-in timeout",
        "Less feature-rich than Axios",
        "Requires polyfill for older browsers"
      ],
      bestFor: "Lightweight apps, modern browsers, streaming use cases, minimal dependencies",
      quickstartLink: "/quickstart/fetch",
      example: `import { fetchX402JSON } from '@x1pays/client/fetch'

const response = await fetchX402JSON(
  'https://api.example.com/premium',
  { 
    method: 'GET',
    wallet 
  }
)

console.log(response.data)
console.log(response.payment.txHash)`
    },
    {
      name: "Native Fetch",
      icon: "🚀",
      color: "indigo",
      description: "Manual implementation with native fetch API",
      pros: [
        "Full control over flow",
        "No dependencies",
        "Educational",
        "Maximum flexibility",
        "Best performance"
      ],
      cons: [
        "More code to write",
        "Manual error handling",
        "No built-in retry logic"
      ],
      bestFor: "Learning x402 protocol, custom flows, maximum control",
      quickstartLink: "/quickstart/fetch",
      example: `// 1. Initial request
let res = await fetch(url)

// 2. Handle 402
if (res.status === 402) {
  const req = await res.json()
  
  // 3. Sign payment
  const payment = { /*...*/ }
  const sig = signPayment(payment, wallet)
  
  // 4. Settle with facilitator
  await fetch(\`\${req.facilitatorUrl}/settle\`, {
    method: 'POST',
    body: JSON.stringify({ ...payment, sig })
  })
  
  // 5. Retry with proof
  res = await fetch(url, {
    headers: { 'X-Payment': JSON.stringify(payment) }
  })
}`
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, {bg: string, border: string, hover: string}> = {
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', hover: 'hover:bg-yellow-100' },
      red: { bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:bg-red-100' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', hover: 'hover:bg-indigo-100' }
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <a href="/facilitator" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Facilitator
          </a>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Client Options</h1>
          <p className="text-xl text-gray-600">
            Choose the right HTTP client for consuming x402-enabled APIs.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-12 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Comparison</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">Client</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Bundle Size</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Dependencies</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Features</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Learning Curve</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Axios</td>
                <td className="border border-gray-300 px-4 py-3">~13KB</td>
                <td className="border border-gray-300 px-4 py-3">1 package</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Rich</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐ Easy</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Fetch API</td>
                <td className="border border-gray-300 px-4 py-3">~2KB</td>
                <td className="border border-gray-300 px-4 py-3">Native (0)</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐ Basic</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Very Easy</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">fetch-x402 SDK</td>
                <td className="border border-gray-300 px-4 py-3">~8KB</td>
                <td className="border border-gray-300 px-4 py-3">1 package</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐ Advanced</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐ Moderate</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Client Cards */}
        <div className="space-y-8">
          {clients.map((client) => {
            const colors = getColorClasses(client.color);
            return (
              <div 
                key={client.name}
                className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      <span className="mr-2">{client.icon}</span>
                      {client.name}
                    </h3>
                    <p className="text-gray-700">{client.description}</p>
                  </div>
                  {(client as any).comingSoon && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">✅ Pros</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      {client.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">⚠️ Cons</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      {client.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">🎯 Best For</h4>
                  <p className="text-gray-700 text-sm">{client.bestFor}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Code Example</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">{client.example}</pre>
                  </div>
                </div>

                {!(client as any).comingSoon && (
                  <a 
                    href={client.quickstartLink}
                    className={`inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors`}
                  >
                    View {client.name} Quickstart →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-12 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">Feature</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Axios</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Fetch</th>
                <th className="border border-gray-300 px-4 py-3 text-center">fetch-x402</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Automatic payment handling</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Payment caching</td>
                <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
                <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Request interceptors</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Automatic JSON parsing</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Timeout support</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">⚠️ Manual</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Retry logic</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">⚠️ Manual</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Payment amount safety limit</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">TypeScript support</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Streaming responses</td>
                <td className="border border-gray-300 px-4 py-3 text-center">⚠️ Limited</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
                <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Browser compatibility</td>
                <td className="border border-gray-300 px-4 py-3 text-center">All browsers</td>
                <td className="border border-gray-300 px-4 py-3 text-center">Modern only</td>
                <td className="border border-gray-300 px-4 py-3 text-center">Modern only</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Decision Guide */}
        <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤔 Decision Guide</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <strong>Choose Axios if:</strong> You need advanced HTTP features, want the best developer experience, or are working with a team familiar with Axios.
            </div>
            <div>
              <strong>Choose Fetch API if:</strong> You want the smallest bundle size, prefer zero dependencies, need streaming support, or are building a lightweight application.
            </div>
            <div>
              <strong>Choose fetch-x402 SDK if:</strong> You're building an x402-heavy application, need payment caching, want built-in wallet management, or require advanced x402 features.
            </div>
          </div>
        </div>

        {/* Migration Guide */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Migration Between Clients</h2>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// From Axios
const response = await x402Client({
  url: 'https://api.example.com/data',
  wallet
})

// To Fetch API
const response = await fetchX402(
  'https://api.example.com/data',
  { wallet }
)
const data = await response.json()

// To fetch-x402 SDK
const client = new X402Client({ wallet })
const data = await client.get(
  'https://api.example.com/data'
)`}
            </pre>
          </div>
        </div>

        {/* Next Steps */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/examples" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">View Complete Examples</h3>
              <p className="text-gray-700 text-sm">See full applications using different clients</p>
            </a>
            <a 
              href="/quickstart/servers" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Build a Server</h3>
              <p className="text-gray-700 text-sm">Create an x402-enabled API to consume</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllClientOptions;
