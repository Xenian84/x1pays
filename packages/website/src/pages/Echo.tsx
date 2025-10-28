import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Link } from 'react-router-dom'
import { TransactionHistory } from '../components/TransactionHistory'

// Simple base58 encoder for signatures
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function encodeBase58(bytes: Uint8Array): string {
  if (bytes.length === 0) return ''
  
  const digits = [0]
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i]
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8
      digits[j] = carry % 58
      carry = (carry / 58) | 0
    }
    while (carry > 0) {
      digits.push(carry % 58)
      carry = (carry / 58) | 0
    }
  }
  
  let result = ''
  for (let i = 0; bytes[i] === 0 && i < bytes.length - 1; i++) {
    result += BASE58_ALPHABET[0]
  }
  
  for (let i = digits.length - 1; i >= 0; i--) {
    result += BASE58_ALPHABET[digits[i]]
  }
  
  return result
}
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

export default function Echo() {
  const { publicKey, signMessage } = useWallet()
  const [testStatus, setTestStatus] = useState<'idle' | 'connecting' | 'signing' | 'verifying' | 'settling' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [network, setNetwork] = useState<'x1-testnet' | 'x1-mainnet'>('x1-testnet')
  const [refundTxHash, setRefundTxHash] = useState<string>('')
  const [refundCountdown, setRefundCountdown] = useState<number>(60)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Get explorer URL based on network
  const getExplorerUrl = (hash: string) => {
    if (network === 'x1-testnet') {
      return `https://explorer.testnet.x1.xyz/tx/${hash}`
    }
    return `https://explorer.x1.xyz/tx/${hash}`
  }

  const handlePayment = async () => {
    if (!publicKey || !signMessage) {
      setTestStatus('error')
      setErrorMessage('Please connect your wallet first')
      return
    }

    try {
      setTestStatus('signing')
      
      const currentNetwork = (import.meta.env.VITE_NETWORK || 'x1-testnet') as 'x1-testnet' | 'x1-mainnet'
      setNetwork(currentNetwork)

      const paymentPayload = {
        scheme: 'x402' as const,
        network: currentNetwork,
        payTo: import.meta.env.VITE_MERCHANT_ADDRESS || 'JDxUE7U8uWmyp9V22h9w14vWgwZxUhf8HBZvvSg247Zp',
        asset: import.meta.env.VITE_WXNT_MINT || 'So11111111111111111111111111111111111111112',
        amount: '100000',
        resource: '/api/echo',
        memo: 'Echo Test Payment',
        buyer: publicKey.toString(),
      }

      const message = JSON.stringify(paymentPayload)
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await signMessage(encodedMessage)
      
      // Convert signature to base58 format as expected by facilitator
      const bs58Signature = encodeBase58(signature)
      
      const signedPayload = {
        ...paymentPayload,
        signature: bs58Signature,
      }

      setTestStatus('verifying')
      
      const facilitatorUrl = import.meta.env.VITE_FACILITATOR_URL || 'http://localhost:3001'
      const verifyResponse = await fetch(`${facilitatorUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signedPayload),
      })

      if (!verifyResponse.ok) {
        throw new Error(`Verification failed: ${await verifyResponse.text()}`)
      }

      const verifyResult = await verifyResponse.json()
      if (!verifyResult.valid) {
        throw new Error(verifyResult.message || 'Payment verification failed')
      }

      setTestStatus('settling')

      const settleResponse = await fetch(`${facilitatorUrl}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signedPayload),
      })

      if (!settleResponse.ok) {
        throw new Error(`Settlement failed: ${await settleResponse.text()}`)
      }

      const settleResult = await settleResponse.json()
      
      setTestStatus('success')
      setTxHash(settleResult.txHash || 'TX_COMPLETED')
      
      // Start refund countdown
      setRefundCountdown(60)
      const countdownInterval = setInterval(() => {
        setRefundCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            // Initiate refund transaction after countdown
            initiateRefund(publicKey.toString(), settleResult.txId)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error('Payment error:', error)
      setTestStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed')
    }
  }

  const initiateRefund = async (buyerAddress: string, originalTxId?: string) => {
    try {
      // Call facilitator to process refund transaction
      const facilitatorUrl = import.meta.env.VITE_FACILITATOR_URL || 'http://localhost:3001'
      const refundResponse = await fetch(`${facilitatorUrl}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: buyerAddress,
          amount: '100000',
          network: network,
          originalTxId: originalTxId || null,
        }),
      })

      if (refundResponse.ok) {
        const refundResult = await refundResponse.json()
        setRefundTxHash(refundResult.txHash || '')
      }
    } catch (error) {
      console.error('Refund error:', error)
    }
  }

  const resetTest = () => {
    setTestStatus('idle')
    setTxHash('')
    setRefundTxHash('')
    setRefundCountdown(60)
    setErrorMessage('')
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
        <Chip
          icon={<BoltIcon />}
          label="Live on X1 Testnet"
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
                Connect your wallet and send a real x402 payment on X1 testnet. You'll get 100% refunded!
              </Typography>

              {!publicKey && (
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <WalletMultiButton />
                </Box>
              )}

              {publicKey && testStatus === 'idle' && (
                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      border: '1px solid',
                      borderColor: 'primary.dark',
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 700 }}>Wallet Connected:</Box>
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {publicKey.toString()}
                    </Typography>
                  </Paper>
                  <Button
                    onClick={handlePayment}
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
                    Send x402 Payment
                  </Button>
                </Stack>
              )}

              {(testStatus === 'signing' || testStatus === 'verifying' || testStatus === 'settling') && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <CircularProgress sx={{ mb: 2, color: 'primary.main' }} />
                  <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                    {testStatus === 'signing' && 'Signing payment...'}
                    {testStatus === 'verifying' && 'Verifying with facilitator...'}
                    {testStatus === 'settling' && 'Settling on X1 blockchain...'}
                  </Typography>
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
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>0.0001 XNT</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Settlement:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>&lt;1 second</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Protocol Fee:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>0% (FREE)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'secondary.dark' }}>
                        <Typography variant="body2" color="text.secondary">TX Hash:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', maxWidth: '150px', wordBreak: 'break-all', textAlign: 'right' }}>
                            {txHash.slice(0, 8)}...{txHash.slice(-8)}
                          </Typography>
                          <Button
                            component="a"
                            href={getExplorerUrl(txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                          </Button>
                        </Box>
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
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {refundTxHash ? 'Refund Completed' : 'Refund Initiated'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Your <Box component="span" sx={{ fontWeight: 700 }}>0.0001 XNT</Box> {refundTxHash ? 'has been refunded' : 'will be refunded within 1 minute'}. 
                      X1Pays covers all costs for Echo testing.
                    </Typography>
                    
                    {!refundTxHash && refundCountdown > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          Refund in <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>{refundCountdown}s</Box>
                        </Typography>
                      </Box>
                    )}
                    
                    {refundTxHash && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'primary.dark' }}>
                        <Typography variant="body2" color="text.secondary">Refund TX:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', maxWidth: '150px', wordBreak: 'break-all', textAlign: 'right' }}>
                            {refundTxHash.slice(0, 8)}...{refundTxHash.slice(-8)}
                          </Typography>
                          <Button
                            component="a"
                            href={getExplorerUrl(refundTxHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Paper>

                  <Button
                    onClick={resetTest}
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
                <Stack spacing={2}>
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
                    <Typography variant="body2" color="text.secondary">
                      {errorMessage || 'Something went wrong with the payment.'}
                    </Typography>
                  </Paper>
                  <Button
                    onClick={resetTest}
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
                </Stack>
              )}

              <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>How Echo Works</Typography>
                <Stack component="ol" spacing={1.5} sx={{ pl: 0, listStyle: 'none' }}>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>1.</Typography>
                    <Typography variant="body2" color="text.secondary">Connect your Phantom/Backpack wallet</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>2.</Typography>
                    <Typography variant="body2" color="text.secondary">Sign an x402 payment (no transaction approval needed!)</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>3.</Typography>
                    <Typography variant="body2" color="text.secondary">Facilitator verifies and settles on X1 blockchain</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>4.</Typography>
                    <Typography variant="body2" color="text.secondary">Get 100% refund automatically (gas covered)</Typography>
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
                      <Box component="span" sx={{ fontWeight: 600 }}>Real blockchain transactions</Box> on X1 testnet
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600 }}>Wallet signature</Box> via Phantom or Backpack
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
                      <Box component="span" sx={{ fontWeight: 600 }}>Full x402 protocol</Box> with verification & settlement
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

      {/* Transaction History */}
      {publicKey && (
        <Box sx={{ mt: 6 }}>
          <TransactionHistory
            walletAddress={publicKey.toString()}
            rpcUrl={import.meta.env.VITE_X1_TESTNET_RPC || 'https://rpc-testnet.x1.xyz'}
            network={network}
            limit={10}
          />
        </Box>
      )}

      <Box
        sx={{
          background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
          borderRadius: 4,
          p: { xs: 6, md: 8 },
          textAlign: 'center',
          mt: 6,
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
