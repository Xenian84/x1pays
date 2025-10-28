import { useState } from 'react'
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import CircularProgress from '@mui/material/CircularProgress'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import BoltIcon from '@mui/icons-material/Bolt'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CodeBlock from '../components/CodeBlock'

export default function Echo() {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string>('')

  const curlExample = `curl -X POST https://api.x1pays.xyz/premium/data \\
  -H "Content-Type: application/json" \\
  -H "X-PAYMENT: <your_payment_payload>"

# Response includes X-PAYMENT-RESPONSE header with settlement details
# 100% of payment will be refunded automatically
# X1Pays covers all gas fees`

  const sdkExample = `import { getWithPayment } from "@x1pays/sdk";
import { Keypair } from "@solana/web3.js";

// Try x402 Echo - Get 100% refund
const data = await getWithPayment(
  "https://x402.payai.network/echo",
  payer,
  {
    facilitatorUrl: "https://facilitator.x1pays.xyz",
    payTo: "ECHO_MERCHANT_ADDRESS",
    asset: process.env.WXNT_MINT,
    amountAtomic: "1000" // Will be refunded!
  }
);

console.log(data); // Echo response + refund confirmed`

  const simulateTest = () => {
    setTestStatus('testing')
    setTimeout(() => {
      setTestStatus('success')
      setTxHash(`SIM_TX_${Math.random().toString(36).substring(7).toUpperCase()}`)
    }, 2000)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
        <Chip
          icon={<BoltIcon />}
          label="Live on X1 Mainnet"
          sx={{
            bgcolor: 'rgba(118, 255, 3, 0.1)',
            color: 'secondary.main',
            borderColor: 'secondary.main',
            border: '1px solid',
            fontWeight: 600,
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            fontWeight: 800,
          }}
        >
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            x402 Echo Merchant
          </Box>
        </Typography>
        <Typography variant="h4" color="text.secondary" sx={{ maxWidth: '800px', fontWeight: 400 }}>
          Test X402 Payments, <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>Zero Cost</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', lineHeight: 1.7 }}>
          Run real X402 transactions against a live merchant—for free. 
          Get <Box component="span" sx={{ fontWeight: 700 }}>100% of your payment refunded</Box>, with X1Pays covering the network fees.
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 10 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'primary.dark',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Try It Now</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Click below to simulate a real x402 payment. In production, you'll use our SDK or curl.
              </Typography>

              {testStatus === 'idle' && (
                <Button
                  onClick={simulateTest}
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
                    color: 'background.default',
                    fontWeight: 700,
                    py: 2,
                  }}
                >
                  Simulate x402 Payment
                </Button>
              )}

              {testStatus === 'testing' && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography color="text.primary" sx={{ fontWeight: 600 }}>Processing payment on X1...</Typography>
                </Box>
              )}

              {testStatus === 'success' && (
                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(118, 255, 3, 0.1)',
                      border: '1px solid',
                      borderColor: 'secondary.dark',
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleIcon sx={{ fontSize: 24, color: 'secondary.main', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>Payment Successful!</Typography>
                    </Box>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Amount Paid:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>0.001 XNT</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Settlement:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>&lt;1 second</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Protocol Fee:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>0% (FREE)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Gas Fees:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>Covered by X1Pays</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'secondary.dark' }}>
                        <Typography variant="body2" color="text.secondary">TX Hash:</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', maxWidth: '200px', wordBreak: 'break-all', textAlign: 'right' }}>{txHash}</Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      border: '1px solid',
                      borderColor: 'primary.dark',
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoneyIcon sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>Refund Initiated</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Your <Box component="span" sx={{ fontWeight: 700 }}>0.001 XNT</Box> will be refunded within 1 minute. 
                      X1Pays covers all costs for Echo testing.
                    </Typography>
                  </Paper>

                  <Button
                    onClick={() => setTestStatus('idle')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: 'text.secondary',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'text.primary',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    Test Again
                  </Button>
                </Stack>
              )}

              {testStatus === 'error' && (
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'rgba(255, 82, 82, 0.1)',
                    border: '1px solid',
                    borderColor: 'error.dark',
                    p: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CancelIcon sx={{ fontSize: 24, color: 'error.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>Payment Failed</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Something went wrong. In production, check your payment signature and wallet balance.
                  </Typography>
                  <Button
                    onClick={() => setTestStatus('idle')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: 'text.secondary',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'text.primary',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    Try Again
                  </Button>
                </Paper>
              )}

              <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>How Echo Works</Typography>
                <Stack component="ol" spacing={1.5} sx={{ pl: 0, listStyle: 'none' }}>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>1.</Typography>
                    <Typography variant="body2" color="text.secondary">You send a real x402 payment on X1 mainnet</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>2.</Typography>
                    <Typography variant="body2" color="text.secondary">Echo merchant verifies and settles instantly</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>3.</Typography>
                    <Typography variant="body2" color="text.secondary">You receive 100% refund automatically (gas covered)</Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'secondary.dark',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>What You Get</Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600 }}>Real blockchain transactions</Box> on X1 mainnet
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600 }}>100% refund</Box> of all test payments
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600 }}>Gas fees covered</Box> by X1Pays treasury
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600 }}>Full x402 flow</Box> including verification & settlement
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600 }}>Real transaction receipts</Box> with on-chain proof
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'primary.dark',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Stats</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: 'rgba(0, 229, 255, 0.1)',
                        border: '1px solid',
                        borderColor: 'primary.dark',
                      }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>0%</Typography>
                      <Typography variant="caption" color="text.secondary">Protocol Fee</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: 'rgba(118, 255, 3, 0.1)',
                        border: '1px solid',
                        borderColor: 'secondary.dark',
                      }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main' }}>100%</Typography>
                      <Typography variant="caption" color="text.secondary">Refund Rate</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: 'rgba(255, 183, 77, 0.1)',
                        border: '1px solid',
                        borderColor: 'warning.dark',
                      }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'warning.main' }}>&lt;1s</Typography>
                      <Typography variant="caption" color="text.secondary">Settlement</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: 'rgba(0, 229, 255, 0.1)',
                        border: '1px solid',
                        borderColor: 'primary.dark',
                      }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>$0</Typography>
                      <Typography variant="caption" color="text.secondary">Gas Cost</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mb: 10 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>Integration Examples</Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Using cURL</Typography>
            <CodeBlock code={curlExample} language="bash" filename="test-echo.sh" />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Using X1Pays SDK</Typography>
            <CodeBlock code={sdkExample} language="typescript" filename="test-echo.ts" />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
          borderRadius: 4,
          p: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'background.default', mb: 2 }}>
          Ready to Build with x402?
        </Typography>
        <Typography variant="h5" sx={{ color: 'rgba(10, 25, 41, 0.8)', mb: 4, maxWidth: '700px', mx: 'auto' }}>
          Start accepting instant payments on your API with zero fees and sub-second settlement.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            component={Link}
            to="/docs/getting-started"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: 'background.default',
              color: 'primary.main',
              fontWeight: 700,
              px: 4,
              py: 2,
              '&:hover': {
                bgcolor: 'rgba(10, 25, 41, 0.9)',
              },
            }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/docs/examples"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'background.default',
              color: 'background.default',
              fontWeight: 700,
              px: 4,
              py: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                borderColor: 'background.default',
                bgcolor: 'rgba(10, 25, 41, 0.2)',
              },
            }}
          >
            View Examples
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}
