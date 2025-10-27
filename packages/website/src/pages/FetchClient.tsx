import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BoltIcon from '@mui/icons-material/Bolt'
import CodeBlock from '../components/CodeBlock'

const FetchClient = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Box sx={{ mb: 8 }}>
          <Button
            component={Link}
            to="/facilitator"
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 4,
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)' }
            }}
          >
            Back to Facilitator
          </Button>
          <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Fetch API Client Quickstart
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Use native Fetch API with x402 payment protocol - zero dependencies.
          </Typography>
        </Box>

        {/* Installation */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Installation</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Install the lightweight x402 fetch wrapper:
          </Typography>
          <CodeBlock code="npm install @x1pays/client" language="bash" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Uses native Fetch API with automatic x402 payment handling.
          </Typography>
        </Box>

        {/* Basic Usage */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Basic Usage</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Simple paid requests with fetch:
          </Typography>
          <CodeBlock
            code={`import { fetchX402JSON } from '@x1pays/client/fetch'
import { Keypair } from '@solana/web3.js'

const wallet = Keypair.fromSecretKey(
  Buffer.from(process.env.WALLET_SECRET_KEY!, 'base64')
)

// Make paid request  
const response = await fetchX402JSON(
  'https://api.example.com/premium/data',
  { 
    method: 'GET',
    wallet 
  }
)

console.log('Data:', response.data)
console.log('Payment:', response.payment)`}
            language="typescript"
          />
        </Box>

        {/* Manual Implementation */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Manual Implementation</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Understand how x402 works by implementing it manually with native fetch:
          </Typography>
          <CodeBlock
            code={`import * as nacl from 'tweetnacl'
import bs58 from 'bs58'

async function fetchWithPayment(url, wallet) {
  // 1. Try initial request
  let response = await fetch(url)
  
  // 2. If payment required, handle it
  if (response.status === 402) {
    const paymentReq = JSON.parse(
      response.headers.get('X-Payment-Required')
    )
    
    // 3. Create and sign payment
    const payment = {
      scheme: paymentReq.scheme,
      network: paymentReq.network,
      payTo: paymentReq.payTo,
      asset: paymentReq.asset,
      amount: paymentReq.amount,
      buyer: wallet.publicKey.toBase58(),
      memo: null
    }
    
    const message = Buffer.from(JSON.stringify(payment))
    const signature = nacl.sign.detached(
      message,
      wallet.secretKey
    )
    payment.signature = bs58.encode(signature)
    
    // 4. Send to facilitator
    const settleRes = await fetch(
      \`\${paymentReq.facilitatorUrl}/settle\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }
    )
    
    const settlement = await settleRes.json()
    
    // 5. Retry original request with payment proof
    response = await fetch(url, {
      headers: {
        'X-Payment': JSON.stringify({
          ...payment,
          txHash: settlement.txHash
        })
      }
    })
  }
  
  return response
}

// Usage
const res = await fetchWithPayment(
  'https://api.example.com/premium/data',
  wallet
)
const data = await res.json()`}
            language="typescript"
          />
        </Box>

        {/* POST Requests */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>POST Requests</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Send data with paid requests:
          </Typography>
          <CodeBlock
            code={`const response = await fetchX402(
  'https://api.example.com/analyze',
  {
    method: 'POST',
    wallet: wallet,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: 'data to analyze',
      options: {
        detailed: true
      }
    })
  }
)

const result = await response.json()`}
            language="typescript"
          />
        </Box>

        {/* Error Handling */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Error Handling</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Handle errors gracefully:
          </Typography>
          <CodeBlock
            code={`async function safeFetch(url, wallet) {
  try {
    const response = await fetchX402(url, { wallet })
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
    }
    
    return await response.json()
  } catch (error) {
    if (error.name === 'PaymentError') {
      console.error('Payment failed:', error.message)
      // Handle payment-specific errors
    } else if (error.name === 'NetworkError') {
      console.error('Network error:', error.message)
      // Handle network issues
    } else {
      console.error('Unknown error:', error)
    }
    
    throw error
  }
}`}
            language="typescript"
          />
        </Box>

        {/* Browser Integration */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Browser Integration</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Use in browser with wallet extensions:
          </Typography>
          <CodeBlock
            code={`import { fetchX402JSON } from '@x1pays/client/fetch'

async function fetchPremiumData() {
  // Connect wallet
  const wallet = window.solana
  await wallet.connect()
  
  // Make paid request
  const response = await fetchX402JSON(
    'https://api.example.com/premium/data',
    { 
      method: 'GET',
      wallet 
    }
  )
  
  document.getElementById('result').textContent = 
    JSON.stringify(response.data, null, 2)
}`}
            language="typescript"
          />
        </Box>

        {/* React Hooks */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>React Hooks</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create reusable hooks for paid API calls:
          </Typography>
          <CodeBlock
            code={`import { useState, useCallback } from 'react'
import { fetchX402JSON } from '@x1pays/client/fetch'

function usePaidFetch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetch = useCallback(async (url, wallet, options = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetchX402JSON(url, {
        method: 'GET',
        ...options,
        wallet
      })
      
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { fetch, loading, error }
}

// Usage in component
function PremiumContent({ wallet }) {
  const { fetch, loading, error } = usePaidFetch()
  const [data, setData] = useState(null)
  
  const loadData = async () => {
    const result = await fetch(
      'https://api.example.com/premium/data',
      wallet
    )
    setData(result)
  }
  
  return (
    <div>
      <button onClick={loadData} disabled={loading}>
        {loading ? 'Loading...' : 'Get Data'}
      </button>
      {error && <Typography color="error">{error}</Typography>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}`}
            language="typescript"
          />
        </Box>

        {/* Streaming Responses */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Streaming Responses</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Handle streaming responses with payments:
          </Typography>
          <CodeBlock
            code={`async function streamPaidData(url, wallet) {
  const response = await fetchX402(url, { wallet })
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    console.log('Received chunk:', chunk)
    
    // Process streaming data
    processChunk(chunk)
  }
}

// Usage for AI streaming responses
await streamPaidData(
  'https://api.example.com/ai/stream',
  wallet
)`}
            language="typescript"
          />
        </Box>

        {/* Comparison with Axios */}
        <Card
          elevation={0}
          sx={{ transition: 'all 0.3s ease',
            mb: 8,
            border: '1px solid',
            borderColor: 'primary.dark',
            bgcolor: 'rgba(0, 229, 255, 0.03)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 4 }}>
              Fetch vs Axios
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Fetch Advantages</Typography>
                </Box>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'success.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Zero dependencies (native browser API)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'success.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Smaller bundle size</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'success.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Modern Promise-based API</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'success.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Better streaming support</Typography>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BoltIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Axios Advantages</Typography>
                </Box>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'warning.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Automatic JSON transformation</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'warning.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Built-in timeout support</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'warning.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Better error handling</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'warning.main', mt: 0.5 }}>•</Box>
                    <Typography variant="body2" color="text.secondary">Request/response interceptors</Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 4, fontSize: '2rem' }}>Next Steps</Typography>
          <Stack spacing={3}>
            <Card
              component={Link}
              to="/examples"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'error.dark',
                '&:hover': {
                  borderColor: 'error.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>View Complete Examples</Typography>
                <Typography variant="body2" color="text.secondary">
                  See full fetch-based applications
                </Typography>
              </CardContent>
            </Card>
            <Card
              component={Link}
              to="/quickstart/axios"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'error.dark',
                '&:hover': {
                  borderColor: 'error.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Compare with Axios</Typography>
                <Typography variant="body2" color="text.secondary">
                  See the Axios client implementation
                </Typography>
              </CardContent>
            </Card>
            <Card
              component={Link}
              to="/quickstart/servers"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'error.dark',
                '&:hover': {
                  borderColor: 'error.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build a Server</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create an x402-enabled API
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default FetchClient;
