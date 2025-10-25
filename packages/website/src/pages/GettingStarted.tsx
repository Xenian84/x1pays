import CodeBlock from '../components/CodeBlock'
import { Terminal, Cog, Rocket } from 'lucide-react'

export default function GettingStarted() {
  const installCode = `# Clone the repository
git clone https://github.com/x1pays/x1pays.git
cd x1pays

# Install dependencies
pnpm install

# Build all packages
pnpm build`

  const envFacilitatorCode = `PORT=4000
RPC_URL=https://rpc.mainnet.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=YOUR_WXNT_MINT_ADDRESS
FEE_PAYER_SECRET=YOUR_BASE58_SECRET_KEY`

  const envApiCode = `PORT=3000
RPC_URL=https://rpc.mainnet.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=YOUR_WXNT_MINT_ADDRESS
PAYTO_ADDRESS=YOUR_MERCHANT_PUBKEY
FACILITATOR_URL=http://localhost:4000
DOMAIN=localhost`

  const runCode = `# Run both services concurrently
pnpm dev

# Or run individually
pnpm dev:fac  # Facilitator on port 4000
pnpm dev:api  # API on port 3000`

  const clientCode = `import { Keypair } from "@solana/web3.js";
import { getWithPayment } from "@x1pays/sdk";

// Load your wallet
const payer = Keypair.fromSecretKey(yourSecretKey);

// Make a paid request
const data = await getWithPayment(
  "http://localhost:3000/premium/data",
  payer,
  {
    facilitatorUrl: "http://localhost:4000",
    payTo: process.env.PAYTO_ADDRESS!,
    asset: process.env.WXNT_MINT!,
    amountAtomic: "1000"
  }
);

console.log(data);`

  const middlewareCode = `import { x402 } from "./middleware/x402.js";
import { x420 } from "./middleware/x420.js";

// Apply x420 rate limiting and x402 payment requirement
app.use("/premium", x420(), x402("YourBrand"), premiumRoutes);`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
        <p className="text-xl text-gray-600">
          Quick start guide to set up and run X1Pays locally
        </p>
      </div>

      {/* Prerequisites */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Terminal className="h-6 w-6 mr-2 text-primary" />
          Prerequisites
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Node.js 18 or higher</li>
          <li>pnpm 9.0 or higher</li>
          <li>X1 wallet with wXNT tokens (for testing actual settlements)</li>
        </ul>
      </div>

      {/* Installation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Cog className="h-6 w-6 mr-2 text-primary" />
          Installation
        </h2>
        <CodeBlock code={installCode} language="bash" />
      </div>

      {/* Configuration */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Facilitator Service</h3>
        <p className="text-gray-700 mb-3">
          Create <code className="bg-gray-100 px-2 py-1 rounded">packages/facilitator/.env</code>:
        </p>
        <CodeBlock code={envFacilitatorCode} language="bash" filename="packages/facilitator/.env" />

        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-8">2. API Service</h3>
        <p className="text-gray-700 mb-3">
          Create <code className="bg-gray-100 px-2 py-1 rounded">packages/api/.env</code>:
        </p>
        <CodeBlock code={envApiCode} language="bash" filename="packages/api/.env" />

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 text-sm">
            <strong>💡 Tip:</strong> Generate a new wallet for testing using:
            <code className="ml-2 bg-blue-100 px-2 py-1 rounded">node scripts/seed-merchant-wallet.js</code>
          </p>
        </div>
      </div>

      {/* Running */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Rocket className="h-6 w-6 mr-2 text-primary" />
          Running the Services
        </h2>
        <CodeBlock code={runCode} language="bash" />
        
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-900">
            <strong>✅ Success!</strong> Your services should now be running:
          </p>
          <ul className="mt-2 space-y-1 text-green-800 list-disc list-inside">
            <li>Facilitator: <code className="bg-green-100 px-2 py-1 rounded">http://localhost:4000</code></li>
            <li>API: <code className="bg-green-100 px-2 py-1 rounded">http://localhost:3000</code></li>
          </ul>
        </div>
      </div>

      {/* Testing */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing the Flow</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Unpaid Request (Returns 402)</h3>
        <CodeBlock code={`curl -i http://localhost:3000/premium/data`} language="bash" />
        <p className="text-gray-700 mt-2 mb-4">
          You should receive a <code className="bg-gray-100 px-2 py-1 rounded">402 Payment Required</code> response with payment details.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Using the Client SDK</h3>
        <CodeBlock code={clientCode} language="typescript" filename="example.ts" />
      </div>

      {/* Integration */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Integrating into Your API</h2>
        <p className="text-gray-700 mb-4">
          Add the x402 middleware to any Express route to require payment:
        </p>
        <CodeBlock code={middlewareCode} language="typescript" filename="server.ts" />
      </div>

      {/* MVP Notice */}
      <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Important: MVP Mode</h3>
        <p className="text-yellow-800 mb-3">
          The current implementation runs in <strong>MVP simulation mode</strong>. Settlement
          returns a simulated transaction hash without actual on-chain transfers.
        </p>
        <p className="text-yellow-800">
          For production, you must implement delegate approval or client-signed transaction patterns.
          See <code className="bg-yellow-100 px-2 py-1 rounded">PRODUCTION_NOTES.md</code> for details.
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-primary rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">1</span>
            <span>Explore the <a href="/docs/api-reference" className="text-primary hover:underline">API Reference</a> for complete documentation</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-primary rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">2</span>
            <span>Review <code className="bg-gray-100 px-2 py-1 rounded">PRODUCTION_NOTES.md</code> for security best practices</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-primary rounded-full text-white text-center text-sm mr-3 flex-shrink-0 mt-0.5">3</span>
            <span>Join our Discord community for support and updates</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
