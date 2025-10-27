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
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CodeIcon from '@mui/icons-material/Code'
import SpeedIcon from '@mui/icons-material/Speed'
import SecurityIcon from '@mui/icons-material/Security'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ApiIcon from '@mui/icons-material/Api'
import ScaleIcon from '@mui/icons-material/Scale'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { useState } from 'react'

const Facilitator = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('https://facilitator.x1pays.network')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 229, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
              }}
            >
              X1‑first payment{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                facilitator
              </Box>
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Process x402 payments on X1 blockchain with one drop‑in endpoint. 
              No API keys, no blockchain headaches—just plug and play.
            </Typography>
            
            <Paper
              elevation={0}
              sx={{ transition: 'all 0.3s ease',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'primary.dark',
                borderRadius: 2,
                p: 3,
                maxWidth: '600px',
                width: '100%',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    Facilitator URL
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'secondary.main',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      wordBreak: 'break-all',
                    }}
                  >
                    https://facilitator.x1pays.network
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{
                    color: copied ? 'secondary.main' : 'primary.main',
                    '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)' },
                  }}
                >
                  {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Stack>
            </Paper>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                href="#get-started"
                variant="contained"
                size="large"
                startIcon={<RocketLaunchIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                Start in 2m
              </Button>
              <Button
                component={Link}
                to="/docs/getting-started"
                variant="outlined"
                size="large"
                endIcon={<MenuBookIcon />}
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
                Docs
              </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mt: 2, maxWidth: '700px' }}>
              {[
                { icon: <AttachMoneyIcon sx={{ color: 'secondary.main', fontSize: 20 }} />, text: '0% protocol fees' },
                { icon: <SpeedIcon sx={{ color: 'primary.main', fontSize: 20 }} />, text: 'Gas fees covered' },
                { icon: <SecurityIcon sx={{ color: 'info.main', fontSize: 20 }} />, text: 'No API keys required' },
              ].map((item, idx) => (
                <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    {item.icon}
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Quick Setup Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }} id="get-started">
        <Container maxWidth="md">
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Drop‑in setup
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Point your merchant at the facilitator and you're done.
            </Typography>
          </Stack>

          <Stack spacing={4}>
            {[
              {
                step: '1',
                title: (
                  <Typography variant="body1" color="text.secondary">
                    Set <Box component="code" sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(0, 229, 255, 0.1)', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.875rem', color: 'primary.main' }}>FACILITATOR_URL=https://facilitator.x1pays.network</Box> in your server.
                  </Typography>
                ),
                color: 'primary',
              },
              {
                step: '2',
                title: 'Choose a network:',
                content: (
                  <Paper
                    elevation={0}
                    sx={{ transition: 'all 0.3s ease',
                      bgcolor: 'rgba(0, 229, 255, 0.05)',
                      border: '1px solid',
                      borderColor: 'primary.dark',
                      borderRadius: 2,
                      p: 2,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      x1-mainnet, x1-devnet
                    </Typography>
                  </Paper>
                ),
                color: 'warning',
              },
              {
                step: '3',
                title: 'Ship. The facilitator verifies & settles payments on your behalf.',
                color: 'secondary',
              },
            ].map((item) => (
              <Stack key={item.step} direction="row" spacing={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: `rgba(${item.color === 'primary' ? '0, 229, 255' : item.color === 'warning' ? '255, 183, 77' : '118, 255, 3'}, 0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: `${item.color}.main` }}>
                    {item.step}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  {typeof item.title === 'string' ? (
                    <Typography variant="body1" color="text.secondary">
                      {item.title}
                    </Typography>
                  ) : (
                    item.title
                  )}
                  {item.content}
                </Box>
              </Stack>
            ))}
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Chip
              icon={<AccountBalanceIcon />}
              label="X1 Blockchain"
              sx={{
                bgcolor: 'rgba(0, 229, 255, 0.1)',
                color: 'primary.main',
                borderColor: 'primary.main',
                border: '1px solid',
                fontWeight: 600,
                px: 2,
                py: 3,
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            Features
          </Typography>
        </Stack>
        
        <Grid container spacing={3}>
          {[
            {
              icon: <AccountBalanceIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
              title: 'X1‑native',
              description: 'Built specifically for X1 blockchain with wXNT token support. Optimized for the fastest settlement times and lowest gas costs.',
              color: 'primary',
            },
            {
              icon: <AttachMoneyIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
              title: 'Any token',
              description: 'Use wXNT stablecoin or your own tokens. Configure per‑endpoint pricing in fiat or atomic units.',
              color: 'secondary',
            },
            {
              icon: <AttachMoneyIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
              title: '0% fees',
              description: '100% of payments go to merchants. No protocol fees, no hidden costs. We cover blockchain gas fees for both buyers and merchants.',
              color: 'secondary',
            },
            {
              icon: <SpeedIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
              title: '1‑second start',
              description: 'No API keys. Just plug & play. Start with a single env var and standard endpoints (/verify, /settle).',
              color: 'primary',
            },
            {
              icon: <ApiIcon sx={{ fontSize: 32, color: 'info.main' }} />,
              title: 'Consistent API',
              description: 'One simple interface. You get reliability, observability, and reuse across multiple merchants and apps.',
              color: 'info',
            },
            {
              icon: <ScaleIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
              title: 'Built for scale',
              description: 'Designed for human & agentic use‑cases. From pay‑per‑call APIs to AI agents, settle payments in under a second.',
              color: 'warning',
            },
          ].map((feature, idx) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
              <Card
                elevation={0}
                
                sx={{ transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: `${feature.color}.dark`,
                  '&:hover': {
                    borderColor: `${feature.color}.main`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: `rgba(${feature.color === 'primary' ? '0, 229, 255' : feature.color === 'secondary' ? '118, 255, 3' : feature.color === 'info' ? '0, 229, 255' : '255, 183, 77'}, 0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Merchants Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Merchants
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Set up your resource server
            </Typography>
          </Stack>
          
          <Grid container spacing={3}>
            {[
              {
                title: 'Express Quickstart',
                description: 'Get started with Express.js in minutes.',
                link: '/quickstart/express',
                icon: <CodeIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
                color: 'primary',
              },
              {
                title: 'Hono Quickstart',
                description: 'Build edge-ready APIs with Hono.',
                link: '/quickstart/hono',
                icon: <RocketLaunchIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
                color: 'warning',
              },
              {
                title: 'Full Integration Guide',
                description: 'Complete setup for production apps.',
                link: '/docs/getting-started',
                icon: <MenuBookIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
                color: 'secondary',
              },
            ].map((item, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Card
                  component={Link}
                  to={item.link}
                  elevation={0}
                  
                  sx={{ transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    border: '1px solid',
                    borderColor: `${item.color}.dark`,
                    '&:hover': {
                      borderColor: `${item.color}.main`,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `rgba(${item.color === 'primary' ? '0, 229, 255' : item.color === 'warning' ? '255, 183, 77' : '118, 255, 3'}, 0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(118, 255, 3, 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Ready to integrate?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px' }}>
              Start accepting x402 payments in minutes with our simple, drop-in facilitator.
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
                Get Started
              </Button>
              <Button
                component={Link}
                to="/docs/api-reference"
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
                View API Docs
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default Facilitator
