import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useX402Payment } from '../hooks/useX402Payment'
import { X1_NETWORKS } from '../types'
import type { X402PaywallProps } from '../types'

export function X402Paywall({
  amount,
  description,
  network = 'x1-devnet',
  rpcUrl,
  treasuryAddress,
  facilitatorUrl,
  theme = 'x1',
  showBalance = true,
  showNetworkInfo = true,
  maxPaymentAmount,
  onPaymentSuccess,
  onPaymentError,
  onPaymentStart,
  children,
  className,
  style,
}: X402PaywallProps) {
  // Generate a unique key for this paywall based on description and amount
  const paywallKey = `x402_paid_${description}_${amount}`.replace(/[^a-zA-Z0-9_]/g, '_')
  
  const [hasPaid, setHasPaid] = useState(() => {
    // Check localStorage on mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem(paywallKey) === 'true'
    }
    return false
  })
  const [balance, setBalance] = useState<number | null>(null)
  
  const networkConfig = {
    ...X1_NETWORKS[network],
    ...(rpcUrl && { rpcUrl }),
    ...(treasuryAddress && { treasuryAddress }),
    ...(facilitatorUrl && { facilitatorUrl }),
  }

  const { connection } = useConnection()
  const walletContext = useWallet()
  const { paymentState, processPayment, reset } = useX402Payment(networkConfig)

  useEffect(() => {
    if (walletContext.publicKey && showBalance) {
      connection.getBalance(walletContext.publicKey).then((bal: number) => {
        setBalance(bal / 1e9)
      })
    }
  }, [walletContext.publicKey, showBalance, connection])

  useEffect(() => {
    if (paymentState.status === 'success' && paymentState.txId) {
      setHasPaid(true)
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(paywallKey, 'true')
      }
      onPaymentSuccess?.(paymentState.txId)
    } else if (paymentState.status === 'error' && paymentState.error) {
      onPaymentError?.(paymentState.error)
    }
  }, [paymentState, onPaymentSuccess, onPaymentError, paywallKey])

  const handlePayment = async () => {
    if (maxPaymentAmount && amount > maxPaymentAmount) {
      onPaymentError?.(new Error(`Amount exceeds maximum of $${maxPaymentAmount}`))
      return
    }

    try {
      onPaymentStart?.()
      await processPayment(amount, description)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  if (hasPaid || paymentState.status === 'success') {
    return <Box className={className} style={style}>{children}</Box>
  }

  const isDark = theme === 'x1' || theme === 'dark'

  return (
    <Box
      className={className}
      style={style}
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: isDark ? '#0A1929' : 'background.default',
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 500,
          width: '100%',
          border: '1px solid',
          borderColor: isDark ? 'rgba(0, 229, 255, 0.3)' : 'divider',
          bgcolor: isDark ? 'rgba(18, 32, 50, 0.9)' : 'background.paper',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <LockIcon sx={{ fontSize: 48, color: '#00E5FF', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#fff' : 'text.primary' }}>
              Premium Content
            </Typography>
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, textAlign: 'center' }}
          >
            {description}
          </Typography>

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(0, 229, 255, 0.05)' : 'rgba(0, 229, 255, 0.1)',
              border: '1px solid',
              borderColor: '#00E5FF',
              mb: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Payment Amount
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#00E5FF' }}>
              ${amount.toFixed(2)}
            </Typography>
          </Box>

          {showNetworkInfo && (
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={network === 'x1-mainnet' ? 'X1 Mainnet' : 'X1 Devnet'}
                size="small"
                sx={{
                  bgcolor: 'rgba(118, 255, 3, 0.1)',
                  color: '#76FF03',
                  fontWeight: 600,
                }}
              />
              <Chip
                label="Instant Settlement"
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                  color: '#00E5FF',
                  fontWeight: 600,
                }}
              />
            </Box>
          )}

          {showBalance && balance !== null && walletContext.connected && (
            <Alert
              icon={<AccountBalanceWalletIcon />}
              severity="info"
              sx={{ mb: 3, bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF' }}
            >
              Wallet Balance: {balance.toFixed(4)} SOL
            </Alert>
          )}

          {paymentState.status === 'error' && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={reset}>
              {paymentState.error?.message || 'Payment failed'}
            </Alert>
          )}

          {!walletContext.connected ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Connect your wallet to unlock this content
              </Typography>
              <WalletMultiButton />
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handlePayment}
              disabled={paymentState.status === 'paying'}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
                color: '#0A1929',
                fontWeight: 700,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00D4EE 0%, #65EE00 100%)',
                },
                '&:disabled': {
                  background: 'rgba(0, 229, 255, 0.3)',
                  color: 'rgba(10, 25, 41, 0.5)',
                },
              }}
              startIcon={
                paymentState.status === 'paying' ? (
                  <CircularProgress size={20} sx={{ color: '#0A1929' }} />
                ) : (
                  <CheckCircleIcon />
                )
              }
            >
              {paymentState.status === 'paying' ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
            </Button>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: 'block', textAlign: 'center' }}
          >
            Powered by x402 on X1 blockchain • 0% fees • Gas covered
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
