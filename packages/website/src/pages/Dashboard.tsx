import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentIcon from '@mui/icons-material/Payment'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import BarChartIcon from '@mui/icons-material/BarChart'
import StoreIcon from '@mui/icons-material/Store'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'

interface Stats {
  totalPayments: number
  totalVolume: string
  avgPaymentSize: string
  treasuryBalance: string
  merchantCount: number
  last24h: {
    payments: number
    volume: string
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')

        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }

        const data = await response.json()
        setStats(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 12 }}>
          <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
            <CircularProgress size={48} />
            <Typography variant="body1" color="text.secondary">
              Loading statistics...
            </Typography>
          </Stack>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 12 }}>
          <Alert severity="error" sx={{ maxWidth: '600px', mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Error loading statistics
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Make sure the API server is running and the /stats endpoint is available.
            </Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Total Payments',
      value: stats?.totalPayments.toLocaleString() || '0',
      subtitle: 'All-time transactions',
      icon: PaymentIcon,
      color: 'primary',
    },
    {
      title: 'Total Volume',
      value: stats?.totalVolume || '0',
      subtitle: 'wXNT processed',
      icon: AccountBalanceWalletIcon,
      color: 'secondary',
    },
    {
      title: 'Average Payment',
      value: stats?.avgPaymentSize || '0',
      subtitle: 'wXNT per transaction',
      icon: BarChartIcon,
      color: 'info',
    },
    {
      title: 'Active Merchants',
      value: stats?.merchantCount.toLocaleString() || '0',
      subtitle: 'Using X1Pays',
      icon: StoreIcon,
      color: 'warning',
    },
  ]

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <DashboardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
              Protocol Dashboard
            </Typography>
          </Box>
          <Typography variant="h5" color="text.secondary">
            Real-time statistics and metrics for the X1Pays payment protocol
          </Typography>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {statCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: `${card.color}.dark`,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: `rgba(${
                        card.color === 'primary' ? '0, 229, 255' :
                        card.color === 'secondary' ? '118, 255, 3' :
                        card.color === 'info' ? '33, 150, 243' :
                        '255, 183, 77'
                      }, 0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <card.icon sx={{ fontSize: 32, color: `${card.color}.main` }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {card.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Last 24 Hours
                  </Typography>
                </Box>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body1" color="text.secondary">
                      Payments Processed
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {stats?.last24h.payments.toLocaleString() || '0'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Volume
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      {stats?.last24h.volume || '0'} wXNT
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <MonetizationOnIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Network Info
                  </Typography>
                </Box>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body1" color="text.secondary">
                      Active Merchants
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {stats?.merchantCount || '0'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Protocol Fee
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      0%
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'primary.dark',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(118, 255, 3, 0.1) 100%)',
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Want to become a merchant?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '700px' }}>
              Integrate x402 payments into your API and start earning wXNT tokens today.
              Setup takes less than 10 minutes with our simple SDK.
            </Typography>
            <Button
              variant="contained"
              href="/docs/getting-started"
              size="large"
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Get Started Now →
            </Button>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Statistics update every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Container>
    </Box>
  )
}

export default Dashboard
