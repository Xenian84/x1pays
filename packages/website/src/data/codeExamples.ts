/**
 * Centralized Code Examples
 * 
 * This file combines manually curated examples with automatically generated ones.
 * Auto-generated examples are extracted from actual source code.
 * 
 * To update auto-generated examples: pnpm extract-docs
 */

import {
  generatedCodeExamples,
  generatedTypeDefinitions,
  generatedAPIEndpoints,
  generatedEnvVariables,
  getExample,
  getType,
  getEndpoint
} from './generatedDocs'

// Export generated documentation for use in components
export { generatedCodeExamples, generatedTypeDefinitions, generatedAPIEndpoints, generatedEnvVariables }
export { getExample, getType, getEndpoint }

// ============================================================================
// SERVER EXAMPLES
// ============================================================================

export const serverExpressExample = `import express from "express";
import { x402Middleware } from "@x1pay/middleware/express";

const app = express();

app.use("/secret", x402Middleware({
  facilitatorRegistryUrl: process.env.FACILITATOR_REGISTRY_URL || "http://localhost:3000",
  facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4000", // Fallback
  network: process.env.NETWORK || "x1-testnet",
  allowedNetworks: ["x1-testnet", "x1-mainnet"],
  payToAddress: process.env.MERCHANT_ADDRESS,
  tokenMint: process.env.WXNT_MINT,
    amount: "1000", // 1000 lamports = 0.000001 XNT
  description: "Access to secret data"
}));

app.get("/secret", (_req, res) => {
  res.json({ secret: "Your protected data here" });
});

app.listen(3000);`

export const serverExpressExtendedExample = `import express from 'express'
import { x402Middleware } from '@x1pay/middleware/express'

const app = express()

// Public endpoints (no payment required)
app.get('/api/public/hello', (req, res) => {
  res.json({ message: 'This is free!' })
})

// Premium endpoints (payment required)
app.get('/api/premium/data',
  x402Middleware({
    facilitatorRegistryUrl: process.env.FACILITATOR_REGISTRY_URL || "http://localhost:3000",
    facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4000", // Fallback
    network: process.env.NETWORK || "x1-testnet",
    allowedNetworks: ["x1-testnet", "x1-mainnet"],
    payToAddress: process.env.MERCHANT_ADDRESS,
    tokenMint: process.env.WXNT_MINT,
    amount: '1000'  // 0.001 XNT
  }),
  (req, res) => {
    // Payment verified! Access payment details
    const payment = (req as any).x402Payment
    
    res.json({
      data: 'Premium content here',
      payment: {
        txHash: payment.txHash,
        amount: payment.amount,
        network: payment.network
      }
    })
  }
)

// Dynamic pricing example
app.get('/api/premium/custom',
  x402Middleware({
    facilitatorRegistryUrl: process.env.FACILITATOR_REGISTRY_URL || "http://localhost:3000",
    facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4000", // Fallback
    network: process.env.NETWORK || "x1-testnet",
    allowedNetworks: ["x1-testnet", "x1-mainnet"],
    payToAddress: process.env.MERCHANT_ADDRESS,
    tokenMint: process.env.WXNT_MINT,
    amount: '1000',
    getDynamicAmount: async (req) => {
      // Custom pricing logic
      const tier = req.query.tier
      return tier === 'premium' ? '5000' : '1000'
    }
  }),
  (req, res) => {
    res.json({ data: 'Custom priced content' })
  }
)

app.listen(3000, () => {
  console.log('x402-enabled server running on port 3000')
})`

export const serverHonoExample = `import { Hono } from "hono";
import { x402 } from "@x1pay/middleware/hono";

const app = new Hono();

app.get("/premium/data", x402({
  facilitatorRegistryUrl: process.env.FACILITATOR_REGISTRY_URL || "http://localhost:3000",
  facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4000", // Fallback
  network: process.env.NETWORK || "x1-testnet",
  allowedNetworks: ["x1-testnet", "x1-mainnet"],
  payToAddress: process.env.MERCHANT_ADDRESS,
  tokenMint: process.env.WXNT_MINT,
  amount: "1000"
}), (c) => {
  // Payment verified! c.get('x402Payment') has payment details
  return c.json({ data: "paid content" });
});`

export const serverNextJSExample = `// pages/api/premium.ts
import { x402Handler } from "@x1pay/middleware/nextjs";

export default x402Handler({
  facilitatorRegistryUrl: process.env.FACILITATOR_REGISTRY_URL || "http://localhost:3000",
  facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4000", // Fallback
  network: process.env.NETWORK || "x1-testnet",
  allowedNetworks: ["x1-testnet", "x1-mainnet"],
  payToAddress: process.env.MERCHANT_ADDRESS,
  tokenMint: process.env.WXNT_MINT,
  amount: "1000",
  handler: async (req, res) => {
    // Payment verified! req.x402Payment has payment details
    res.status(200).json({ data: "paid content" });
  }
});`

export const serverFastifyExample = `import Fastify from "fastify";
import x402Plugin from "@x1pay/middleware/fastify";

const fastify = Fastify();

await fastify.register(x402Plugin, {
  facilitatorRegistryUrl: process.env.FACILITATOR_REGISTRY_URL || "http://localhost:3000",
  facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4000", // Fallback
  network: process.env.NETWORK || "x1-testnet",
  allowedNetworks: ["x1-testnet", "x1-mainnet"],
  payToAddress: process.env.MERCHANT_ADDRESS,
  tokenMint: process.env.WXNT_MINT,
  amount: "1000"
});

fastify.get("/premium/data", {
  preHandler: fastify.x402()
}, async (request, reply) => {
  // Payment verified! request.x402Payment has payment details
  return { data: "paid content" };
});

await fastify.listen({ port: 3000 });`

// ============================================================================
// CLIENT EXAMPLES
// ============================================================================

export const clientAxiosExample = `import { Keypair } from "@solana/web3.js";
import { x402Client } from "@x1pay/client/axios";

// Load your wallet (permit-based signing - no wallet popup needed!)
const wallet = Keypair.fromSecretKey(yourSecretKey);

// Make a paid request - payment happens automatically!
const response = await x402Client({
  url: "http://localhost:3000/premium/data",
  method: "GET",
  wallet: wallet
});

console.log(response.data);      // Your data
console.log(response.payment);   // { txHash, amount, simulated }`

export const clientFetchExample = `import { Keypair } from "@solana/web3.js";
import { fetchX402JSON } from "@x1pay/client/fetch";

// Load your wallet (permit-based signing - no wallet popup needed!)
const wallet = Keypair.fromSecretKey(secretKey);

// Make a paid request - payment happens automatically!
const response = await fetchX402JSON(
  "http://localhost:3000/premium/data",
  { 
    method: "GET",
    wallet: wallet 
  }
);

console.log(response.data);      // Your data
console.log(response.payment);   // { txHash, amount, simulated }

// Or use fetchX402() for raw Response object
import { fetchX402 } from "@x1pay/client/fetch";

async function getPremiumDataRaw() {
  const response = await fetchX402(url, { wallet, method: 'GET' })
  const data = await response.json()
  console.log('Payment info:', response.x402Payment)
  return data
}`

export const clientReactExample = `import { X402Paywall } from '@x1pay/react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import '@solana/wallet-adapter-react-ui/styles.css'

function App() {
  const endpoint = 'https://rpc.testnet.x1.xyz'
  const wallets = [new BackpackWalletAdapter()]

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <PremiumPage />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

function PremiumPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <WalletMultiButton />
      
      <X402Paywall
        amount={2.50}
        description="Premium AI Chat Access"
        network="x1-testnet"
        showBalance={true}
        onPaymentSuccess={(txId) => {
          console.log('Payment successful! TX:', txId)
          // Track analytics, unlock features, etc.
        }}
        onPaymentError={(error) => {
          console.error('Payment failed:', error)
        }}
      >
        {/* Content shown after payment */}
        <div>
          <h2>Premium Content Unlocked!</h2>
          <p>You now have access to premium features.</p>
        </div>
      </X402Paywall>
    </div>
  )
}

export default App`

export const clientPythonExample = `import requests
import json
from nacl.signing import SigningKey
import base58
import time

class X402Client:
    def __init__(self, wallet_secret_key_hex):
        """Initialize with ed25519 secret key (64 bytes hex)"""
        self.signing_key = SigningKey(bytes.fromhex(wallet_secret_key_hex))
        self.public_key = self.signing_key.verify_key.encode().hex()
        
    def make_request(self, url):
        """Make x402-enabled request"""
        # Step 1: Try request (will get 402)
        response = requests.get(url)
        
        if response.status_code != 402:
            return response.json()
        
        # Step 2: Parse payment requirement and choose lowest price
        payment_req_header = response.headers.get('X-Payment-Required')
        requirement = json.loads(payment_req_header)
        
        # Choose the lowest-priced accept option
        accept = min(
            requirement['accepts'],
            key=lambda a: int(a['maxAmountRequired'])
        )
        
        # Step 3: Create payment payload
        payment = {
            'scheme': accept['scheme'],
            'network': accept['network'],
            'payTo': accept['payTo'],
            'asset': accept['asset'],
            'amount': accept['maxAmountRequired'],
            'buyer': self.public_key,
            'memo': None
        }
        
        # Step 4: Sign payment
        message = json.dumps(payment, separators=(',', ':')).encode()
        signature = self.signing_key.sign(message).signature
        payment['signature'] = base58.b58encode(signature).decode()
        
        # Step 5: Verify with facilitator
        facilitator_url = accept['facilitatorUrl']
        verify_resp = requests.post(
            f"{facilitator_url}/verify",
            json=payment
        )
        
        if not verify_resp.json()['valid']:
            raise Exception('Payment verification failed')
        
        # Step 6: Settle payment
        settle_resp = requests.post(
            f"{facilitator_url}/settle",
            json=payment
        )
        settlement = settle_resp.json()
        
        # Step 7: Retry with payment proof
        payment['txHash'] = settlement['txHash']
        headers = {'X-Payment': json.dumps(payment)}
        response = requests.get(url, headers=headers)
        
        return response.json()

# Usage
client = X402Client(wallet_secret_key_hex='your_64_byte_hex_key')
data = client.make_request('https://api.yourapp.com/premium/data')
print(data)`

export const clientCurlExample = `# Step 1: Try to access endpoint (will get 402)
curl -i https://api.yourapp.com/premium/data

# Response:
# HTTP/1.1 402 Payment Required
# X-Payment-Required: {
#   "accepts": [{
#     "scheme": "exact",
#     "network": "x1-mainnet",
#     "payTo": "MERCHANT_WALLET",
#     "asset": "WXNT_MINT",
#     "maxAmountRequired": "1000",
#     "facilitatorUrl": "https://facilitator.x1pays.xyz"
#   }],
#   "x402Version": 1
# }

# Step 2: Create payment payload
PAYMENT='{
  "scheme": "exact",
  "network": "x1-mainnet",
  "payTo": "MERCHANT_WALLET",
  "asset": "WXNT_MINT",
  "amount": "1000",
  "buyer": "YOUR_PUBKEY",
  "signature": "BASE58_ED25519_SIGNATURE",
  "memo": null
}'

# Step 3: Verify payment with facilitator
curl -X POST https://facilitator.x1pays.xyz/verify \\
  -H "Content-Type: application/json" \\
  -d "$PAYMENT"

# Step 4: Settle payment with facilitator
curl -X POST https://facilitator.x1pays.xyz/settle \\
  -H "Content-Type: application/json" \\
  -d "$PAYMENT"

# Response: {"txHash": "3RnYh8r9...oVgpXDYMC", "amount": "1000", "network": "x1-mainnet"}

# Step 5: Retry request with payment proof
curl -H "X-Payment: $PAYMENT" \\
     https://api.yourapp.com/premium/data

# Success! You get the data`

// ============================================================================
// CONFIGURATION EXAMPLES
// ============================================================================

export const envFacilitatorExample = `PORT=4000
RPC_URL_TESTNET=https://rpc.testnet.x1.xyz
RPC_URL_MAINNET=https://rpc.mainnet.x1.xyz
NETWORK=x1-testnet
WXNT_MINT=So11111111111111111111111111111111111111112
FEE_PAYER_SECRET=YOUR_BASE58_SECRET_KEY`

export const envApiExample = `PORT=3000
RPC_URL_TESTNET=https://rpc.testnet.x1.xyz
RPC_URL_MAINNET=https://rpc.mainnet.x1.xyz
NETWORK=x1-testnet
WXNT_MINT=So11111111111111111111111111111111111111112
MERCHANT_ADDRESS=YOUR_MERCHANT_PUBKEY
FACILITATOR_URL=http://localhost:4000
FACILITATOR_REGISTRY_URL=http://localhost:3000
DOMAIN=localhost`

// ============================================================================
// API EXAMPLES
// ============================================================================

export const apiPaymentRequirementExample = `{
  "x402Version": 1,
  "info": "Payment required to access this resource",
  "accepts": [{
    "scheme": "exact",
    "network": "x1-testnet",
    "payTo": "MERCHANT_PUBKEY",
    "asset": "WXNT_MINT",
    "maxAmountRequired": "1000",
    "resource": "/premium/data",
    "description": "Access to premium data",
    "facilitatorUrl": "http://localhost:4000"
  }],
  "facilitators": [{
    "name": "Alpha",
    "fee": "0.0%",
    "endpoint": "/facilitators/alpha",
    "address": "FACILITATOR_ADDRESS",
    "live": true,
    "status": "🟢 LIVE"
  }]
}`

export const apiPaymentResponseExample = `{
  "txHash": "ABC123...",
  "amount": "1000",
  "simulated": false,
  "network": "x1-testnet"
}`

// ============================================================================
// UTILITY EXAMPLES
// ============================================================================

export const utilitiesExample = `import { 
  XNTToAtomicUnits, 
  atomicUnitsToWXNT, 
  formatWXNT 
} from "@x1pay/client";

// Convert XNT to atomic units (6 decimals)
const amount = XNTToAtomicUnits(0.001);      // "1000"
const amount2 = XNTToAtomicUnits("1.5");     // "1500000"

// Convert back to XNT
const XNT = atomicUnitsToWXNT("1000");       // 0.001

// Format for display
const display = formatWXNT("1000");           // "0.001 XNT"`

// ============================================================================
// FACILITATOR API EXAMPLES
// ============================================================================

export const facilitatorSupportedExample = `{
  "x402Version": 1,
  "networks": [{
    "scheme": "exact",
    "network": "x1-mainnet",
    "asset": "XNT_MINT_ADDRESS"
  }]
}`

export const facilitatorVerifyRequestExample = `{
  "scheme": "exact",
  "network": "x1-mainnet",
  "payTo": "MERCHANT_PUBKEY",
  "asset": "WXNT_MINT",
  "amount": "1000",
  "buyer": "BUYER_PUBKEY",
  "signature": "BASE58_SIGNATURE",
  "memo": null
}`

export const facilitatorVerifyResponseExample = `{
  "valid": true,
  "message": "verified"
}`

export const facilitatorSettleRequestExample = `{
  "scheme": "exact",
  "network": "x1-mainnet",
  "payTo": "MERCHANT_PUBKEY",
  "asset": "WXNT_MINT",
  "amount": "1000",
  "buyer": "BUYER_PUBKEY",
  "signature": "BASE58_SIGNATURE"
}`

export const facilitatorSettleResponseExample = `{
  "txHash": "ABC123...",
  "amount": "1000",
  "simulated": false
}`

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export const typeX402ConfigExample = `interface X402Config {
  facilitatorRegistryUrl?: string;  // Registry endpoint for multiple facilitators
  facilitatorUrl?: string;         // Single facilitator (fallback)
  facilitators?: Array<{
    id: string;
    name: string;
    url: string;
    fee: number;
    status: 'active' | 'inactive' | 'offline';
    network: 'x1-testnet' | 'x1-mainnet';
    address?: string;
  }>;
  network: string;                 // "x1-mainnet" or "x1-testnet"
  allowedNetworks?: string[];       // Optional: allow multiple networks
  payToAddress: string;             // Merchant wallet address
  tokenMint: string;                // XNT token mint address
  amount?: string;                  // Amount in atomic units
  getDynamicAmount?: (req) => Promise<string> | string;  // Optional dynamic pricing
  description?: string;
  resource?: string;
}`

export const typePaymentPayloadExample = `interface PaymentPayload {
  scheme: string;           // "exact"
  network: string;          // "x1-mainnet" or "x1-testnet"
  payTo: string;            // Merchant wallet address
  asset: string;            // XNT token mint address
  amount: string;           // Amount in atomic units
  buyer: string;            // Buyer wallet address
  signature: string;        // Base58-encoded ed25519 signature
  memo: string | null;      // Optional memo
}`

export const typePaymentResponseExample = `interface PaymentResponse {
  txHash: string;           // Transaction hash
  amount: string;           // Amount settled
  simulated: boolean;       // Whether simulated
  network?: string;         // Network identifier
  message?: string;         // Optional message
}`

// ============================================================================
// TESTING EXAMPLES
// ============================================================================

export const testingUnpaidRequestExample = `curl -i http://localhost:3000/premium/data

HTTP/1.1 402 Payment Required
X-Payment-Required: {"x402Version":1,"accepts":[...]}`

export const testingWithClientExample = `import { x402Client } from "@x1pay/client/axios";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(secretKey);

const response = await x402Client({
  url: "http://localhost:3000/premium/data",
  method: "GET",
  wallet: wallet
});

console.log(response.data);      // Your data
console.log(response.payment);   // Payment details`

// ============================================================================
// TROUBLESHOOTING EXAMPLES
// ============================================================================

export const troubleshootingCORSExample = `// Express CORS configuration
app.use(cors({
  origin: '*',
  exposedHeaders: ['X-Payment', 'X-Payment-Response', 'X-Payment-Required'],
  credentials: true
}));`

export const troubleshootingEnvExample = `# .env file location: packages/api/.env
PORT=3000
NETWORK=x1-testnet
MERCHANT_ADDRESS=YOUR_MERCHANT_PUBKEY
WXNT_MINT=So11111111111111111111111111111111111111112
FACILITATOR_URL=http://localhost:4000
FACILITATOR_REGISTRY_URL=http://localhost:3000`

// ============================================================================
// REFUND EXAMPLES (Bidirectional x402)
// ============================================================================

export const refundClientExample = `import { KeypairPermitSigner } from "@x1pay/client";
import { Keypair } from "@solana/web3.js";

// Initialize permit signer (no wallet popup!)
const wallet = Keypair.fromSecretKey(yourSecretKey);
const permitSigner = new KeypairPermitSigner(wallet);

// Create and sign refund request
const refundRequest = {
  scheme: 'exact',
  network: 'x1-testnet',
  payTo: buyerAddress,  // Refund recipient
  asset: 'So11111111111111111111111111111111111111112',
  amount: '1000',
  resource: '/refund',
  memo: \`Refund for txId: \${originalTxId}\`,
};

const { signedPayment, signedMessage } = await permitSigner.signPayment(refundRequest);

// Send signed refund request
const refundResponse = await fetch('http://localhost:3000/refund', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-Payment': JSON.stringify(signedPayment),
    'X-Payment-Message': signedMessage,
    'X-Refund-Request': 'true'
  },
  body: JSON.stringify({
    buyer: buyerAddress,
    amount: '1000',
    network: 'x1-testnet',
    txId: originalTxId,
    refundSignature: signedPayment.signature,
  }),
});

// Get refund proof from response header
const refundProof = refundResponse.headers.get('X-Refund-Proof');
const refundDetails = await refundResponse.json();

console.log('Refund TX:', refundDetails.txHash);
console.log('Refund Proof:', JSON.parse(refundProof));`

export const refundFacilitatorExample = `// Facilitator /refund endpoint - verifies signature and processes refund

app.post("/refund", async (req, res) => {
  const isX402RefundRequest = req.headers['x-refund-request'] === 'true';
  const rawMessage = req.headers['x-payment-message'] as string;
  
  const { txId, buyer, network, amount, refundSignature } = req.body;
  
  // Verify x402 refund signature
  if (isX402RefundRequest && refundSignature && rawMessage) {
    const buyerPubkey = new PublicKey(buyer);
    const signatureBytes = bs58.decode(refundSignature);
    const messageBytes = new TextEncoder().encode(rawMessage);
    
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      buyerPubkey.toBytes()
    );

    if (!isValid) {
      return res.status(400).json({
        error: "Invalid refund signature",
        message: "x402 refund request signature verification failed"
      });
    }
  }
  
  // Check Protocol Bond - ensure facilitator has adequate reserve
  await updateReserveBalance(network);
  
  if (!hasAdequateReserve(BigInt(amount))) {
    return res.status(503).json({
      error: 'Facilitator reserve insufficient',
      message: 'Protocol Bond requirements not met',
      bondStatus: {
        reserveBalance: stats.reserveBalance.toString(),
        healthScore: stats.bondHealthScore
      }
    });
  }
  
  // Process refund on blockchain
  const tx = new Transaction();
  tx.add(SystemProgram.transfer({
    fromPubkey: facilitatorWallet.publicKey,
    toPubkey: new PublicKey(buyer),
    lamports: Number(amount),
  }));
  
  const txHash = await connection.sendRawTransaction(tx.serialize());
  
  // Create X-Refund-Proof header
  const refundProof = {
    txHash,
    txId,
    amount: amount.toString(),
    network,
    type: 'refund',
    buyer,
    timestamp: Date.now(),
    protocol: 'x402v1'
  };

  res.setHeader('X-Refund-Proof', JSON.stringify(refundProof));
  res.json(refundProof);
});`

export const refundReactExample = `import { useState } from 'react';
import { KeypairPermitSigner } from '@x1pay/client';

function RefundButton({ originalTxId, buyerAddress, amount }) {
  const [refunding, setRefunding] = useState(false);
  const [refundTxHash, setRefundTxHash] = useState('');

  const handleRefund = async () => {
    setRefunding(true);
    
    try {
      // Sign refund request
      const refundRequest = {
        scheme: 'exact',
        network: 'x1-testnet',
        payTo: buyerAddress,
        asset: 'So11111111111111111111111111111111111111112',
        amount: amount.toString(),
        resource: '/refund',
        memo: \`Refund for \${originalTxId}\`,
      };

      const { signedPayment, signedMessage } = await permitSigner.signPayment(refundRequest);

      // Request refund
      const response = await fetch('/api/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Payment': JSON.stringify(signedPayment),
          'X-Payment-Message': signedMessage,
          'X-Refund-Request': 'true'
        },
        body: JSON.stringify({
          buyer: buyerAddress,
          amount: amount.toString(),
          network: 'x1-testnet',
          txId: originalTxId,
          refundSignature: signedPayment.signature,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const refundProof = response.headers.get('X-Refund-Proof');
        
        setRefundTxHash(result.txHash);
        console.log('Refund proof:', JSON.parse(refundProof));
      }
    } finally {
      setRefunding(false);
    }
  };

  return (
    <div>
      <button onClick={handleRefund} disabled={refunding}>
        {refunding ? 'Processing Refund...' : 'Request Refund'}
      </button>
      {refundTxHash && <p>Refund TX: {refundTxHash}</p>}
    </div>
  );
}`

// ============================================================================
// FACILITATOR DISCOVERY & AUTO-REGISTRATION
// ============================================================================

// Get auto-generated facilitator configuration example
export const facilitatorEnvExample = getExample('facilitator-env-alpha')?.code || generatedEnvVariables.map(v => 
  `${v.key}=${v.defaultValue || ''} # ${v.description}`
).join('\n')

// Get auto-generated auto-registration example
export const facilitatorAutoRegisterCode = getExample('facilitator-auto-register')?.code || `
// Facilitator automatically registers on startup
// Set AUTO_REGISTER=true in your .env file
`

export const clientFetchFacilitatorsExample = `import { fetchFacilitators, selectBestFacilitator } from '@x1pay/client';

// Fetch all available facilitators from registry
const facilitators = await fetchFacilitators(
  'http://localhost:3000', // API registry URL
  'x1-testnet'             // Network
);

console.log(\`Found \${facilitators.length} facilitators\`);
facilitators.forEach(f => {
  console.log(\`- \${f.name}: \${f.fee/100}% fee, status: \${f.status}\`);
});

// Smart selection based on criteria
const best = await selectBestFacilitator(facilitators, {
  maxFee: 20,              // Max 0.2% fee
  minSuccessRate: 95,      // Min 95% success rate
  sortBy: 'fee'            // Sort by lowest fee
});

console.log(\`Selected: \${best.name} with \${best.fee/100}% fee\`);`

export const middlewareAutoDiscoveryExample = `import { x402Middleware } from '@x1pay/middleware/express';
import express from 'express';

const app = express();

// Middleware automatically discovers facilitators from registry
app.use('/premium', x402Middleware({
  facilitatorRegistryUrl: process.env.REGISTRY_URL || 'http://localhost:3000',
  network: 'x1-testnet',
  payToAddress: process.env.MERCHANT_ADDRESS,
  tokenMint: 'So11111111111111111111111111111111111111112',
  amount: '1000',
  // Optional: Manual fallback if registry is unavailable
  facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000'
}));

app.get('/premium/data', (req, res) => {
  // Payment verified! Middleware automatically selected best facilitator
  res.json({ data: 'Premium content' });
});`

export const facilitatorHealthCheckExample = `// Check facilitator health and stats
curl http://localhost:4000/health

// Response includes Protocol Bond status
{
  "ok": true,
  "facilitatorId": "alpha",
  "facilitatorName": "Alpha Facilitator",
  "feeBasisPoints": 10,
  "network": "x1-testnet",
  "uptime": 99.9,
  "stats": {
    "totalSettlements": 1337,
    "totalRefunds": 0,
    "successRate": 100
  }
}

// Check detailed stats including blockchain validation
curl http://localhost:4000/stats?network=x1-testnet&validate=true

// Response includes Protocol Bond health
{
  "successfulSettlements": 1337,
  "protocolBond": {
    "reserveBalance": "100000000",
    "pendingRefundLiability": "0",
    "minimumReserveRequired": "10000000",
    "bondHealthScore": 100,
    "status": "healthy",
    "canAcceptPayments": true,
    "coverageRatio": "10.0x"
  },
  "blockchainValidation": {
    "blockchainCount": 1337,
    "discrepancy": 0,
    "usingBlockchain": false
  }
}`

// API Endpoints for Facilitator Registry (auto-generated)
export const apiRegisterFacilitatorEndpoint = getEndpoint('/facilitators/register', 'POST')
export const apiHeartbeatEndpoint = getEndpoint('/facilitators/heartbeat', 'POST')
export const apiListFacilitatorsEndpoint = getEndpoint('/facilitators?network=x1-testnet&health=true', 'GET')

// Type definitions (auto-generated from source)
export const typeFacilitatorInfo = getType('FacilitatorInfo')?.definition
export const typeFacilitatorSelectionOptions = getType('FacilitatorSelectionOptions')?.definition
