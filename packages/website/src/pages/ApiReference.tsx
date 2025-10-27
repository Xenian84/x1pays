import CodeBlock from '../components/CodeBlock'

export default function ApiReference() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">API Reference</h1>
        <p className="text-xl text-gray-600">
          Complete API documentation for x402 protocol implementation
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="mb-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3">Quick Navigation</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="#facilitator" className="text-blue-600 hover:underline">→ Facilitator API</a>
          <a href="#client-axios" className="text-blue-600 hover:underline">→ Client (Axios)</a>
          <a href="#client-fetch" className="text-blue-600 hover:underline">→ Client (Fetch)</a>
          <a href="#middleware-express" className="text-blue-600 hover:underline">→ Middleware (Express)</a>
          <a href="#middleware-hono" className="text-blue-600 hover:underline">→ Middleware (Hono)</a>
          <a href="#middleware-fastify" className="text-blue-600 hover:underline">→ Middleware (Fastify)</a>
          <a href="#middleware-nextjs" className="text-blue-600 hover:underline">→ Middleware (Next.js)</a>
          <a href="#utilities" className="text-blue-600 hover:underline">→ Utilities</a>
          <a href="#types" className="text-blue-600 hover:underline">→ Types</a>
        </div>
      </div>

      {/* Facilitator API */}
      <div id="facilitator" className="mb-16">
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
  "signature": "BASE58_SIGNATURE"
}`} language="json" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Success Response (200)</h4>
          <CodeBlock code={`{
  "txHash": "SIM_ABC123...",
  "amount": "1000",
  "simulated": true,
  "message": "MVP mode: payment verified but not settled on-chain"
}`} language="json" />
        </div>
      </div>

      {/* Client Library - Axios */}
      <div id="client-axios" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Client Library - Axios</h2>
        <p className="text-gray-700 mb-6">
          Install: <code className="bg-gray-100 px-2 py-1 rounded">pnpm add @x1pays/client</code>
        </p>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">x402Client()</h3>
          <p className="text-gray-700 mb-4">Makes HTTP requests with automatic x402 payment handling using Axios.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`async function x402Client<T>(
  config: X402AxiosConfig
): Promise<X402Response<T>>`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Config</h4>
          <CodeBlock code={`interface X402AxiosConfig extends AxiosRequestConfig {
  wallet: WalletSigner;           // Solana Keypair or wallet adapter
  retry?: {
    maxRetries?: number;          // Default: 3
    retryDelay?: number;          // Default: 1000ms
    retryOn?: number[];           // Default: [408, 429, 500, 502, 503, 504]
  };
  paymentTimeout?: number;        // Default: 10000ms
  maxPaymentAmount?: string;      // Safety limit: reject payments above this (atomic units)
}`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Response</h4>
          <CodeBlock code={`interface X402Response<T> {
  data: T;                        // API response data
  payment?: {
    txHash: string;               // Transaction hash
    amount: string;               // Amount paid (atomic units)
    simulated: boolean;           // Whether this was simulated (MVP mode)
  };
  headers: Record<string, string>;
}`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { x402Client } from "@x1pays/client/axios";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(secretKey);

const response = await x402Client({
  url: "https://api.example.com/premium/data",
  method: "GET",
  wallet: wallet,
  retry: {
    maxRetries: 3,
    retryDelay: 1000
  }
});

console.log(response.data);      // Your data
console.log(response.payment);   // { txHash, amount, simulated }`} language="typescript" />
        </div>
      </div>

      {/* Client Library - Fetch */}
      <div id="client-fetch" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Client Library - Fetch API</h2>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">fetchX402JSON()</h3>
          <p className="text-gray-700 mb-4">Fetch with automatic payment handling and JSON parsing.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`async function fetchX402JSON<T>(
  url: string | URL,
  config: X402FetchConfig
): Promise<X402Response<T>>`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Config</h4>
          <CodeBlock code={`interface X402FetchConfig extends RequestInit {
  wallet: WalletSigner;           // Solana Keypair or wallet adapter
  paymentTimeout?: number;        // Default: 10000ms
  maxPaymentAmount?: string;      // Safety limit: reject payments above this (atomic units)
}`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { fetchX402JSON } from "@x1pays/client/fetch";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(secretKey);

const response = await fetchX402JSON(
  "https://api.example.com/premium/data",
  { 
    method: "GET",
    wallet: wallet 
  }
);

console.log(response.data);      // Your data
console.log(response.payment);   // { txHash, amount, simulated }`} language="typescript" />
        </div>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">fetchX402()</h3>
          <p className="text-gray-700 mb-4">Fetch with automatic payment handling (returns Response object).</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`async function fetchX402(
  url: string | URL,
  config: X402FetchConfig
): Promise<Response & { x402Payment?: PaymentResponse }>`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { fetchX402 } from "@x1pays/client/fetch";

const response = await fetchX402(url, { wallet, method: "GET" });
const data = await response.json();
console.log(response.x402Payment);  // Payment details`} language="typescript" />
        </div>
      </div>

      {/* Middleware - Express */}
      <div id="middleware-express" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Middleware - Express</h2>
        <p className="text-gray-700 mb-6">
          Install: <code className="bg-gray-100 px-2 py-1 rounded">pnpm add @x1pays/middleware</code>
        </p>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">x402Middleware()</h3>
          <p className="text-gray-700 mb-4">Express middleware for x402 payment enforcement.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function x402Middleware(config: X402Config): RequestHandler`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Config</h4>
          <CodeBlock code={`interface X402Config {
  facilitatorUrl: string;         // Facilitator service URL
  network: string;                // "x1-mainnet" or "x1-devnet"
  payToAddress: string;           // Merchant wallet address
  tokenMint: string;              // wXNT token mint address
  amount: string;                 // Amount in atomic units
  getDynamicAmount?: (req) => Promise<string> | string;  // Optional dynamic pricing
}`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import express from "express";
import { x402Middleware } from "@x1pays/middleware";

const app = express();

app.get("/premium/data", x402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  network: "x1-mainnet",
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: "1000"  // 0.001 wXNT
}), (req, res) => {
  // Payment verified! req.x402Payment has payment details
  res.json({ data: "paid content" });
});

app.listen(3000);`} language="typescript" />
        </div>
      </div>

      {/* Middleware - Hono */}
      <div id="middleware-hono" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Middleware - Hono</h2>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">x402()</h3>
          <p className="text-gray-700 mb-4">Hono middleware for x402 payment enforcement.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function x402(config: X402Config): MiddlewareHandler`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { Hono } from "hono";
import { x402 } from "@x1pays/middleware/hono";

const app = new Hono();

app.get("/premium/data", x402({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  network: "x1-mainnet",
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: "1000"
}), (c) => {
  // Payment verified! c.get('x402Payment') has payment details
  return c.json({ data: "paid content" });
});`} language="typescript" />
        </div>
      </div>

      {/* Middleware - Fastify */}
      <div id="middleware-fastify" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Middleware - Fastify</h2>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">x402Plugin</h3>
          <p className="text-gray-700 mb-4">Fastify plugin for x402 payment enforcement.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
          <CodeBlock code={`import Fastify from "fastify";
import x402Plugin from "@x1pays/middleware/fastify";

const fastify = Fastify();

await fastify.register(x402Plugin, {
  facilitatorUrl: process.env.FACILITATOR_URL!,
  network: "x1-mainnet",
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: "1000"
});

fastify.get("/premium/data", {
  preHandler: fastify.x402()
}, async (request, reply) => {
  // Payment verified! request.x402Payment has payment details
  return { data: "paid content" };
});

await fastify.listen({ port: 3000 });`} language="typescript" />
        </div>
      </div>

      {/* Middleware - Next.js */}
      <div id="middleware-nextjs" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Middleware - Next.js API Routes</h2>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">x402Handler()</h3>
          <p className="text-gray-700 mb-4">Next.js API route handler with x402 payment enforcement.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function x402Handler(config: X402HandlerConfig): NextApiHandler`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Config</h4>
          <CodeBlock code={`interface X402HandlerConfig extends X402Config {
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;
}`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`// pages/api/premium.ts
import { x402Handler } from "@x1pays/middleware/nextjs";

export default x402Handler({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  network: "x1-mainnet",
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: "1000",
  handler: async (req, res) => {
    // Payment verified! req.x402Payment has payment details
    res.status(200).json({ data: "paid content" });
  }
});`} language="typescript" />
        </div>
      </div>

      {/* Utilities */}
      <div id="utilities" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Utilities</h2>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">signPayment()</h3>
          <p className="text-gray-700 mb-4">Signs a payment payload with a wallet.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`async function signPayment(
  payment: Omit<PaymentPayload, 'signature' | 'buyer'>,
  wallet: WalletSigner
): Promise<PaymentPayload>`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { signPayment } from "@x1pays/client";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(secretKey);

const payment = await signPayment({
  scheme: "exact",
  network: "x1-mainnet",
  payTo: "MERCHANT_PUBKEY",
  asset: "WXNT_MINT",
  amount: "1000",
  memo: null
}, wallet);

console.log(payment.signature);  // Base58-encoded signature
console.log(payment.buyer);      // Wallet public key`} language="typescript" />
        </div>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">wXNTToAtomicUnits()</h3>
          <p className="text-gray-700 mb-4">Convert wXNT amount to atomic units (6 decimals). Uses string-based parsing to avoid floating-point precision issues.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function wXNTToAtomicUnits(wXNT: number | string): string`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { wXNTToAtomicUnits } from "@x1pays/client";

wXNTToAtomicUnits(0.001)      // "1000"
wXNTToAtomicUnits("0.000001") // "1"
wXNTToAtomicUnits(1.5)        // "1500000"

// Throws error if >6 decimal places
wXNTToAtomicUnits(0.1234567)  // Error: too many decimal places

// Throws error if amount too small
wXNTToAtomicUnits(0.0000001)  // Error: min 0.000001 wXNT`} language="typescript" />
        </div>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">atomicUnitsToWXNT()</h3>
          <p className="text-gray-700 mb-4">Convert atomic units to wXNT amount (6 decimals).</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function atomicUnitsToWXNT(atomicUnits: string | number): number`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { atomicUnitsToWXNT } from "@x1pays/client";

atomicUnitsToWXNT("1000")      // 0.001
atomicUnitsToWXNT("1")         // 0.000001
atomicUnitsToWXNT(1500000)     // 1.5`} language="typescript" />
        </div>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">formatWXNT()</h3>
          <p className="text-gray-700 mb-4">Format atomic units as human-readable wXNT string.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function formatWXNT(atomicUnits: string | number): string`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { formatWXNT } from "@x1pays/client";

formatWXNT("1000")      // "0.001 wXNT"
formatWXNT("1")         // "0.000001 wXNT"
formatWXNT(1500000)     // "1.5 wXNT"`} language="typescript" />
        </div>

        <div className="mb-10 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">isValidAmount()</h3>
          <p className="text-gray-700 mb-4">Validate atomic units amount (must be positive integer).</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Signature</h4>
          <CodeBlock code={`function isValidAmount(amount: string | number): boolean`} language="typescript" />

          <h4 className="font-semibold text-gray-900 mb-2 mt-4">Example</h4>
          <CodeBlock code={`import { isValidAmount } from "@x1pays/client";

isValidAmount("1000")     // true
isValidAmount(1000)       // true
isValidAmount("1.5")      // false (no decimals allowed)
isValidAmount(-100)       // false (must be positive)`} language="typescript" />
        </div>
      </div>

      {/* Types */}
      <div id="types" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">TypeScript Types</h2>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">PaymentPayload</h3>
            <CodeBlock code={`interface PaymentPayload {
  scheme: string;           // "exact"
  network: string;          // "x1-mainnet" or "x1-devnet"
  payTo: string;            // Merchant wallet address
  asset: string;            // wXNT token mint address
  amount: string;           // Amount in atomic units
  buyer: string;            // Buyer wallet address
  signature: string;        // Base58-encoded ed25519 signature
  memo: string | null;      // Optional memo
}`} language="typescript" />
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">PaymentRequirement</h3>
            <CodeBlock code={`interface PaymentRequirement {
  accepts: Array<{
    scheme: string;
    network: string;
    payTo: string;
    asset: string;
    maxAmountRequired: string;
    facilitatorUrl: string;
  }>;
  resource: string;
  x402Version: number;
}`} language="typescript" />
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">PaymentResponse</h3>
            <CodeBlock code={`interface PaymentResponse {
  txHash: string;           // Transaction hash
  amount: string;           // Amount settled
  simulated: boolean;       // Whether simulated (MVP mode)
  message?: string;         // Optional message
}`} language="typescript" />
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">WalletSigner</h3>
            <CodeBlock code={`type WalletSigner = 
  | { publicKey: { toBase58(): string }; signMessage(msg: Uint8Array): Promise<Uint8Array> }
  | { publicKey: { toString(): string }; sign(msg: Uint8Array): Uint8Array; secretKey: Uint8Array }`} language="typescript" />
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Environment Variables</h2>
        <div className="space-y-4">
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">FACILITATOR_URL</code>
            <p className="text-sm text-gray-700 mt-1">URL of the facilitator service (e.g., http://localhost:4000)</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">NETWORK</code>
            <p className="text-sm text-gray-700 mt-1">Network identifier: "x1-mainnet" or "x1-devnet"</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">WXNT_MINT</code>
            <p className="text-sm text-gray-700 mt-1">wXNT SPL token mint address on X1</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">MERCHANT_WALLET</code>
            <p className="text-sm text-gray-700 mt-1">Merchant wallet address (receives payments)</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">FEE_PAYER_SECRET</code>
            <p className="text-sm text-gray-700 mt-1">Facilitator fee payer wallet (base58 secret key)</p>
          </div>
          <div>
            <code className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">RPC_URL</code>
            <p className="text-sm text-gray-700 mt-1">X1 blockchain RPC endpoint</p>
          </div>
        </div>
      </div>
    </div>
  )
}
