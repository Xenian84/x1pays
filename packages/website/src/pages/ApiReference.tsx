import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import ApiIcon from '@mui/icons-material/Api'
import CodeBlock from '../components/CodeBlock'

export default function ApiReference() {
  const navItems = [
    { label: 'Facilitator API', href: '#facilitator' },
    { label: 'Client (Axios)', href: '#client-axios' },
    { label: 'Client (Fetch)', href: '#client-fetch' },
    { label: 'Middleware (Express)', href: '#middleware-express' },
    { label: 'Middleware (Hono)', href: '#middleware-hono' },
    { label: 'Middleware (Fastify)', href: '#middleware-fastify' },
    { label: 'Middleware (Next.js)', href: '#middleware-nextjs' },
    { label: 'Utilities', href: '#utilities' },
    { label: 'Types', href: '#types' },
  ]

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <ApiIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
              API Reference
            </Typography>
          </Box>
          <Typography variant="h5" color="text.secondary">
            Complete API documentation for x402 protocol implementation
          </Typography>
        </Stack>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'primary.dark', mb: 8 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Navigation
            </Typography>
            <Grid container spacing={1.5}>
              {navItems.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Box
                    component="a"
                    href={item.href}
                    sx={{
                      display: 'block',
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    → {item.label}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Box id="facilitator" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            Facilitator API
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            Base URL:{' '}
            <Box component="code" sx={{ bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.875rem' }}>
              http://localhost:4000
            </Box>{' '}
            (dev) or{' '}
            <Box component="code" sx={{ bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.875rem' }}>
              https://facilitator.x1pays.xyz
            </Box>{' '}
            (prod)
          </Typography>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Chip label="GET" color="success" size="small" sx={{ fontWeight: 600 }} />
                <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  /supported
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Returns supported networks and assets.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Response</Typography>
              <CodeBlock code={`{
  "x402Version": 1,
  "networks": [{
    "scheme": "exact",
    "network": "x1-mainnet",
    "asset": "wXNT_MINT_ADDRESS"
  }]
}`} language="json" />
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Chip label="POST" color="primary" size="small" sx={{ fontWeight: 600 }} />
                <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  /verify
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Verifies payment signature and payload structure.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Request Body</Typography>
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Success Response (200)</Typography>
              <CodeBlock code={`{
  "valid": true,
  "message": "verified"
}`} language="json" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Error Response (400)</Typography>
              <CodeBlock code={`{
  "valid": false,
  "message": "Signature invalid"
}`} language="json" />
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Chip label="POST" color="primary" size="small" sx={{ fontWeight: 600 }} />
                <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  /settle
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Settles payment on X1 blockchain. In MVP mode, returns simulated transaction hash.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Request Body</Typography>
              <CodeBlock code={`{
  "scheme": "exact",
  "network": "x1-mainnet",
  "payTo": "MERCHANT_PUBKEY",
  "asset": "WXNT_MINT",
  "amount": "1000",
  "buyer": "BUYER_PUBKEY",
  "signature": "BASE58_SIGNATURE"
}`} language="json" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Success Response (200)</Typography>
              <CodeBlock code={`{
  "txHash": "SIM_ABC123...",
  "amount": "1000",
  "simulated": true,
  "message": "MVP mode: payment verified but not settled on-chain"
}`} language="json" />
            </CardContent>
          </Card>
        </Box>

        <Box id="client-axios" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Client Library - Axios
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Install:{' '}
            <Box component="code" sx={{ bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.875rem' }}>
              pnpm add @x1pays/client
            </Box>
          </Typography>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                x402Client()
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Makes HTTP requests with automatic x402 payment handling using Axios.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Signature</Typography>
              <CodeBlock code={`async function x402Client<T>(
  config: X402AxiosConfig
): Promise<X402Response<T>>`} language="typescript" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Config</Typography>
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Response</Typography>
              <CodeBlock code={`interface X402Response<T> {
  data: T;                        // API response data
  payment?: {
    txHash: string;               // Transaction hash
    amount: string;               // Amount paid (atomic units)
    simulated: boolean;           // Whether this was simulated (MVP mode)
  };
  headers: Record<string, string>;
}`} language="typescript" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Example</Typography>
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
            </CardContent>
          </Card>
        </Box>

        <Box id="client-fetch" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            Client Library - Fetch API
          </Typography>

          <Stack spacing={4}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  fetchX402JSON()
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Fetch with automatic payment handling and JSON parsing.
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Signature</Typography>
                <CodeBlock code={`async function fetchX402JSON<T>(
  url: string | URL,
  config: X402FetchConfig
): Promise<X402Response<T>>`} language="typescript" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Config</Typography>
                <CodeBlock code={`interface X402FetchConfig extends RequestInit {
  wallet: WalletSigner;           // Solana Keypair or wallet adapter
  paymentTimeout?: number;        // Default: 10000ms
  maxPaymentAmount?: string;      // Safety limit: reject payments above this (atomic units)
}`} language="typescript" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Example</Typography>
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
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  fetchX402()
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Fetch with automatic payment handling (returns Response object).
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Signature</Typography>
                <CodeBlock code={`async function fetchX402(
  url: string | URL,
  config: X402FetchConfig
): Promise<Response & { x402Payment?: PaymentResponse }>`} language="typescript" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Example</Typography>
                <CodeBlock code={`import { fetchX402 } from "@x1pays/client/fetch";

const response = await fetchX402(url, { wallet, method: "GET" });
const data = await response.json();
console.log(response.x402Payment);  // Payment details`} language="typescript" />
              </CardContent>
            </Card>
          </Stack>
        </Box>

        <Box id="middleware-express" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Middleware - Express
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Install:{' '}
            <Box component="code" sx={{ bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.875rem' }}>
              pnpm add @x1pays/middleware
            </Box>
          </Typography>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                x402Middleware()
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Express middleware for x402 payment enforcement.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Signature</Typography>
              <CodeBlock code={`function x402Middleware(config: X402Config): RequestHandler`} language="typescript" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Config</Typography>
              <CodeBlock code={`interface X402Config {
  facilitatorUrl: string;         // Facilitator service URL
  network: string;                // "x1-mainnet" or "x1-testnet"
  payToAddress: string;           // Merchant wallet address
  tokenMint: string;              // wXNT token mint address
  amount: string;                 // Amount in atomic units
  getDynamicAmount?: (req) => Promise<string> | string;  // Optional dynamic pricing
}`} language="typescript" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Example</Typography>
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
            </CardContent>
          </Card>
        </Box>

        <Box id="middleware-hono" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            Middleware - Hono
          </Typography>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                x402()
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Hono middleware for x402 payment enforcement.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Signature</Typography>
              <CodeBlock code={`function x402(config: X402Config): MiddlewareHandler`} language="typescript" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Example</Typography>
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
            </CardContent>
          </Card>
        </Box>

        <Box id="middleware-fastify" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            Middleware - Fastify
          </Typography>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                x402Plugin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fastify plugin for x402 payment enforcement.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Example</Typography>
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
            </CardContent>
          </Card>
        </Box>

        <Box id="middleware-nextjs" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            Middleware - Next.js API Routes
          </Typography>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                x402Handler()
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Next.js API route handler with x402 payment enforcement.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Signature</Typography>
              <CodeBlock code={`function x402Handler(config: X402HandlerConfig): NextApiHandler`} language="typescript" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Config</Typography>
              <CodeBlock code={`interface X402HandlerConfig extends X402Config {
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;
}`} language="typescript" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Example</Typography>
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
            </CardContent>
          </Card>
        </Box>

        <Box id="utilities" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            Utilities
          </Typography>

          <Stack spacing={4}>
            {[
              {
                title: 'signPayment()',
                description: 'Signs a payment payload with a wallet.',
                signature: `async function signPayment(
  payment: Omit<PaymentPayload, 'signature' | 'buyer'>,
  wallet: WalletSigner
): Promise<PaymentPayload>`,
                example: `import { signPayment } from "@x1pays/client";
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
console.log(payment.buyer);      // Wallet public key`,
              },
              {
                title: 'wXNTToAtomicUnits()',
                description: 'Convert wXNT amount to atomic units (6 decimals). Uses string-based parsing to avoid floating-point precision issues.',
                signature: `function wXNTToAtomicUnits(wXNT: number | string): string`,
                example: `import { wXNTToAtomicUnits } from "@x1pays/client";

wXNTToAtomicUnits(0.001)      // "1000"
wXNTToAtomicUnits("0.000001") // "1"
wXNTToAtomicUnits(1.5)        // "1500000"

// Throws error if >6 decimal places
wXNTToAtomicUnits(0.1234567)  // Error: too many decimal places

// Throws error if amount too small
wXNTToAtomicUnits(0.0000001)  // Error: min 0.000001 wXNT`,
              },
              {
                title: 'atomicUnitsToWXNT()',
                description: 'Convert atomic units to wXNT amount (6 decimals).',
                signature: `function atomicUnitsToWXNT(atomicUnits: string | number): number`,
                example: `import { atomicUnitsToWXNT } from "@x1pays/client";

atomicUnitsToWXNT("1000")      // 0.001
atomicUnitsToWXNT("1")         // 0.000001
atomicUnitsToWXNT(1500000)     // 1.5`,
              },
              {
                title: 'formatWXNT()',
                description: 'Format atomic units as human-readable wXNT string.',
                signature: `function formatWXNT(atomicUnits: string | number): string`,
                example: `import { formatWXNT } from "@x1pays/client";

formatWXNT("1000")      // "0.001 wXNT"
formatWXNT("1")         // "0.000001 wXNT"
formatWXNT(1500000)     // "1.5 wXNT"`,
              },
              {
                title: 'isValidAmount()',
                description: 'Validate atomic units amount (must be positive integer).',
                signature: `function isValidAmount(amount: string | number): boolean`,
                example: `import { isValidAmount } from "@x1pays/client";

isValidAmount("1000")     // true
isValidAmount(1000)       // true
isValidAmount("1.5")      // false (no decimals allowed)
isValidAmount(-100)       // false (must be positive)`,
              },
            ].map((util, index) => (
              <Card key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {util.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {util.description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Signature</Typography>
                  <CodeBlock code={util.signature} language="typescript" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}>Example</Typography>
                  <CodeBlock code={util.example} language="typescript" />
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        <Box id="types" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 4 }}>
            TypeScript Types
          </Typography>

          <Stack spacing={3}>
            {[
              {
                title: 'PaymentPayload',
                code: `interface PaymentPayload {
  scheme: string;           // "exact"
  network: string;          // "x1-mainnet" or "x1-testnet"
  payTo: string;            // Merchant wallet address
  asset: string;            // wXNT token mint address
  amount: string;           // Amount in atomic units
  buyer: string;            // Buyer wallet address
  signature: string;        // Base58-encoded ed25519 signature
  memo: string | null;      // Optional memo
}`,
              },
              {
                title: 'PaymentRequirement',
                code: `interface PaymentRequirement {
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
}`,
              },
              {
                title: 'PaymentResponse',
                code: `interface PaymentResponse {
  txHash: string;           // Transaction hash
  amount: string;           // Amount settled
  simulated: boolean;       // Whether simulated (MVP mode)
  message?: string;         // Optional message
}`,
              },
              {
                title: 'WalletSigner',
                code: `type WalletSigner = 
  | { publicKey: { toBase58(): string }; signMessage(msg: Uint8Array): Promise<Uint8Array> }
  | { publicKey: { toString(): string }; sign(msg: Uint8Array): Uint8Array; secretKey: Uint8Array }`,
              },
            ].map((type, index) => (
              <Card key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {type.title}
                  </Typography>
                  <CodeBlock code={type.code} language="typescript" />
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'primary.dark',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(118, 255, 3, 0.05) 100%)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Environment Variables
            </Typography>
            <Stack spacing={2}>
              {[
                { key: 'FACILITATOR_URL', desc: 'URL of the facilitator service (e.g., http://localhost:4000)' },
                { key: 'NETWORK', desc: 'Network identifier: "x1-mainnet" or "x1-testnet"' },
                { key: 'WXNT_MINT', desc: 'wXNT SPL token mint address on X1' },
                { key: 'MERCHANT_WALLET', desc: 'Merchant wallet address (receives payments)' },
                { key: 'FEE_PAYER_SECRET', desc: 'Facilitator fee payer wallet (base58 secret key)' },
                { key: 'RPC_URL', desc: 'X1 blockchain RPC endpoint' },
              ].map((env, index) => (
                <Box key={index}>
                  <Box component="code" sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', px: 1.5, py: 0.75, borderRadius: 1, fontSize: '0.875rem', fontFamily: 'monospace', color: 'primary.main', fontWeight: 600 }}>
                    {env.key}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                    {env.desc}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
