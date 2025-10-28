import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import JavascriptIcon from '@mui/icons-material/Javascript'
import LanguageIcon from '@mui/icons-material/Language'
import CodeIcon from '@mui/icons-material/Code'
import TerminalIcon from '@mui/icons-material/Terminal'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SecurityIcon from '@mui/icons-material/Security'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import WarningIcon from '@mui/icons-material/Warning'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import CodeBlock from '../components/CodeBlock'

const Examples = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const examples = [
    {
      title: 'Node.js / TypeScript',
      icon: <JavascriptIcon />,
      code: `import { x402Client } from '@x1pays/client/axios'
import { Keypair } from '@solana/web3.js'
import fs from 'fs'

// Load wallet from environment or secret key
const secretKeyBase58 = process.env.WALLET_SECRET_KEY!
const wallet = Keypair.fromSecretKey(bs58.decode(secretKeyBase58))

// Make a paid request
async function fetchPremiumData() {
  try {
    const response = await x402Client({
      url: 'https://api.yourapp.com/premium/data',
      method: 'GET',
      wallet: wallet,
      retry: {
        maxRetries: 3,
        retryDelay: 1000
      }
    })
    
    console.log('Premium data:', response.data)
    console.log('Payment TX:', response.payment?.txHash)
    console.log('Amount paid:', response.payment?.amount)
  } catch (error) {
    console.error('Request failed:', error)
  }
}

fetchPremiumData()`
    },
    {
      title: 'Native Fetch API',
      icon: <LanguageIcon />,
      code: `import { fetchX402JSON } from '@x1pays/client/fetch'
import { Keypair } from '@solana/web3.js'

// Load wallet
const wallet = Keypair.fromSecretKey(secretKeyBytes)

// Make paid request with automatic JSON parsing
async function getPremiumData() {
  try {
    const response = await fetchX402JSON(
      'https://api.yourapp.com/premium/data',
      { 
        method: 'GET',
        wallet: wallet 
      }
    )
    
    console.log('Data:', response.data)
    console.log('Payment:', response.payment)
  } catch (error) {
    console.error('Failed:', error)
  }
}

// Or use fetchX402() for raw Response object
import { fetchX402 } from '@x1pays/client/fetch'

async function getPremiumDataRaw() {
  const response = await fetchX402(url, { wallet, method: 'GET' })
  const data = await response.json()
  console.log('Payment info:', response.x402Payment)
  return data
}

getPremiumData()`
    },
    {
      title: 'React (X1 Blockchain)',
      icon: <RocketLaunchIcon />,
      code: `import { X402Paywall } from '@x1pays/react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import '@solana/wallet-adapter-react-ui/styles.css'

function App() {
  const endpoint = 'https://rpc-testnet.x1.xyz'
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
    },
    {
      title: 'Python',
      icon: <CodeIcon />,
      code: `import requests
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
    },
    {
      title: 'cURL (Manual)',
      icon: <TerminalIcon />,
      code: `# Step 1: Try to access endpoint (will get 402)
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
    },
    {
      title: 'Express.js Server',
      icon: <RocketLaunchIcon />,
      code: `import express from 'express'
import { x402Middleware } from '@x1pays/middleware'

const app = express()

// Public endpoints (no payment required)
app.get('/api/public/hello', (req, res) => {
  res.json({ message: 'This is free!' })
})

// Premium endpoints (payment required)
app.get('/api/premium/data',
  x402Middleware({
    facilitatorUrl: process.env.FACILITATOR_URL!,
    network: 'x1-mainnet',
    payToAddress: process.env.MERCHANT_WALLET!,
    tokenMint: process.env.WXNT_MINT!,
    amount: '1000'  // 0.001 wXNT
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
    facilitatorUrl: process.env.FACILITATOR_URL!,
    network: 'x1-mainnet',
    payToAddress: process.env.MERCHANT_WALLET!,
    tokenMint: process.env.WXNT_MINT!,
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
    },
  ]

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} sx={{ mb: 8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
            Integration Examples
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Real-world code examples using our actual @x1pays packages
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid',
            borderColor: 'primary.dark',
            borderRadius: 2,
            p: 4,
            mb: 6,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <LightbulbIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                All Examples Use Real APIs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                These examples use the actual <Box component="code" sx={{ px: 1, py: 0.5, bgcolor: 'rgba(0, 229, 255, 0.1)', borderRadius: 1, fontFamily: 'monospace' }}>@x1pays/client</Box> and <Box component="code" sx={{ px: 1, py: 0.5, bgcolor: 'rgba(0, 229, 255, 0.1)', borderRadius: 1, fontFamily: 'monospace' }}>@x1pays/middleware</Box> packages.
                Copy and paste directly into your project!
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'primary.dark', mb: 8 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              },
            }}
          >
            {examples.map((example, idx) => (
              <Tab
                key={idx}
                icon={example.icon}
                iconPosition="start"
                label={example.title}
              />
            ))}
          </Tabs>

          <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {examples[selectedTab].title} Example
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => handleCopy(examples[selectedTab].code)}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                  },
                }}
              >
                Copy Code
              </Button>
            </Stack>
            
            <CodeBlock code={examples[selectedTab].code} language="typescript" />
          </Box>
        </Card>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'primary.dark', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CodeIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Client-Side (Making Paid Requests)
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Use <Box component="code" sx={{ px: 1, py: 0.5, bgcolor: 'rgba(0, 229, 255, 0.1)', borderRadius: 1, fontFamily: 'monospace' }}>@x1pays/client</Box> to make requests:
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Install: pnpm add @x1pays/client',
                    'Import x402Client (Axios) or fetchX402 (Fetch)',
                    'Provide your Solana wallet/keypair',
                    'Make requests - payment happens automatically!',
                    'Access response.data and response.payment',
                  ].map((item, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{idx + 1}.</Box>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'secondary.dark', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'rgba(118, 255, 3, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RocketLaunchIcon sx={{ fontSize: 28, color: 'secondary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Server-Side (Accepting Payments)
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Use <Box component="code" sx={{ px: 1, py: 0.5, bgcolor: 'rgba(118, 255, 3, 0.1)', borderRadius: 1, fontFamily: 'monospace' }}>@x1pays/middleware</Box> on your API:
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Install: pnpm add @x1pays/middleware',
                    'Choose: Express, Hono, Fastify, or Next.js',
                    'Configure facilitator URL and merchant wallet',
                    'Set amount per endpoint (in atomic units)',
                    'Middleware handles verify + settle automatically',
                  ].map((item, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>{idx + 1}.</Box>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {[
            {
              icon: <VerifiedUserIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
              title: 'Best Practices',
              color: 'secondary',
              items: [
                'Use simulation mode for testing',
                'Store wallet keys in environment variables',
                'Set reasonable payment amounts',
                'Log transaction hashes for records',
                'Test with small amounts first',
              ],
            },
            {
              icon: <WarningIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
              title: 'Common Mistakes',
              color: 'warning',
              items: [
                'Missing facilitatorUrl in config',
                'Wrong package names (@x1pays not @x402)',
                'Using bs58.encode() instead of base58',
                'Forgetting to await signPayment()',
                'Not checking environment variables',
              ],
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 32, color: 'error.main' }} />,
              title: 'Security',
              color: 'error',
              items: [
                'Never commit private keys to git',
                'Use .env files for secrets',
                'Verify signatures on server-side',
                'Use HTTPS in production',
                'Validate payment amounts match',
              ],
            },
          ].map((section, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: `${section.color}.dark`,
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: `rgba(${section.color === 'secondary' ? '118, 255, 3' : section.color === 'warning' ? '255, 183, 77' : '244, 67, 54'}, 0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1.5}>
                    {section.items.map((item, i) => (
                      <Typography key={i} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Box component="span" sx={{ color: `${section.color}.main`, mt: 0.5 }}>•</Box>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.paper', borderRadius: 3, p: { xs: 4, md: 6 } }}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(118, 255, 3, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
          
          <Box sx={{ position: 'relative' }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                Ready to Integrate?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px' }}>
                Check out our complete API reference and quickstart guides.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/docs/api-reference"
                  variant="contained"
                  size="large"
                  endIcon={<MenuBookIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Complete API Reference
                </Button>
                <Button
                  component={Link}
                  to="/docs/getting-started"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.light',
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                    },
                  }}
                >
                  Getting Started
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Examples
