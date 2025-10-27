const AllServerOptions = () => {
  const frameworks = [
    {
      name: "Express.js",
      icon: "🚂",
      color: "green",
      description: "The most popular Node.js web framework",
      pros: [
        "Massive ecosystem and community",
        "Extensive middleware library",
        "Well-documented and battle-tested",
        "Easy to learn for beginners"
      ],
      cons: [
        "Slower than modern alternatives",
        "Callback-based (older pattern)",
        "Less type-safe without TypeScript setup"
      ],
      bestFor: "Traditional REST APIs, established projects, teams familiar with Express",
      quickstartLink: "/quickstart/express",
      example: `import express from 'express'
import { x402Middleware } from '@x1pays/x402-middleware'

const app = express()
const payment = x402Middleware({ /* config */ })

app.get('/premium', payment, (req, res) => {
  res.json({ data: 'paid content' })
})`
    },
    {
      name: "Hono",
      icon: "🔥",
      color: "purple",
      description: "Ultra-fast, lightweight, edge-ready framework",
      pros: [
        "4x faster than Express",
        "Edge-ready (Cloudflare Workers, Deno, Bun)",
        "Tiny bundle size",
        "Built-in TypeScript support",
        "Modern API design"
      ],
      cons: [
        "Smaller ecosystem than Express",
        "Newer, less battle-tested",
        "Fewer third-party middleware options"
      ],
      bestFor: "Edge deployments, high-performance APIs, modern TypeScript projects",
      quickstartLink: "/quickstart/hono",
      example: `import { Hono } from 'hono'
import { x402 } from '@x1pays/x402-middleware/hono'

const app = new Hono()
const payment = x402({ /* config */ })

app.get('/premium', payment, (c) => {
  return c.json({ data: 'paid content' })
})`
    },
    {
      name: "Fastify",
      icon: "⚡",
      color: "blue",
      description: "High-performance framework with schema validation",
      pros: [
        "Very fast (2x+ faster than Express)",
        "Built-in schema validation",
        "Excellent TypeScript support",
        "Plugin architecture",
        "Low overhead"
      ],
      cons: [
        "Stricter than Express (more opinionated)",
        "Smaller community than Express",
        "Different mental model from Express"
      ],
      bestFor: "High-throughput APIs, microservices, performance-critical applications",
      quickstartLink: "#",
      comingSoon: true,
      example: `import Fastify from 'fastify'
import { x402Plugin } from '@x1pays/x402-middleware/fastify'

const fastify = Fastify()
await fastify.register(x402Plugin, { /* config */ })

fastify.get('/premium', {
  preHandler: fastify.x402Payment
}, async (request, reply) => {
  return { data: 'paid content' }
})`
    },
    {
      name: "Next.js API Routes",
      icon: "▲",
      color: "gray",
      description: "API routes within Next.js applications",
      pros: [
        "Integrated with Next.js frontend",
        "Serverless-friendly",
        "TypeScript support out of the box",
        "Great for full-stack apps"
      ],
      cons: [
        "Tied to Next.js ecosystem",
        "Cold start latency in serverless",
        "Less flexible than standalone servers"
      ],
      bestFor: "Full-stack Next.js applications, serverless deployments",
      quickstartLink: "#",
      comingSoon: true,
      example: `// pages/api/premium.ts
import { x402Handler } from '@x1pays/x402-middleware/nextjs'

export default x402Handler({
  amount: '1000000',
  handler: async (req, res) => {
    const payment = req.x402Payment
    res.json({ data: 'paid content' })
  }
})`
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, {bg: string, border: string, hover: string}> = {
      green: { bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:bg-green-100' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', hover: 'hover:bg-gray-100' }
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <a href="/facilitator" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Facilitator
          </a>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Server Options</h1>
          <p className="text-xl text-gray-600">
            Choose the right framework for your x402-enabled API server.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-12 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Comparison</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">Framework</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Performance</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Learning Curve</th>
                <th className="border border-gray-300 px-4 py-3 text-left">TypeScript</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Edge Support</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Express.js</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Easy</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐ Manual</td>
                <td className="border border-gray-300 px-4 py-3">❌ No</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Hono</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Fastest</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐ Easy</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Built-in</td>
                <td className="border border-gray-300 px-4 py-3">✅ Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Fastify</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Very Fast</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐ Moderate</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Excellent</td>
                <td className="border border-gray-300 px-4 py-3">⚠️ Partial</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Next.js API</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐ Easy</td>
                <td className="border border-gray-300 px-4 py-3">⭐⭐⭐⭐⭐ Built-in</td>
                <td className="border border-gray-300 px-4 py-3">✅ Vercel</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Framework Cards */}
        <div className="space-y-8">
          {frameworks.map((framework) => {
            const colors = getColorClasses(framework.color);
            return (
              <div 
                key={framework.name}
                className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      <span className="mr-2">{framework.icon}</span>
                      {framework.name}
                    </h3>
                    <p className="text-gray-700">{framework.description}</p>
                  </div>
                  {framework.comingSoon && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">✅ Pros</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      {framework.pros.map((pro, i) => (
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
                      {framework.cons.map((con, i) => (
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
                  <p className="text-gray-700 text-sm">{framework.bestFor}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Code Example</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">{framework.example}</pre>
                  </div>
                </div>

                {!framework.comingSoon && (
                  <a 
                    href={framework.quickstartLink}
                    className={`inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors`}
                  >
                    View {framework.name} Quickstart →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Decision Guide */}
        <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤔 Decision Guide</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <strong>Choose Express if:</strong> You want maximum compatibility, have a team familiar with it, or need access to the largest middleware ecosystem.
            </div>
            <div>
              <strong>Choose Hono if:</strong> You need edge deployment, want the best performance, or are building a new TypeScript project from scratch.
            </div>
            <div>
              <strong>Choose Fastify if:</strong> You need high throughput, want built-in schema validation, or are building microservices.
            </div>
            <div>
              <strong>Choose Next.js API Routes if:</strong> You're already using Next.js for your frontend and want a unified full-stack application.
            </div>
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
              <p className="text-gray-700 text-sm">See full working examples across frameworks</p>
            </a>
            <a 
              href="/quickstart/clients" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-1">Build a Client</h3>
              <p className="text-gray-700 text-sm">Learn how to consume your x402 API</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllServerOptions;
