import CodeBlock from '../components/CodeBlock'

export default function ApiReference() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">API Reference</h1>
        <p className="text-xl text-gray-600">
          Complete documentation for X1Pays facilitator and client SDK
        </p>
      </div>

      {/* Facilitator API */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Facilitator API</h2>
        <p className="text-gray-700 mb-6">
          Base URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:4000</code> (dev) or <code className="bg-gray-100 px-2 py-1 rounded">https://facilitator.x1pays.xyz</code> (prod)
        </p>

        {/* GET /supported */}
        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-mono mr-3">GET</span>
            <code className="text-lg font-mono">/supported</code>
          </div>
          <p className="text-gray-700 mb-4">Returns supported networks and assets.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
          <CodeBlock code={`{
  "x402Version": 1,
  "networks": [{
    "scheme": "exact",
    "network": "x1-mainnet",
    "asset": "wXNT_MINT_ADDRESS"
  }]
}`} language="json" />
        </div>

        {/* POST /verify */}
        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-mono mr-3">POST</span>
            <code className="text-lg font-mono">/verify</code>
          </div>
          <p className="text-gray-700 mb-4">Verifies payment signature and payload structure.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
          <CodeBlock code={`{
  "scheme": "exact",
  "network": "x1-mainnet",
  "payTo": "MERCHANT_PUBKEY",
  "asset": "WXNT_MINT",
  "amount": "1000",
  "buyer": "BUYER_PUBKEY",
  "signature": "BASE58_SIGNATURE",
  "memo": null
}`} language="json" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Success Response (200)</h4>
          <CodeBlock code={`{
  "valid": true,
  "message": "verified"
}`} language="json" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Error Response (400)</h4>
          <CodeBlock code={`{
  "valid": false,
  "message": "Signature invalid"
}`} language="json" />
        </div>

        {/* POST /settle */}
        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-mono mr-3">POST</span>
            <code className="text-lg font-mono">/settle</code>
          </div>
          <p className="text-gray-700 mb-4">
            Settles payment on X1 blockchain. In MVP mode, returns simulated transaction hash.
          </p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
          <CodeBlock code={`{
  "scheme": "exact",
  "network": "x1-mainnet",
  "payTo": "MERCHANT_PUBKEY",
  "asset": "WXNT_MINT",
  "amount": "1000",
  "buyer": "BUYER_PUBKEY",
  "signature": "BASE58_SIGNATURE",
  "txSignature": "OPTIONAL_TX_SIGNATURE"
}`} language="json" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Success Response (200)</h4>
          <CodeBlock code={`{
  "txHash": "SIM_ABC123...",
  "simulated": true,
  "message": "MVP mode: payment verified but not settled on-chain..."
}`} language="json" />
        </div>
      </div>

      {/* Client SDK */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Client SDK</h2>
        <p className="text-gray-700 mb-6">
          Install: <code className="bg-gray-100 px-2 py-1 rounded">pnpm add @x1pays/sdk</code>
        </p>

        {/* signPayment */}
        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">signPayment()</h3>
          <p className="text-gray-700 mb-4">Signs a payment payload with buyer's keypair.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function signPayment(payer: Keypair, payload: object): string`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { Keypair } from "@solana/web3.js";
import { signPayment } from "@x1pays/sdk";

const payer = Keypair.fromSecretKey(secretKey);
const payload = {
  scheme: "exact",
  network: "x1-mainnet",
  payTo: "MERCHANT_PUBKEY",
  asset: "WXNT_MINT",
  amount: "1000",
  buyer: payer.publicKey.toBase58(),
  memo: null
};

const signature = signPayment(payer, payload);
console.log(signature); // Base58-encoded signature`} language="typescript" />
        </div>

        {/* getWithPayment */}
        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">getWithPayment()</h3>
          <p className="text-gray-700 mb-4">Makes a GET request with automatic payment handling.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`async function getWithPayment(
  url: string,
  payer: Keypair,
  config: PayConfig
): Promise<any>`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">PayConfig Type</h4>
          <CodeBlock code={`type PayConfig = {
  facilitatorUrl: string;
  payTo: string;
  asset: string;
  network?: "x1-mainnet" | "x1-devnet";
  amountAtomic: string;
}`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { Keypair } from "@solana/web3.js";
import { getWithPayment } from "@x1pays/sdk";

const payer = Keypair.fromSecretKey(secretKey);

try {
  const data = await getWithPayment(
    "https://api.x1pays.xyz/premium/data",
    payer,
    {
      facilitatorUrl: "https://facilitator.x1pays.xyz",
      payTo: process.env.MERCHANT_PUBKEY!,
      asset: process.env.WXNT_MINT!,
      amountAtomic: "1000"
    }
  );
  
  console.log("Access granted:", data);
} catch (error) {
  console.error("Payment failed:", error.message);
}`} language="typescript" />
        </div>
      </div>

      {/* API Server (x402 Middleware) */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">API Server Integration</h2>
        
        {/* x402 Middleware */}
        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">x402()</h3>
          <p className="text-gray-700 mb-4">Express middleware that enforces payment requirement.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function x402(domainBrand?: string): RequestHandler`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import express from "express";
import { x402 } from "./middleware/x402.js";
import { x420 } from "./middleware/x420.js";

const app = express();

// Apply x402 to premium routes
app.use(
  "/premium",
  x420(), // Optional rate limiting
  x402("YourBrand"), // Payment requirement
  premiumRouter
);

app.listen(3000);`} language="typescript" />
        </div>

        {/* x420 Middleware */}
        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">x420()</h3>
          <p className="text-gray-700 mb-4">
            Express middleware for rate limiting unpaid requests (HTTP 420 Enhance Your Calm).
          </p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
          <p className="text-gray-700 text-sm mb-2">
            Default: 30 requests per 60 seconds per IP address
          </p>

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Response (when rate limited)</h4>
          <CodeBlock code={`{
  "code": 420,
  "message": "Enhance Your Calm",
  "hint": "You are rate-limited. Pay via x402 to bypass waiting."
}`} language="json" />
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Environment Variables</h2>
        <div className="space-y-4">
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">RPC_URL</code>
            <p className="text-sm text-gray-700 mt-1">X1 blockchain RPC endpoint</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">NETWORK</code>
            <p className="text-sm text-gray-700 mt-1">Network identifier (x1-mainnet or x1-devnet)</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">WXNT_MINT</code>
            <p className="text-sm text-gray-700 mt-1">wXNT SPL token mint address</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">FEE_PAYER_SECRET</code>
            <p className="text-sm text-gray-700 mt-1">Facilitator fee payer wallet (base58 secret key)</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">PAYTO_ADDRESS</code>
            <p className="text-sm text-gray-700 mt-1">Merchant wallet receiving payments</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">FACILITATOR_URL</code>
            <p className="text-sm text-gray-700 mt-1">URL of the facilitator service</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-700">
          See <code className="bg-indigo-100 px-2 py-1 rounded">scripts/env.schema.md</code> for complete documentation.
        </p>
      </div>
    </div>
  )
}
