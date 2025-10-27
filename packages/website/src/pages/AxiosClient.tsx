import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CodeBlock from '../components/CodeBlock'

const AxiosClient = () => {
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
            Axios Client Quickstart
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Build x402-enabled HTTP clients with Axios for automatic payment handling.
          </Typography>
        </Box>

        {/* Installation */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Installation</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Install Axios and the x402 client package:
          </Typography>
          <CodeBlock code="npm install @x1pays/client" language="bash" />
        </Box>

        {/* Basic Usage */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Basic Usage</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Make paid API calls with automatic payment handling:
          </Typography>
          <CodeBlock
            code={`import { x402Client } from '@x1pays/client/axios'
import { Keypair } from '@solana/web3.js'

// Your wallet (for signing payments)
const wallet = Keypair.fromSecretKey(
  Buffer.from(process.env.WALLET_SECRET_KEY!, 'base64')
)

// Make a paid request - payment happens automatically!
async function getPremiumData() {
  try {
    const response = await x402Client({
      url: 'https://api.example.com/premium/data',
      method: 'GET',
      wallet: wallet
    })
    
    console.log('Data:', response.data)
    console.log('Payment TX:', response.payment?.txHash)
    console.log('Amount paid:', response.payment?.amount)
  } catch (error) {
    console.error('Request failed:', error)
  }
}`}
            language="typescript"
          />
        </Box>

        {/* How It Works */}
        <Card
          elevation={0}
          sx={{ transition: 'all 0.3s ease',
            mb: 8,
            border: '1px solid',
            borderColor: 'info.dark',
            bgcolor: 'rgba(0, 229, 255, 0.05)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AutorenewIcon sx={{ color: 'info.main', fontSize: 28 }} />
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                How It Works
              </Typography>
            </Box>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', minWidth: 24 }}>1.</Typography>
                <Typography color="text.secondary">Client makes initial request to protected endpoint</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', minWidth: 24 }}>2.</Typography>
                <Typography color="text.secondary">
                  Server responds with <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1 }}>402 Payment Required</Box> + payment details
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', minWidth: 24 }}>3.</Typography>
                <Typography color="text.secondary">Client automatically signs payment and sends to facilitator</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', minWidth: 24 }}>4.</Typography>
                <Typography color="text.secondary">Facilitator settles payment on X1 blockchain</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', minWidth: 24 }}>5.</Typography>
                <Typography color="text.secondary">Client retries request with payment proof</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', minWidth: 24 }}>6.</Typography>
                <Typography color="text.secondary">Server verifies payment and returns protected data</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* POST Requests */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>POST Requests with Data</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Send data along with payments:
          </Typography>
          <CodeBlock
            code={`async function analyzeData(data: string) {
  const response = await x402Client({
    url: 'https://api.example.com/analyze',
    method: 'POST',
    wallet: wallet,
    data: {
      input: data,
      options: {
        detailed: true,
        format: 'json'
      }
    }
  })
  
  return response.data
}`}
            language="typescript"
          />
        </Box>

        {/* Custom Headers */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Custom Headers</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add custom headers to your requests:
          </Typography>
          <CodeBlock
            code={`const response = await x402Client({
  url: 'https://api.example.com/premium/data',
  method: 'GET',
  wallet: wallet,
  headers: {
    'Authorization': \`Bearer \${apiToken}\`,
    'X-Client-Version': '1.0.0'
  }
})`}
            language="typescript"
          />
        </Box>

        {/* Error Handling */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Error Handling</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Handle different error scenarios:
          </Typography>
          <CodeBlock
            code={`async function robustRequest() {
  try {
    const response = await x402Client({
      url: 'https://api.example.com/premium/data',
      wallet: wallet
    })
    
    return response.data
  } catch (error: any) {
    if (error.response?.status === 402) {
      console.error('Payment required but failed:', error.message)
      // Handle payment failure
    } else if (error.response?.status === 400) {
      console.error('Invalid payment:', error.message)
      // Payment was invalid
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      console.error('Wallet has insufficient balance')
      // Handle insufficient funds
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network connection failed')
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

        {/* Retry Logic */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Retry Logic</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The client includes automatic retry logic for transient failures:
          </Typography>
          <CodeBlock
            code={`const response = await x402Client({
  url: 'https://api.example.com/premium/data',
  wallet: wallet,
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // ms
    retryOn: [408, 429, 500, 502, 503, 504]
  }
})`}
            language="typescript"
          />
        </Box>

        {/* Timeout Configuration */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Timeout Configuration</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Set request timeouts:
          </Typography>
          <CodeBlock
            code={`const response = await x402Client({
  url: 'https://api.example.com/long-task',
  wallet: wallet,
  timeout: 30000, // 30 seconds
  paymentTimeout: 10000 // 10 seconds for payment settlement
})`}
            language="typescript"
          />
        </Box>

        {/* Multiple Requests */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Multiple Requests</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Make multiple paid requests to the same API:
          </Typography>
          <CodeBlock
            code={`import { x402Client } from '@x1pays/client/axios'

const baseConfig = {
  wallet: wallet,
  headers: {
    'X-Client-Version': '1.0.0'
  }
}

// Make multiple requests
const userData = await x402Client({
  ...baseConfig,
  url: 'https://api.example.com/users/me',
  method: 'GET'
})

const analytics = await x402Client({
  ...baseConfig,
  url: 'https://api.example.com/analytics',
  method: 'POST',
  data: { event: 'page_view' }
})

// Each request automatically handles x402 payments`}
            language="typescript"
          />
        </Box>

        {/* React Integration */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>React Integration</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Use x402 client in React applications:
          </Typography>
          <CodeBlock
            code={`import { useState, useEffect } from 'react'
import { x402Client } from '@x1pays/client/axios'

function PremiumContent({ wallet }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchPremiumData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await x402Client({
        url: 'https://api.example.com/premium/data',
        method: 'GET',
        wallet: wallet
      })
      
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <button onClick={fetchPremiumData} disabled={loading}>
        {loading ? 'Processing Payment...' : 'Get Premium Data'}
      </button>
      
      {error && <Typography color="error">{error}</Typography>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}`}
            language="typescript"
          />
        </Box>

        {/* Browser Usage */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Browser Usage</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Use in browser with wallet extensions:
          </Typography>
          <CodeBlock
            code={`// Connect to browser wallet (e.g., Phantom, Backpack)
const wallet = window.solana

if (!wallet) {
  alert('Please install a Solana wallet extension')
  return
}

await wallet.connect()

// Make paid requests with connected wallet
const response = await x402Client({
  url: 'https://api.example.com/premium/data',
  wallet: wallet
})`}
            language="typescript"
          />
        </Box>

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
                borderColor: 'warning.dark',
                '&:hover': {
                  borderColor: 'warning.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>View Complete Examples</Typography>
                <Typography variant="body2" color="text.secondary">
                  See full React and Node.js applications
                </Typography>
              </CardContent>
            </Card>
            <Card
              component={Link}
              to="/quickstart/express"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'warning.dark',
                '&:hover': {
                  borderColor: 'warning.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build a Server</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create an x402-enabled API to consume
                </Typography>
              </CardContent>
            </Card>
            <Card
              component={Link}
              to="/troubleshooting"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'warning.dark',
                '&:hover': {
                  borderColor: 'warning.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Troubleshooting</Typography>
                <Typography variant="body2" color="text.secondary">
                  Common issues and solutions
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AxiosClient;
