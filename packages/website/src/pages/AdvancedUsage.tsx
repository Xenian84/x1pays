const AdvancedUsage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Advanced Usage</h1>
      
      <p className="text-lg text-gray-700 mb-8">
        Learn how to use constants, validation helpers, error handling, and type guards for production-ready x402 implementations.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Constants</h2>
        <p className="text-gray-700 mb-4">
          Import and use type-safe constants instead of hardcoding values:
        </p>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-6">
          <pre className="text-sm text-gray-300">
{`import { 
  NETWORKS, 
  FACILITATOR_URLS, 
  X402_VERSION,
  PAYMENT_SCHEME,
  MAX_PAYMENT_AMOUNT,
  X402_HEADERS
} from '@x1pays/client'

// Network constants
const network = NETWORKS.X1_MAINNET  // 'x1-mainnet'
const devNetwork = NETWORKS.X1_DEVNET  // 'x1-devnet'

// Facilitator URLs
const facilitatorUrl = FACILITATOR_URLS.MAINNET
// 'https://facilitator.x1pays.network'

// Protocol constants
console.log(X402_VERSION)  // 1
console.log(PAYMENT_SCHEME)  // 'x402'
console.log(MAX_PAYMENT_AMOUNT)  // 1000000000

// Header names
const headers = {
  [X402_HEADERS.PAYMENT]: paymentData,
  [X402_HEADERS.PAYMENT_REQUIRED]: requirementData,
  [X402_HEADERS.PAYMENT_RESPONSE]: responseData
}`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Server Configuration with Constants</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`import { x402Middleware } from '@x1pays/middleware'
import { NETWORKS, FACILITATOR_URLS } from '@x1pays/client'

app.get('/premium/data',
  x402Middleware({
    facilitatorUrl: FACILITATOR_URLS.MAINNET,
    network: NETWORKS.X1_MAINNET,
    payToAddress: process.env.MERCHANT_WALLET!,
    tokenMint: process.env.WXNT_MINT!,
    amount: '1000'
  }),
  (req, res) => {
    res.json({ data: 'Premium content' })
  }
)`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Validation Helpers</h2>
        <p className="text-gray-700 mb-4">
          Use built-in validation helpers for runtime validation with clear error messages:
        </p>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`import { 
  validatePaymentPayload,
  validatePaymentRequirement,
  validatePaymentResponse,
  validateAmount,
  validateNetwork,
  verifyPaymentSignature
} from '@x1pays/client'

// Validate payment structure
try {
  validatePaymentPayload(paymentData)
  console.log('✓ Payment payload is valid')
} catch (error) {
  console.error('Invalid payment:', error.message)
}

// Validate 402 response
try {
  const requirement = validatePaymentRequirement(requirementData)
  console.log('Accepts:', requirement.accepts)
} catch (error) {
  console.error('Invalid requirement:', error.message)
}

// Validate payment amount (atomic units)
try {
  validateAmount('1000')  // ✓ Valid
  validateAmount('1000.5')  // ✗ Throws InvalidAmountError
  validateAmount('-100')  // ✗ Throws InvalidAmountError
} catch (error) {
  console.error('Invalid amount:', error.message)
}

// Validate network
try {
  validateNetwork('x1-mainnet')  // ✓ Valid
  validateNetwork('ethereum')  // ✗ Throws InvalidNetworkError
} catch (error) {
  console.error('Invalid network:', error.message)
}

// Cryptographically verify payment signature
const isValid = await verifyPaymentSignature(payment)
if (!isValid) {
  throw new Error('Payment signature verification failed')
}`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
        <p className="text-gray-700 mb-4">
          Handle specific error types for better debugging and user experience:
        </p>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-6">
          <pre className="text-sm text-gray-300">
{`import { 
  InvalidSignatureError,
  InsufficientFundsError,
  NetworkError,
  PaymentTimeoutError,
  InvalidAmountError,
  InvalidNetworkError,
  PaymentVerificationError,
  InvalidConfigError
} from '@x1pays/client'

async function makePayment() {
  try {
    const response = await x402Client({
      url: 'https://api.example.com/premium',
      method: 'GET',
      wallet: wallet
    })
    return response.data
  } catch (error) {
    if (error instanceof InvalidSignatureError) {
      console.error('Signature validation failed:', error.message)
      console.error('Details:', error.details)
      // Handle: Ask user to retry or check wallet
    } else if (error instanceof InsufficientFundsError) {
      console.error('Insufficient funds:', error.message)
      // Handle: Show user their balance, suggest top-up
    } else if (error instanceof NetworkError) {
      console.error('Network connection failed:', error.message)
      // Handle: Retry or show offline message
    } else if (error instanceof PaymentTimeoutError) {
      console.error('Payment timed out:', error.message)
      // Handle: Retry payment or check facilitator status
    } else if (error instanceof InvalidAmountError) {
      console.error('Invalid payment amount:', error.message)
      // Handle: Fix amount formatting
    } else if (error instanceof InvalidNetworkError) {
      console.error('Unsupported network:', error.message)
      // Handle: Switch to correct network
    } else if (error instanceof PaymentVerificationError) {
      console.error('Payment verification failed:', error.message)
      // Handle: Check payment details and retry
    } else {
      console.error('Unexpected error:', error)
      // Handle: Generic error fallback
    }
  }
}`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Server-Side Error Handling</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`import { InvalidSignatureError, NetworkError } from '@x1pays/client'

app.post('/verify-payment', async (req, res) => {
  try {
    const isValid = await verifyPaymentSignature(req.body)
    if (!isValid) {
      throw new InvalidSignatureError('Signature verification failed')
    }
    res.json({ verified: true })
  } catch (error) {
    if (error instanceof InvalidSignatureError) {
      return res.status(400).json({
        error: 'InvalidSignature',
        message: error.message,
        details: error.details
      })
    }
    if (error instanceof NetworkError) {
      return res.status(503).json({
        error: 'ServiceUnavailable',
        message: 'Facilitator connection failed',
        details: error.details
      })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Type Guards</h2>
        <p className="text-gray-700 mb-4">
          Use type guards for runtime type checking in TypeScript:
        </p>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`import { 
  isWalletSigner,
  isValidPaymentPayload,
  isValidPaymentRequirement,
  isValidPaymentResponse,
  isValidNetwork,
  assertWalletSigner,
  assertValidNetwork
} from '@x1pays/client'

// Check if object is a valid wallet
if (isWalletSigner(wallet)) {
  // TypeScript knows wallet has .signMessage() method
  const signature = await wallet.signMessage(message)
}

// Validate payment data
if (isValidPaymentPayload(data)) {
  // TypeScript knows data is PaymentPayload
  console.log(data.buyer, data.amount, data.signature)
}

// Validate 402 response
if (isValidPaymentRequirement(response)) {
  // TypeScript knows response is PaymentRequirement
  response.accepts.forEach(accept => {
    console.log(accept.payTo, accept.maxAmountRequired)
  })
}

// Validate settlement response
if (isValidPaymentResponse(settlement)) {
  // TypeScript knows settlement is PaymentResponse
  console.log(settlement.txHash, settlement.amount)
}

// Check network value
const network: string = getUserInput()
if (isValidNetwork(network)) {
  // TypeScript knows network is 'x1-mainnet' | 'x1-devnet'
  await connectToNetwork(network)
}

// Assertion helpers (throw if invalid)
try {
  assertWalletSigner(wallet)  // Throws if not a wallet
  assertValidNetwork(network)  // Throws InvalidNetworkError
  
  // Continue with type-safe code
  const signature = await wallet.signMessage(message)
} catch (error) {
  console.error('Validation failed:', error.message)
}`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Zod Schemas</h2>
        <p className="text-gray-700 mb-4">
          Import Zod schemas for runtime validation in your own code:
        </p>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`import { 
  PaymentPayloadSchema,
  PaymentRequirementSchema,
  PaymentResponseSchema,
  MiddlewareConfigSchema,
  ClientConfigSchema
} from '@x1pays/client'

// Parse and validate payment
const result = PaymentPayloadSchema.safeParse(data)
if (result.success) {
  const payment = result.data
  console.log('Valid payment:', payment)
} else {
  console.error('Validation errors:', result.error.issues)
}

// Validate 402 requirement
try {
  const requirement = PaymentRequirementSchema.parse(response)
  console.log('Valid requirement with', requirement.accepts.length, 'options')
} catch (error) {
  console.error('Invalid requirement:', error.message)
}

// Validate middleware config
const config = MiddlewareConfigSchema.parse({
  facilitatorUrl: 'https://facilitator.x1pays.network',
  network: 'x1-mainnet',
  payToAddress: 'merchant_wallet_address',
  tokenMint: 'wxnt_mint_address',
  amount: '1000'
})

// Validate client config
const clientConfig = ClientConfigSchema.parse({
  wallet: keypair,
  facilitatorUrl: 'https://facilitator.x1pays.network',
  network: 'x1-mainnet',
  maxRetries: 3,
  paymentTimeout: 10000
})`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">✓ DO</h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Use constants like <code className="bg-blue-100 px-2 py-1 rounded">NETWORKS</code> and <code className="bg-blue-100 px-2 py-1 rounded">FACILITATOR_URLS</code> instead of hardcoded strings</li>
            <li>Use validation helpers to catch errors early</li>
            <li>Handle specific error types for better user experience</li>
            <li>Use type guards for runtime type safety</li>
            <li>Validate configuration with Zod schemas before starting</li>
            <li>Verify payment signatures cryptographically with <code className="bg-blue-100 px-2 py-1 rounded">verifyPaymentSignature()</code></li>
          </ul>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">✗ DON'T</h3>
          <ul className="list-disc list-inside space-y-2 text-red-800">
            <li>Don't hardcode network names like <code className="bg-red-100 px-2 py-1 rounded">'x1-mainnet'</code> - use <code className="bg-red-100 px-2 py-1 rounded">NETWORKS.X1_MAINNET</code></li>
            <li>Don't skip validation - it catches errors before they reach production</li>
            <li>Don't use generic error handling - catch specific error types</li>
            <li>Don't accept unverified payments - always verify signatures</li>
            <li>Don't use floating-point arithmetic for amounts - use string-based atomic units</li>
            <li>Don't ignore error details - they contain debugging information</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Example</h2>
        <p className="text-gray-700 mb-4">
          Production-ready implementation using all advanced features:
        </p>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`import express from 'express'
import { x402Middleware } from '@x1pays/middleware'
import { 
  NETWORKS,
  FACILITATOR_URLS,
  validatePaymentPayload,
  verifyPaymentSignature,
  InvalidSignatureError,
  NetworkError,
  PaymentTimeoutError,
  isValidPaymentPayload
} from '@x1pays/client'

const app = express()
app.use(express.json())

app.get('/premium/data',
  x402Middleware({
    facilitatorUrl: FACILITATOR_URLS.MAINNET,
    network: NETWORKS.X1_MAINNET,
    payToAddress: process.env.MERCHANT_WALLET!,
    tokenMint: process.env.WXNT_MINT!,
    amount: '1000',
    getDynamicAmount: async (req) => {
      const tier = req.query.tier as string
      return tier === 'premium' ? '5000' : '1000'
    }
  }),
  (req, res) => {
    const payment = res.locals
    res.json({
      data: { premium: 'content' },
      payment: {
        txHash: payment.txHash,
        amount: payment.amount,
        simulated: payment.simulated
      }
    })
  }
)

// Manual validation endpoint
app.post('/validate-payment', async (req, res) => {
  try {
    // Check if data is valid payment payload
    if (!isValidPaymentPayload(req.body)) {
      return res.status(400).json({ error: 'Invalid payment format' })
    }

    // Validate payment structure
    validatePaymentPayload(req.body)

    // Verify signature cryptographically
    const isValid = await verifyPaymentSignature(req.body)
    if (!isValid) {
      throw new InvalidSignatureError('Signature verification failed')
    }

    res.json({ verified: true, payment: req.body })
  } catch (error) {
    if (error instanceof InvalidSignatureError) {
      return res.status(400).json({
        error: 'InvalidSignature',
        message: error.message,
        details: error.details
      })
    }
    if (error instanceof NetworkError) {
      return res.status(503).json({
        error: 'ServiceUnavailable',
        message: 'Cannot reach facilitator'
      })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(3000, () => {
  console.log('✓ Server running on port 3000')
  console.log('✓ Using network:', NETWORKS.X1_MAINNET)
  console.log('✓ Facilitator URL:', FACILITATOR_URLS.MAINNET)
})`}
          </pre>
        </div>
      </section>
    </div>
  )
}

export default AdvancedUsage
