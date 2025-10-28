import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CodeBlock from '../components/CodeBlock'

const ExpressQuickstart = () => {
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
            Express.js Quickstart
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Build an x402-enabled API server with Express.js in minutes.
          </Typography>
        </Box>

        {/* Installation */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Installation</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Install Express and the x402 middleware package:
          </Typography>
          <CodeBlock code="npm install express @x1pays/middleware" language="bash" />
        </Box>

        {/* Basic Setup */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Basic Setup</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create a simple Express server with x402 payment protection:
          </Typography>
          <CodeBlock
            code={`import express from 'express'
import { x402Middleware } from '@x1pays/middleware'

const app = express()
app.use(express.json())

// Configure x402 middleware
const paymentMiddleware = x402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: '1000'  // 0.001 wXNT
})

// Free endpoint - no payment required
app.get('/api/public/hello', (req, res) => {
  res.json({ message: 'This is free!' })
})

// Premium endpoint - requires payment
app.get('/api/premium/data',
  paymentMiddleware,
  (req, res) => {
    // Payment verified! Access payment details:
    const txHash = res.locals.txHash
    const amount = res.locals.amount
    
    res.json({
      data: 'Premium content here',
      payment: {
        txHash,
        amount,
        simulated: res.locals.simulated
      }
    })
  }
)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})`}
            language="typescript"
          />
        </Box>

        {/* Environment Variables */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Environment Variables</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create a <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1 }}>.env</Box> file:
          </Typography>
          <CodeBlock
            code={`# Your merchant wallet (receives payments)
MERCHANT_WALLET=your_x1_wallet_address

# wXNT token contract on X1
WXNT_MINT=your_wxnt_mint_address

# Network (x1-mainnet or x1-testnet)
NETWORK=x1-mainnet

# Port
PORT=3000`}
            language="bash"
          />
        </Box>

        {/* Advanced: Dynamic Pricing */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Advanced: Dynamic Pricing</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Set different prices for different endpoints:
          </Typography>
          <CodeBlock
            code={`// Shared configuration
const baseConfig = {
  facilitatorUrl: 'https://facilitator.x1pays.xyz',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET,
  tokenMint: process.env.WXNT_MINT
}

// Cheap endpoint - $0.001
app.get('/api/basic',
  x402Middleware({ 
    ...baseConfig, 
    amount: '1000000' // 0.001 wXNT
  }),
  (req, res) => {
    res.json({ tier: 'basic' })
  }
)

// Premium endpoint - $0.01
app.get('/api/premium',
  x402Middleware({ 
    ...baseConfig, 
    amount: '10000000' // 0.01 wXNT
  }),
  (req, res) => {
    res.json({ tier: 'premium' })
  }
)

// Usage-based pricing
app.post('/api/analyze',
  async (req, res, next) => {
    // Calculate price based on request
    const dataSize = req.body.data.length
    const price = Math.max(1000000, dataSize * 100)
    
    // Attach dynamic price to request
    req.x402Price = price.toString()
    next()
  },
  x402Middleware({ 
    ...baseConfig,
    getDynamicAmount: (req) => req.x402Price
  }),
  (req, res) => {
    res.json({ analyzed: true })
  }
)`}
            language="typescript"
          />
        </Box>

        {/* Error Handling */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Error Handling</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Handle payment errors gracefully:
          </Typography>
          <CodeBlock
            code={`app.get('/api/premium/data',
  paymentMiddleware,
  (req, res) => {
    res.json({ data: 'Premium content' })
  }
)

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === 'PaymentRequired') {
    return res.status(402).json({
      error: 'Payment required',
      details: err.message
    })
  }
  
  if (err.name === 'InvalidPayment') {
    return res.status(400).json({
      error: 'Invalid payment',
      details: err.message
    })
  }
  
  res.status(500).json({ error: 'Server error' })
})`}
            language="typescript"
          />
        </Box>

        {/* CORS Configuration */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>CORS Configuration</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Enable CORS for payment headers:
          </Typography>
          <CodeBlock
            code={`import cors from 'cors'

app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  exposedHeaders: [
    'X-Payment-Required',
    'X-Payment-Response'
  ]
}))`}
            language="typescript"
          />
        </Box>

        {/* Testing */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Testing Your Server</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Test with cURL or any HTTP client:
          </Typography>
          <CodeBlock
            code={`# First request - receive payment challenge
curl -v http://localhost:3000/api/premium/data

# Response: 402 Payment Required
# Headers include: X-Payment-Required with payment details`}
            language="bash"
          />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, mt: 3 }}>
            Use the x402 client to make automatic payments:
          </Typography>
          <CodeBlock
            code={`import { x402Client } from '@x1pays/client/axios'

const response = await x402Client({
  url: 'http://localhost:3000/api/premium/data',
  method: 'GET',
  wallet: myWallet
})

console.log('Data:', response.data)
console.log('Payment TX:', response.payment.txHash)`}
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
                borderColor: 'primary.dark',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>View Complete Examples</Typography>
                <Typography variant="body2" color="text.secondary">
                  See full working examples with frontend integration
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
                borderColor: 'primary.dark',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build a Client</Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn how to consume your x402 API from the client side
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
                borderColor: 'primary.dark',
                '&:hover': {
                  borderColor: 'primary.main',
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

export default ExpressQuickstart;
