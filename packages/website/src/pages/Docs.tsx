import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CodeIcon from '@mui/icons-material/Code'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import BuildIcon from '@mui/icons-material/Build'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LayersIcon from '@mui/icons-material/Layers'
import StorageIcon from '@mui/icons-material/Storage'
import ApiIcon from '@mui/icons-material/Api'

export default function Docs() {
  const sections = [
    {
      icon: RocketLaunchIcon,
      title: 'Getting Started',
      description: 'Quick start guide to integrating X1Pays into your project',
      link: '/docs/getting-started',
      color: 'primary'
    },
    {
      icon: CodeIcon,
      title: 'API Reference',
      description: 'Complete API documentation for facilitator and client SDK',
      link: '/docs/api-reference',
      color: 'info'
    },
    {
      icon: MonetizationOnIcon,
      title: 'Token Economy',
      description: 'Dual-token model: wXNT for settlement, $XPY for governance',
      link: '/docs/token-economy',
      color: 'secondary'
    },
    {
      icon: BuildIcon,
      title: 'Integration Examples',
      description: 'Real-world code examples in Node.js, Python, React, and more',
      link: '/docs/examples',
      color: 'warning'
    },
    {
      icon: MenuBookIcon,
      title: 'Troubleshooting',
      description: 'Solutions to common issues when integrating x402 payments',
      link: '/docs/troubleshooting',
      color: 'error'
    }
  ]

  const architecture = [
    {
      icon: LayersIcon,
      title: 'Facilitator',
      description: 'Verifies payment signatures and settles wXNT token transfers on X1 blockchain. Provides /supported, /verify, and /settle endpoints.',
      color: 'primary'
    },
    {
      icon: ApiIcon,
      title: 'API Server',
      description: 'Express-based server with x402 middleware that returns HTTP 402 until valid payment is provided. Includes x420 rate limiting.',
      color: 'secondary'
    },
    {
      icon: StorageIcon,
      title: 'Client SDK',
      description: 'JavaScript/TypeScript library for browsers and Node.js that handles payment signing and x402 handshake automatically.',
      color: 'info'
    }
  ]

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MenuBookIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
              Documentation
            </Typography>
          </Box>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px' }}>
            Everything you need to integrate HTTP 402 micropayments into your application
          </Typography>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 12 }}>
          {sections.map((section, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card
                component={Link}
                to={section.link}
                elevation={0}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'block',
                  border: '1px solid',
                  borderColor: `${section.color}.dark`,
                  '&:hover': {
                    borderColor: `${section.color}.main`,
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
                      bgcolor: `rgba(${
                        section.color === 'primary' ? '0, 229, 255' :
                        section.color === 'secondary' ? '118, 255, 3' :
                        section.color === 'warning' ? '255, 183, 77' :
                        section.color === 'error' ? '255, 82, 82' :
                        '0, 229, 255'
                      }, 0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <section.icon sx={{ fontSize: 32, color: `${section.color}.main` }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'primary.dark',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(118, 255, 3, 0.05) 100%)',
            mb: 8,
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              What is x402?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              HTTP 402 (Payment Required) is a standard HTTP status code reserved for digital micropayments.
              X1Pays implements this protocol using:
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    X1 Blockchain
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    High-performance L1 with low transaction fees
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: 24, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    wXNT Tokens
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    SPL token standard for seamless payments
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <CheckCircleIcon sx={{ color: 'warning.main', fontSize: 24, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Ed25519 Signatures
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Cryptographic verification of payment authorization
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <CheckCircleIcon sx={{ color: 'info.main', fontSize: 24, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Facilitator Pattern
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Sponsors transaction fees while maintaining security
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'info.dark', mb: 8 }}>
          <CardContent sx={{ p: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Project Architecture
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              X1Pays is built as a TypeScript monorepo with three main packages:
            </Typography>
            <Grid container spacing={3}>
              {architecture.map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: `${item.color}.dark`,
                      borderRadius: 2,
                      p: 3,
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: `rgba(${
                          item.color === 'primary' ? '0, 229, 255' :
                          item.color === 'secondary' ? '118, 255, 3' :
                          '0, 229, 255'
                        }, 0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <item.icon sx={{ fontSize: 28, color: `${item.color}.main` }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

      </Container>
    </Box>
  )
}
