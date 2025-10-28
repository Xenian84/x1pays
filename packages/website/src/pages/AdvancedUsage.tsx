import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import SettingsIcon from '@mui/icons-material/Settings'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import ErrorIcon from '@mui/icons-material/Error'
import SecurityIcon from '@mui/icons-material/Security'
import CodeIcon from '@mui/icons-material/Code'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import SchemaIcon from '@mui/icons-material/Schema'
import CodeBlock from '../components/CodeBlock'

const AdvancedUsage = () => {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} sx={{ mb: 8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
            Advanced Usage
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Learn how to use constants, validation helpers, error handling, and type guards for production-ready x402 implementations.
          </Typography>
        </Stack>

        <Stack spacing={8}>
          {/* Constants Section */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Constants
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Import and use type-safe constants instead of hardcoding values
                </Typography>
              </Box>
            </Stack>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'primary.dark', mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <CodeBlock 
                  code={`import { 
  NETWORKS, 
  FACILITATOR_URLS, 
  X402_VERSION,
  PAYMENT_SCHEME,
  MAX_PAYMENT_AMOUNT,
  X402_HEADERS
} from '@x1pays/client'

// Network constants
const network = NETWORKS.X1_MAINNET  // 'x1-mainnet'
const testNetwork = NETWORKS.X1_TESTNET  // 'x1-testnet'

// Facilitator URLs
const facilitatorUrl = FACILITATOR_URLS.MAINNET
// 'https://facilitator.x1pays.xyz'

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
                  language="typescript" 
                />
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'secondary.dark' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Server Configuration with Constants
                </Typography>
                <CodeBlock 
                  code={`import { x402Middleware } from '@x1pays/middleware'
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
                  language="typescript" 
                />
              </CardContent>
            </Card>
          </Box>

          {/* Validation Helpers Section */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(118, 255, 3, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VerifiedUserIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Validation Helpers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use built-in validation helpers for runtime validation with clear error messages
                </Typography>
              </Box>
            </Stack>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'secondary.dark' }}>
              <CardContent sx={{ p: 4 }}>
                <CodeBlock 
                  code={`import { 
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
                  language="typescript" 
                />
              </CardContent>
            </Card>
          </Box>

          {/* Error Handling Section */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ErrorIcon sx={{ fontSize: 32, color: 'error.main' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Error Handling
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Handle specific error types for better debugging and user experience
                </Typography>
              </Box>
            </Stack>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'error.dark', mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <CodeBlock 
                  code={`import { 
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
                  language="typescript" 
                />
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'warning.dark' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Server-Side Error Handling
                </Typography>
                <CodeBlock 
                  code={`import { InvalidSignatureError, NetworkError } from '@x1pays/client'

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
                  language="typescript" 
                />
              </CardContent>
            </Card>
          </Box>

          {/* Type Guards Section */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 183, 77, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SecurityIcon sx={{ fontSize: 32, color: 'warning.main' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Type Guards
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use type guards for runtime type checking in TypeScript
                </Typography>
              </Box>
            </Stack>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'warning.dark' }}>
              <CardContent sx={{ p: 4 }}>
                <CodeBlock 
                  code={`import { 
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
  // TypeScript knows network is 'x1-mainnet' | 'x1-testnet'
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
                  language="typescript" 
                />
              </CardContent>
            </Card>
          </Box>

          {/* Zod Schemas Section */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SchemaIcon sx={{ fontSize: 32, color: 'info.main' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Zod Schemas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Import Zod schemas for runtime validation in your own code
                </Typography>
              </Box>
            </Stack>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'info.dark' }}>
              <CardContent sx={{ p: 4 }}>
                <CodeBlock 
                  code={`import { 
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
  facilitatorUrl: 'https://facilitator.x1pays.xyz',
  network: 'x1-mainnet',
  payToAddress: 'merchant_wallet_address',
  tokenMint: 'wxnt_mint_address',
  amount: '1000'
})

// Validate client config
const clientConfig = ClientConfigSchema.parse({
  wallet: keypair,
  facilitatorUrl: 'https://facilitator.x1pays.xyz',
  network: 'x1-mainnet',
  maxRetries: 3,
  paymentTimeout: 10000
})`} 
                  language="typescript" 
                />
              </CardContent>
            </Card>
          </Box>

          {/* Best Practices Section */}
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
              Best Practices
            </Typography>
            
            <Stack spacing={3}>
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ 
                  bgcolor: 'rgba(118, 255, 3, 0.1)',
                  border: '1px solid',
                  borderColor: 'secondary.dark',
                  '& .MuiAlert-icon': { color: 'secondary.main' },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'secondary.main' }}>
                  ✓ DO
                </Typography>
                <Stack spacing={1}>
                  {[
                    'Use constants like NETWORKS and FACILITATOR_URLS instead of hardcoded strings',
                    'Use validation helpers to catch errors early',
                    'Handle specific error types for better user experience',
                    'Use type guards for runtime type safety',
                    'Validate configuration with Zod schemas before starting',
                    'Verify payment signatures cryptographically with verifyPaymentSignature()',
                  ].map((item, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <Box component="span" sx={{ color: 'secondary.main' }}>•</Box>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Alert>

              <Alert 
                severity="error" 
                icon={<CancelIcon />}
                sx={{ 
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid',
                  borderColor: 'error.dark',
                  '& .MuiAlert-icon': { color: 'error.main' },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>
                  ✗ DON'T
                </Typography>
                <Stack spacing={1}>
                  {[
                    "Don't hardcode network names like 'x1-mainnet' - use NETWORKS.X1_MAINNET",
                    "Don't skip validation - it catches errors before they reach production",
                    "Don't use generic error handling - catch specific error types",
                    "Don't accept unverified payments - always verify signatures",
                    "Don't use floating-point arithmetic for amounts - use string-based atomic units",
                    "Don't ignore error details - they contain debugging information",
                  ].map((item, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <Box component="span" sx={{ color: 'error.main' }}>•</Box>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Alert>
            </Stack>
          </Box>

          {/* Complete Example Section */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CodeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Complete Example
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Production-ready implementation using all advanced features
                </Typography>
              </Box>
            </Stack>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'primary.dark' }}>
              <CardContent sx={{ p: 4 }}>
                <CodeBlock 
                  code={`import express from 'express'
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
                  language="typescript"
                  filename="server.ts"
                />
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default AdvancedUsage
