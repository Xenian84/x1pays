import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import BoltIcon from '@mui/icons-material/Bolt'
import SecurityIcon from '@mui/icons-material/Security'
import CodeIcon from '@mui/icons-material/Code'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CodeBlock from '../components/CodeBlock'

export default function Home() {
  const exampleCode = `import { x402Client } from "@x1pays/client/axios";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(yourSecretKey);

const response = await x402Client({
  url: "https://api.x1pays.xyz/premium/data",
  method: "GET",
  wallet: wallet
});

console.log(response.data);        // Your data
console.log(response.payment);     // Payment proof`

  return (
    <Box>
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.default', py: { xs: 8, md: 16 } }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 229, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip
              icon={<AutoAwesomeIcon />}
              label="X1-first, multi-network x402 facilitator"
              sx={{
                bgcolor: 'rgba(0, 229, 255, 0.1)',
                color: 'primary.main',
                borderColor: 'primary.main',
                border: '1px solid',
                fontWeight: 600,
              }}
            />
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 800,
                maxWidth: '800px',
              }}
            >
              Instant, Invisible{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block',
                  mt: 1,
                }}
              >
                Payments
              </Box>
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: '700px',
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Accept payments from <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>$0.001</Box> in under a second.
              Perfect for AI agents, microtransactions, and lightning-fast commerce —{' '}
              <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>live on X1</Box>.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Button
                component={Link}
                to="/docs/getting-started"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                to="/echo"
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
                Try x402 Echo
              </Button>
            </Stack>
            
            <Grid container spacing={4} sx={{ mt: 4, maxWidth: '800px' }}>
              {[
                { value: '0%', label: 'Protocol Fees' },
                { value: '<1s', label: 'Settlement Time' },
                { value: '$0.001', label: 'Minimum Payment' },
              ].map((stat) => (
                <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            Why X1Pays?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px' }}>
            Built for developers who want instant, gasless payments
          </Typography>
        </Stack>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'secondary.dark',
                '&:hover': {
                  borderColor: 'secondary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 12,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(118, 255, 3, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Zero Protocol Fees
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                  <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>0%</Box> fees for merchants and buyers. 
                  We cover all gas costs. Revenue comes from <Box component="span" sx={{ fontWeight: 600 }}>$XPY token</Box> appreciation.
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    '100% of payments to merchant',
                    'Gas fees covered by X1Pays',
                    "Lower than Stripe's 2.9%",
                  ].map((feature) => (
                    <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'primary.dark',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 12,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <BoltIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Lightning Fast Settlement
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                  Payments settle in <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>&lt;1 second</Box> on X1 blockchain.
                  No waiting days for funds.
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Instant finality on X1',
                    'No chargebacks ever',
                    'Perfect for AI agents',
                  ].map((feature) => (
                    <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'info.dark',
                '&:hover': {
                  borderColor: 'info.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 12,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <CodeIcon sx={{ fontSize: 32, color: 'info.main' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  1-Line Integration
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                  Add x402 payments with <Box component="span" sx={{ color: 'info.main', fontWeight: 700 }}>one line of code</Box>.
                  No complex setup or API keys.
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Simple SDK for Node.js',
                    'Works with any HTTP client',
                    '5 minute setup time',
                  ].map((feature) => (
                    <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircleIcon sx={{ color: 'info.main', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'warning.dark',
                '&:hover': {
                  borderColor: 'warning.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 12,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 183, 77, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Cryptographically Secure
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                  Ed25519 signatures verify every payment before access.
                  <Box component="span" sx={{ color: 'warning.main', fontWeight: 700 }}> No trust required</Box>.
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    'Signature verification',
                    'On-chain settlement proof',
                    'No intermediary custody',
                  ].map((feature) => (
                    <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircleIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Simple to Integrate
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Add x402 micropayments to your API in minutes
            </Typography>
          </Stack>
          <CodeBlock code={exampleCode} language="typescript" filename="client.ts" />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              component={Link}
              to="/docs/api-reference"
              variant="text"
              endIcon={<ArrowForwardIcon />}
              sx={{
                color: 'secondary.main',
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'secondary.light',
                },
              }}
            >
              View full API documentation
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            How It Works
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Three simple steps to payment-gated APIs
          </Typography>
        </Stack>
        
        <Grid container spacing={4}>
          {[
            {
              step: '1',
              title: 'Request Without Payment',
              description: 'Client requests your API endpoint. Server returns HTTP 402 with payment details in wXNT.',
              color: 'primary',
            },
            {
              step: '2',
              title: 'Sign & Pay',
              description: 'Client signs payment intent with their wallet and includes X-PAYMENT header in retry.',
              color: 'warning',
            },
            {
              step: '3',
              title: 'Instant Settlement',
              description: 'X1Pays verifies signature, settles on X1 blockchain (<1s), and API grants access.',
              color: 'secondary',
            },
          ].map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.step}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  p: 4,
                  border: '1px solid',
                  borderColor: `${item.color}.dark`,
                  '&:hover': {
                    borderColor: `${item.color}.main`,
                    transform: 'translateY(-4px)',
                    boxShadow: 12,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: `rgba(${item.color === 'primary' ? '0, 229, 255' : item.color === 'warning' ? '255, 183, 77' : '118, 255, 3'}, 0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 800, color: `${item.color}.main` }}>
                    {item.step}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(118, 255, 3, 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h2" sx={{ fontWeight: 700, maxWidth: '700px' }}>
              Ready to accept instant payments?
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', lineHeight: 1.7 }}>
              Join the payment revolution. <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>Zero fees</Box>, instant settlement, built for the AI age.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={Link}
                to="/docs/getting-started"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 5, py: 2 }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                to="/echo"
                variant="outlined"
                size="large"
                sx={{
                  px: 5,
                  py: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                  },
                }}
              >
                Try Live Demo
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              No credit card required • 100% refund on test transactions • Gas fees covered
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
