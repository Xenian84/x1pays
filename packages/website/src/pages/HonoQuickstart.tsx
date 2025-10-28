import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BoltIcon from '@mui/icons-material/Bolt'
import CloudIcon from '@mui/icons-material/Cloud'
import FeatherIcon from '@mui/icons-material/Lightbulb'
import CodeBlock from '../components/CodeBlock'

const HonoQuickstart = () => {
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
            Hono Quickstart
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Build ultra-fast x402-enabled APIs with Hono framework.
          </Typography>
        </Box>

        {/* Why Hono */}
        <Card
          elevation={0}
          sx={{ transition: 'all 0.3s ease',
            mb: 8,
            border: '1px solid',
            borderColor: 'warning.dark',
            bgcolor: 'rgba(118, 255, 3, 0.03)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 3 }}>
              Why Hono?
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <BoltIcon sx={{ color: 'warning.main', fontSize: 24, mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>Ultra-fast:</Typography>
                  <Typography color="text.secondary">Up to 4x faster than Express.js</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CloudIcon sx={{ color: 'warning.main', fontSize: 24, mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>Edge-ready:</Typography>
                  <Typography color="text.secondary">Works on Cloudflare Workers, Deno, Bun</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <FeatherIcon sx={{ color: 'warning.main', fontSize: 24, mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>Lightweight:</Typography>
                  <Typography color="text.secondary">Tiny bundle size, minimal dependencies</Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Installation */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Installation</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Install Hono and the x402 middleware:
          </Typography>
          <CodeBlock code="npm install hono @x1pays/middleware" language="bash" />
        </Box>

        {/* Basic Setup */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Basic Setup</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create a Hono server with x402 payment protection:
          </Typography>
          <CodeBlock
            code={`import { Hono } from 'hono'
import { x402 } from '@x1pays/middleware/hono'

const app = new Hono()

// Configure x402 middleware
const payment = x402({
  facilitatorUrl: process.env.FACILITATOR_URL || 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: '1000'  // 0.001 wXNT
})

// Free endpoint
app.get('/api/public/hello', (c) => {
  return c.json({ message: 'This is free!' })
})

// Premium endpoint - requires payment
app.get('/api/premium/data', payment, (c) => {
  // Payment verified! Access via context:
  const paymentData = c.get('x402Payment')
  
  return c.json({
    data: 'Premium content here',
    payment: paymentData
  })
})

export default app`}
            language="typescript"
          />
        </Box>

        {/* Development Server */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Development Server</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Run with Node.js adapter:
          </Typography>
          <CodeBlock
            code={`import { serve } from '@hono/node-server'
import app from './app'

serve({
  fetch: app.fetch,
  port: 3000
})

console.log('Server running on http://localhost:3000')`}
            language="typescript"
          />
        </Box>

        {/* Middleware Composition */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Middleware Composition</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Combine x402 with other Hono middleware:
          </Typography>
          <CodeBlock
            code={`import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Global middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  exposeHeaders: ['X-Payment-Required', 'X-Payment-Response']
}))

// Premium routes with payment + JSON formatting
app.get('/api/premium/*', payment, prettyJSON())
app.get('/api/premium/data', (c) => {
  return c.json({ data: 'Premium content' })
})`}
            language="typescript"
          />
        </Box>

        {/* Dynamic Pricing */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Dynamic Pricing</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Set prices based on request parameters:
          </Typography>
          <CodeBlock
            code={`// Shared configuration
const config = {
  facilitatorUrl: 'https://facilitator.x1pays.xyz',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!
}

// Price tiers
const basicPayment = x402({ ...config, amount: '1000000' })
const premiumPayment = x402({ ...config, amount: '10000000' })

// Different endpoints, different prices
app.get('/api/basic', basicPayment, (c) => {
  return c.json({ tier: 'basic' })
})

app.get('/api/premium', premiumPayment, (c) => {
  return c.json({ tier: 'premium' })
})

// Dynamic pricing based on query params
app.post('/api/analyze', async (c) => {
  const body = await c.req.json()
  const dataSize = body.data.length
  const price = Math.max(1000000, dataSize * 100)
  
  // Create dynamic payment middleware
  const dynamicPayment = x402({ 
    ...config, 
    amount: price.toString() 
  })
  
  // Apply payment check
  await dynamicPayment(c, async () => {})
  
  return c.json({ analyzed: true })
})`}
            language="typescript"
          />
        </Box>

        {/* Error Handling */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Error Handling</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Handle payment errors in Hono:
          </Typography>
          <CodeBlock
            code={`import { HTTPException } from 'hono/http-exception'

// Custom error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Handle 402 Payment Required
    if (err.status === 402) {
      return c.json({
        error: 'Payment required',
        details: err.message
      }, 402)
    }
  }
  
  console.error('Error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})`}
            language="typescript"
          />
        </Box>

        {/* Deploy to Edge */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Deploy to Cloudflare Workers</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Hono works great on edge platforms:
          </Typography>
          <CodeBlock
            code={`// wrangler.toml
name = "x402-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
NETWORK = "x1-mainnet"
MERCHANT_WALLET = "your_wallet_address"
WXNT_MINT = "your_wxnt_mint"`}
            language="toml"
          />
          <Box sx={{ mt: 3 }}>
            <CodeBlock
              code={`// src/index.ts
export default {
  fetch: app.fetch
}

// Deploy
npx wrangler deploy`}
              language="typescript"
            />
          </Box>
        </Box>

        {/* Testing */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 3, fontSize: '2rem' }}>Testing</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Test your Hono server:
          </Typography>
          <CodeBlock
            code={`import { testClient } from 'hono/testing'

describe('Payment API', () => {
  const client = testClient(app)
  
  it('should return 402 for premium endpoint', async () => {
    const res = await client.api.premium.data.$get()
    expect(res.status).toBe(402)
  })
  
  it('should allow access with payment', async () => {
    const res = await client.api.premium.data.$get({
      headers: {
        'X-Payment': JSON.stringify(paymentProof)
      }
    })
    expect(res.status).toBe(200)
  })
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
                borderColor: 'success.dark',
                '&:hover': {
                  borderColor: 'success.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>View Complete Examples</Typography>
                <Typography variant="body2" color="text.secondary">
                  See full working Hono applications
                </Typography>
              </CardContent>
            </Card>
            <Card
              component={Link}
              to="/quickstart/fetch"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'success.dark',
                '&:hover': {
                  borderColor: 'success.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build a Client</Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn how to consume your Hono x402 API
                </Typography>
              </CardContent>
            </Card>
            <Card
              component="a"
              href="https://hono.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'success.dark',
                '&:hover': {
                  borderColor: 'success.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Hono Documentation</Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn more about Hono framework
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default HonoQuickstart;
