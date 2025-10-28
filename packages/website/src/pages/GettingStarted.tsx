import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import CodeBlock from '../components/CodeBlock'
import TerminalIcon from '@mui/icons-material/Terminal'
import SettingsIcon from '@mui/icons-material/Settings'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'

export default function GettingStarted() {
  const installCode = `# Clone the repository
git clone https://github.com/x1pays/x1pays.git
cd x1pays

# Install dependencies
pnpm install

# Build all packages
pnpm build`

  const envFacilitatorCode = `PORT=4000
RPC_URL=https://rpc.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=YOUR_WXNT_MINT_ADDRESS
FEE_PAYER_SECRET=YOUR_BASE58_SECRET_KEY`

  const envApiCode = `PORT=3000
RPC_URL=https://rpc.x1.xyz
NETWORK=x1-mainnet
WXNT_MINT=YOUR_WXNT_MINT_ADDRESS
PAYTO_ADDRESS=YOUR_MERCHANT_PUBKEY
FACILITATOR_URL=http://localhost:4000
DOMAIN=localhost`

  const runCode = `# Run both services concurrently
pnpm dev

# Or run individually
pnpm dev:fac  # Facilitator on port 4000
pnpm dev:api  # API on port 3000`

  const clientCode = `import { Keypair } from "@solana/web3.js";
import { x402Client } from "@x1pays/client/axios";

// Load your wallet
const wallet = Keypair.fromSecretKey(yourSecretKey);

// Make a paid request - payment happens automatically!
const response = await x402Client({
  url: "http://localhost:3000/premium/data",
  method: "GET",
  wallet: wallet
});

console.log(response.data);      // Your data
console.log(response.payment);   // { txHash, amount, simulated }`

  const middlewareCode = `import { x402Middleware } from "@x1pays/middleware";
import { x420 } from "./middleware/x420.js";

// Apply x420 rate limiting and x402 payment requirement
app.use("/premium", x420(), x402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL || "http://localhost:4000",
  network: "x1-mainnet",
  payToAddress: process.env.PAYTO_ADDRESS || "",
  tokenMint: process.env.WXNT_MINT || "",
  amount: "1000"
}), premiumRoutes);`

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Box sx={{ mb: 8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, mb: 2 }}>
            Getting Started
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 400 }}>
            Quick start guide to set up and run X1Pays locally
          </Typography>
        </Box>

        <Stack spacing={8}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TerminalIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              Prerequisites
            </Typography>
            <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
              <Typography component="li" variant="body1" color="text.secondary">
                Node.js 18 or higher
              </Typography>
              <Typography component="li" variant="body1" color="text.secondary">
                pnpm 9.0 or higher
              </Typography>
              <Typography component="li" variant="body1" color="text.secondary">
                X1 wallet with wXNT tokens (for testing actual settlements)
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              Installation
            </Typography>
            <CodeBlock code={installCode} language="bash" />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
              Configuration
            </Typography>
            
            <Stack spacing={4}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  1. Facilitator Service
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Create{' '}
                  <Box
                    component="code"
                    sx={{
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      color: 'primary.main',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    packages/facilitator/.env
                  </Box>
                  :
                </Typography>
                <CodeBlock code={envFacilitatorCode} language="bash" filename="packages/facilitator/.env" />
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  2. API Service
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Create{' '}
                  <Box
                    component="code"
                    sx={{
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      color: 'primary.main',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    packages/api/.env
                  </Box>
                  :
                </Typography>
                <CodeBlock code={envApiCode} language="bash" filename="packages/api/.env" />
              </Box>

              <Card
                elevation={0}
                sx={{
                  bgcolor: 'rgba(0, 229, 255, 0.05)',
                  border: '1px solid',
                  borderColor: 'primary.dark',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <LightbulbIcon sx={{ fontSize: 24, color: 'primary.main', mt: 0.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Configuration Tips:
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                    <Typography component="li" variant="body2" color="text.secondary">
                      <Box component="strong" sx={{ color: 'text.primary' }}>PAYTO_ADDRESS (API):</Box> The merchant wallet that receives 100% of payments
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      <Box component="strong" sx={{ color: 'text.primary' }}>FEE_PAYER_SECRET:</Box> Wallet that covers gas costs for all transactions (X1Pays provides this)
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      <Box component="strong" sx={{ color: 'text.primary' }}>Zero Fees:</Box> X1Pays charges 0% protocol fees - merchants keep 100% of revenue
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      <Box component="strong" sx={{ color: 'text.primary' }}>Note:</Box> The facilitator is multi-tenant and processes payments for any merchant
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <RocketLaunchIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              Running the Services
            </Typography>
            <CodeBlock code={runCode} language="bash" />
            
            <Card
              elevation={0}
              sx={{
                mt: 3,
                bgcolor: 'rgba(118, 255, 3, 0.05)',
                border: '1px solid',
                borderColor: 'secondary.dark',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 24, color: 'secondary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Success! Your services should now be running:
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Facilitator:{' '}
                    <Box
                      component="code"
                      sx={{
                        bgcolor: 'rgba(118, 255, 3, 0.1)',
                        color: 'secondary.main',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                      }}
                    >
                      http://localhost:4000
                    </Box>
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    API:{' '}
                    <Box
                      component="code"
                      sx={{
                        bgcolor: 'rgba(118, 255, 3, 0.1)',
                        color: 'secondary.main',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                      }}
                    >
                      http://localhost:3000
                    </Box>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
              Testing the Flow
            </Typography>
            
            <Stack spacing={4}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  1. Unpaid Request (Returns 402)
                </Typography>
                <CodeBlock code={`curl -i http://localhost:3000/premium/data`} language="bash" />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  You should receive a{' '}
                  <Box
                    component="code"
                    sx={{
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      color: 'primary.main',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    402 Payment Required
                  </Box>{' '}
                  response with payment details including the merchant address and required amount.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  2. Using the Client SDK
                </Typography>
                <CodeBlock code={clientCode} language="typescript" filename="example.ts" />
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  3. Verify Payment Response
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Check the X-Payment-Response header to see the settlement details:
                </Typography>
                <CodeBlock 
                  code={`{
  "txHash": "SIM_TX_...",
  "amount": "1000",
  "simulated": true
}`} 
                  language="json" 
                />
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Integrating into Your API
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add the x402 middleware to any Express route to require payment:
            </Typography>
            <CodeBlock code={middlewareCode} language="typescript" filename="server.ts" />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Helper Utilities
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              X1Pays provides utility functions for working with wXNT amounts (6 decimal precision):
            </Typography>
            <CodeBlock code={`import { 
  wXNTToAtomicUnits, 
  atomicUnitsToWXNT, 
  formatWXNT 
} from "@x1pays/client";

// Convert wXNT to atomic units
const amount = wXNTToAtomicUnits(0.001);      // "1000"
const amount2 = wXNTToAtomicUnits("1.5");     // "1500000"

// Convert back to wXNT
const wXNT = atomicUnitsToWXNT("1000");       // 0.001

// Format for display
const display = formatWXNT("1000");           // "0.001 wXNT"`} language="typescript" filename="utilities.ts" />
            
            <Card
              elevation={0}
              sx={{
                mt: 3,
                bgcolor: 'rgba(0, 229, 255, 0.05)',
                border: '1px solid',
                borderColor: 'primary.dark',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LightbulbIcon sx={{ fontSize: 24, color: 'primary.main', mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    <Box component="strong" sx={{ color: 'text.primary' }}>Tip:</Box> Use these helpers to avoid floating-point precision issues when working with payment amounts. They ensure exact conversions and reject invalid inputs.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Card
            elevation={0}
            sx={{
              bgcolor: 'rgba(255, 183, 77, 0.05)',
              border: '1px solid',
              borderColor: 'warning.dark',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <WarningIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Important: MVP Mode
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                The current implementation runs in <Box component="strong" sx={{ color: 'text.primary' }}>MVP simulation mode</Box>. Settlement
                returns a simulated transaction hash without actual on-chain transfers.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                For production, you must implement delegate approval or client-signed transaction patterns.
                See{' '}
                <Box
                  component="code"
                  sx={{
                    bgcolor: 'rgba(255, 183, 77, 0.1)',
                    color: 'warning.main',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                  }}
                >
                  PRODUCTION_NOTES.md
                </Box>{' '}
                for details.
              </Typography>
            </CardContent>
          </Card>

          <Paper
            elevation={0}
            sx={{
              p: 5,
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(118, 255, 3, 0.1) 100%)',
              border: '1px solid',
              borderColor: 'primary.dark',
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Next Steps
            </Typography>
            <Stack spacing={2.5}>
              {[
                {
                  number: '1',
                  text: (
                    <>
                      Explore the{' '}
                      <Box
                        component={Link}
                        to="/docs/api-reference"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        API Reference
                      </Box>{' '}
                      for complete documentation
                    </>
                  ),
                },
                {
                  number: '2',
                  text: (
                    <>
                      Learn about the{' '}
                      <Box
                        component={Link}
                        to="/docs/token-economy"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        dual-token model
                      </Box>{' '}
                      (wXNT + $XPY)
                    </>
                  ),
                },
                {
                  number: '3',
                  text: (
                    <>
                      Check out{' '}
                      <Box
                        component={Link}
                        to="/docs/examples"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        integration examples
                      </Box>{' '}
                      in multiple languages
                    </>
                  ),
                },
                {
                  number: '4',
                  text: (
                    <>
                      Review{' '}
                      <Box
                        component="code"
                        sx={{
                          bgcolor: 'rgba(0, 229, 255, 0.1)',
                          color: 'primary.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontFamily: 'monospace',
                        }}
                      >
                        PRODUCTION_NOTES.md
                      </Box>{' '}
                      for security best practices
                    </>
                  ),
                },
                {
                  number: '5',
                  text: (
                    <>
                      Visit the{' '}
                      <Box
                        component={Link}
                        to="/faq"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        FAQ
                      </Box>{' '}
                      and{' '}
                      <Box
                        component={Link}
                        to="/docs/troubleshooting"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Troubleshooting
                      </Box>{' '}
                      pages
                    </>
                  ),
                },
              ].map((item) => (
                <Box key={item.number} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    {item.number}
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mt: 0.5 }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}
