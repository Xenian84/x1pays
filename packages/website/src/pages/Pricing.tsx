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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import BoltIcon from '@mui/icons-material/Bolt'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const Pricing = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
        <Chip
          icon={<BoltIcon />}
          label="Zero Protocol Fees Forever"
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
            Pay Nothing.
            <br />
            Keep Everything.
          </Box>
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', lineHeight: 1.7 }}>
          X1Pays charges <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>0% fees</Box> and covers all gas costs.
          We monetize via <Box component="span" sx={{ color: 'warning.main', fontWeight: 700 }}>$XPY token</Box> appreciation, not your revenue.
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 10 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            
            sx={{ transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'primary.dark',
              height: '100%',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 700 }}>For Users</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', my: 3 }}>
                  Pay Per Use
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Only pay for API calls you make. Zero monthly fees, zero hidden costs.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">Pay only for what you use</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">Instant payment verification</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">No API keys to manage</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">Blockchain-verified receipts</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'secondary.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: 700 }}>Gas fees covered</Box> by X1Pays
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            
            sx={{ transition: 'all 0.3s ease',
              position: 'relative',
              background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
              border: '2px solid',
              borderColor: 'primary.light',
              height: '100%',
              transform: { lg: 'scale(1.05)' },
              '&:hover': {
                transform: { lg: 'scale(1.07)' },
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -16,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Chip
                label="MOST POPULAR"
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'background.default',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
            <CardContent sx={{ p: 4, pt: 5 }}>
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'background.default' }}>For Merchants</Typography>
                <Typography variant="h2" sx={{ fontWeight: 800, color: 'background.default', my: 3 }}>
                  0%
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(10, 25, 41, 0.8)' }}>
                  Keep <Box component="span" sx={{ fontWeight: 700, color: 'background.default' }}>100%</Box> of every payment. 
                  We charge absolutely nothing. Ever.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'background.default', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'background.default' }}>Receive 100% of payments</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'background.default', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(10, 25, 41, 0.8)' }}>Instant settlement (&lt;1 second)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'background.default', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(10, 25, 41, 0.8)' }}>No chargebacks, ever</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'background.default', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(10, 25, 41, 0.8)' }}>Free integration support</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'background.default', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'background.default' }}>Gas fees covered by X1Pays</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'background.default', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(10, 25, 41, 0.8)' }}>Real-time analytics dashboard</Typography>
                </Box>
              </Stack>
              <Button
                component={Link}
                to="/docs/getting-started"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 4,
                  bgcolor: 'background.default',
                  color: 'primary.main',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'rgba(10, 25, 41, 0.9)',
                  },
                }}
              >
                Start Accepting Payments
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            
            sx={{ transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'warning.dark',
              height: '100%',
              '&:hover': {
                borderColor: 'warning.main',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 700 }}>For $XPY Holders</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main', my: 3 }}>
                  <TrendingUpIcon sx={{ fontSize: 48, mr: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>Earn</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Hold $XPY to capture protocol value and participate in governance.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'warning.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">Token appreciation from protocol growth</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'warning.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">Vote on protocol changes</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'warning.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">Treasury-backed value</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckIcon sx={{ fontSize: 24, color: 'warning.main', mr: 2, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">Exclusive holder benefits</Typography>
                </Box>
                <Box>
                  <Chip
                    label="Coming Soon: Staking Rewards"
                    sx={{
                      bgcolor: 'rgba(255, 183, 77, 0.1)',
                      color: 'warning.main',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Stack>
              <Button
                component={Link}
                to="/token-economy"
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  mt: 4,
                  borderColor: 'warning.main',
                  color: 'warning.main',
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: 'warning.light',
                    bgcolor: 'rgba(255, 183, 77, 0.1)',
                  },
                }}
              >
                Learn About $XPY
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{ transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'primary.dark',
          p: { xs: 6, md: 8 },
          mb: 10,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            How X1Pays Makes Money
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 6 }}>
            We don't charge transaction fees. Our revenue model is simple and aligned with your success.
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{ transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'warning.dark',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 2 }}>
                    $XPY Token
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    X1Pays holds $XPY tokens. As protocol usage grows, <Box component="span" sx={{ fontWeight: 600 }}>$XPY value increases</Box> from:
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CheckIcon sx={{ fontSize: 20, color: 'warning.main', mr: 1.5, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">Increased demand from ecosystem growth</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CheckIcon sx={{ fontSize: 20, color: 'warning.main', mr: 1.5, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">Governance rights for protocol decisions</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CheckIcon sx={{ fontSize: 20, color: 'warning.main', mr: 1.5, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">Future staking rewards and utility</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{ transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'secondary.dark',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main', mb: 2 }}>
                    Premium Services
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Once we achieve market leadership, we'll offer <Box component="span" sx={{ fontWeight: 600 }}>optional premium features</Box>:
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CheckIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 1.5, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">Advanced analytics & reporting</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CheckIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 1.5, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">Priority support & SLA guarantees</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CheckIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 1.5, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">White-label solutions for enterprises</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', fontStyle: 'italic' }}>
                    Core payments always free
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Paper
        elevation={0}
        sx={{ transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'primary.dark',
          p: { xs: 4, md: 6 },
          mb: 10,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 6, textAlign: 'center' }}>
          Cost Comparison
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid', borderColor: 'divider' }}>
                <TableCell><Typography fontWeight={700}>Provider</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Transaction Fee</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Gas Fees</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Settlement</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Chargebacks</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ bgcolor: 'rgba(118, 255, 3, 0.05)' }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 1 }} />
                    <Typography fontWeight={700} sx={{ color: 'secondary.main' }}>X1Pays</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label="0%"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(118, 255, 3, 0.1)',
                      color: 'secondary.main',
                      fontWeight: 700,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label="Covered"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(118, 255, 3, 0.1)',
                      color: 'secondary.main',
                      fontWeight: 700,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} sx={{ color: 'secondary.main' }}>&lt;1 second</Typography>
                </TableCell>
                <TableCell>
                  <CloseIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography color="text.secondary">Stripe</Typography></TableCell>
                <TableCell><Typography color="text.secondary">2.9% + $0.30</Typography></TableCell>
                <TableCell><Typography color="text.secondary">N/A</Typography></TableCell>
                <TableCell><Typography color="text.secondary">2-7 days</Typography></TableCell>
                <TableCell>
                  <CheckIcon sx={{ fontSize: 20, color: 'error.main' }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography color="text.secondary">PayPal</Typography></TableCell>
                <TableCell><Typography color="text.secondary">3.49% + $0.49</Typography></TableCell>
                <TableCell><Typography color="text.secondary">N/A</Typography></TableCell>
                <TableCell><Typography color="text.secondary">1-3 days</Typography></TableCell>
                <TableCell>
                  <CheckIcon sx={{ fontSize: 20, color: 'error.main' }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography color="text.secondary">PayAI.network</Typography></TableCell>
                <TableCell>
                  <Chip
                    label="0%"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label="Covered"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell><Typography color="text.secondary">~2 seconds</Typography></TableCell>
                <TableCell>
                  <CloseIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                <TableCell>
                  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>Traditional Processor</Typography>
                </TableCell>
                <TableCell><Typography color="text.secondary">2-4%</Typography></TableCell>
                <TableCell><Typography color="text.secondary">N/A</Typography></TableCell>
                <TableCell><Typography color="text.secondary">1-5 days</Typography></TableCell>
                <TableCell>
                  <CheckIcon sx={{ fontSize: 20, color: 'error.dark' }} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          <Box component="span" sx={{ fontWeight: 600 }}>X1 blockchain advantage:</Box> Lower gas fees than Ethereum, faster than Solana for finality
        </Typography>
      </Paper>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
          borderRadius: 4,
          p: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'background.default', mb: 2 }}>
          Start Accepting Payments Today
        </Typography>
        <Typography variant="h5" sx={{ color: 'rgba(10, 25, 41, 0.8)', mb: 4 }}>
          <Box component="span" sx={{ fontWeight: 700, color: 'background.default' }}>0%</Box> fees. <Box component="span" sx={{ fontWeight: 700, color: 'background.default' }}>0</Box> gas costs. <Box component="span" sx={{ fontWeight: 700, color: 'background.default' }}>100%</Box> of payments to you.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            component={Link}
            to="/docs/getting-started"
            variant="contained"
            size="large"
            endIcon={<BoltIcon />}
            sx={{
              bgcolor: 'background.default',
              color: 'primary.main',
              fontWeight: 700,
              px: 5,
              py: 2,
              '&:hover': {
                bgcolor: 'rgba(10, 25, 41, 0.9)',
              },
            }}
          >
            Integrate Now
          </Button>
          <Button
            component={Link}
            to="/echo"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'background.default',
              color: 'background.default',
              fontWeight: 700,
              px: 5,
              py: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                borderColor: 'background.default',
                bgcolor: 'rgba(10, 25, 41, 0.2)',
              },
            }}
          >
            Try Demo
          </Button>
        </Stack>
        <Typography variant="body2" sx={{ color: 'rgba(10, 25, 41, 0.7)', mt: 3 }}>
          No credit card • No setup fees • 5 minute integration
        </Typography>
      </Box>
    </Container>
  )
}

export default Pricing
