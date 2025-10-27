import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import GroupIcon from '@mui/icons-material/Group'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BoltIcon from '@mui/icons-material/Bolt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CodeBlock from '../components/CodeBlock'

export default function TokenEconomy() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 12 } }}>
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MonetizationOnIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3rem' } }}>Token Economy</Typography>
        </Box>
        <Typography variant="h5" color="text.secondary">
          Dual-token model: wXNT for settlement, $XPY for value capture
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'primary.dark',
          p: { xs: 4, md: 6 },
          mb: 8,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Overview</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
          The X1Pays Protocol operates on a <Box component="strong" sx={{ color: 'text.primary' }}>dual-token model</Box> with a revolutionary 0% fee structure. 
          Instead of taking fees from transactions, X1Pays monetizes through <Box component="strong" sx={{ color: 'text.primary' }}>$XPY token appreciation</Box>.
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'secondary.dark',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SwapHorizIcon sx={{ fontSize: 24, color: 'secondary.main', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>wXNT</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Settlement token - merchants receive 100% of payments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'warning.dark',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupIcon sx={{ fontSize: 24, color: 'warning.main', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>$XPY</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Governance and value capture token
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>Settlement Layer — wXNT</Typography>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'secondary.dark',
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              <Box component="strong" sx={{ color: 'text.primary' }}>wXNT (Wrapped XNT)</Box> is the settlement token used for all transactions:
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  Every API call or x402 payment is settled in <Box component="strong" sx={{ color: 'text.primary' }}>wXNT</Box>, transferred directly from the user's wallet to the merchant
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  The facilitator charges <Box component="strong" sx={{ color: 'text.primary' }}>0% protocol fees</Box> - merchants receive 100% of payments
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  X1Pays covers all gas costs from treasury reserves
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  wXNT is SPL-compatible and integrates seamlessly with X1 blockchain infrastructure
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Paper
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Example Transaction Flow</Typography>
          <CodeBlock code={`// User pays 1000 wXNT for API access
Total Payment: 1000 wXNT

Payment Split:
├─ 1000 wXNT → Merchant (100%)
└─ 0 wXNT    → Protocol Fee (0%)

Gas Fees:
└─ Covered by X1Pays Treasury

Settlement:
Instant transfer on X1 blockchain in wXNT`} language="text" />
        </Paper>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>Value Capture — $XPY</Typography>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'warning.dark',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              <Box component="strong" sx={{ color: 'text.primary' }}>$XPY</Box> is the governance and value capture token of X1Pays:
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'warning.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  It is <Box component="strong" sx={{ color: 'text.primary' }}>not used for settlement</Box> - only wXNT is accepted for payments
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'warning.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  Appreciates in value as protocol transaction volume grows
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'warning.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  Governs treasury allocation and protocol parameters
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'warning.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  Future staking for governance participation and treasury distributions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: 'warning.main', mr: 2, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  Votes on future asset support (e.g., USDC integration)
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>Zero Fee Model</Typography>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'primary.dark',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              When a user pays <Box component="strong" sx={{ color: 'text.primary' }}>100 wXNT</Box> for an API call:
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'rgba(118, 255, 3, 0.1)',
                    border: '1px solid',
                    borderColor: 'secondary.dark',
                    p: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Merchant</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>100%</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">100 wXNT transferred to merchant</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'rgba(255, 183, 77, 0.1)',
                    border: '1px solid',
                    borderColor: 'warning.dark',
                    p: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Protocol Fee</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>0%</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">Zero fees charged</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid',
                    borderColor: 'primary.dark',
                    p: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Gas Cost</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>$0</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">Covered by X1Pays</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(255, 183, 77, 0.05)',
                border: '1px solid',
                borderColor: 'warning.dark',
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <TrendingUpIcon sx={{ fontSize: 20, color: 'warning.main', mr: 1.5, mt: 0.3, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  <Box component="strong" sx={{ color: 'text.primary' }}>Value Capture:</Box> Instead of charging fees, X1Pays monetizes through $XPY token appreciation. 
                  As more transactions flow through the protocol, $XPY holders benefit from increased demand and ecosystem value.
                </Typography>
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>Future Staking Model</Typography>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'warning.dark',
            p: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            The protocol will introduce <Box component="strong" sx={{ color: 'text.primary' }}>$XPY staking</Box> for governance and rewards:
          </Typography>
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'warning.main', 
                color: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                mt: 0.3,
                flexShrink: 0,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}>
                →
              </Box>
              <Typography variant="body2" color="text.secondary">
                Stake $XPY tokens to participate in protocol governance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'warning.main', 
                color: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                mt: 0.3,
                flexShrink: 0,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}>
                →
              </Box>
              <Typography variant="body2" color="text.secondary">
                Earn rewards from treasury reserves (funded by token sales and partnerships)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'warning.main', 
                color: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                mt: 0.3,
                flexShrink: 0,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}>
                →
              </Box>
              <Typography variant="body2" color="text.secondary">
                Lock periods with multipliers for higher governance weight
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'warning.main', 
                color: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                mt: 0.3,
                flexShrink: 0,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}>
                →
              </Box>
              <Typography variant="body2" color="text.secondary">
                Direct participation in protocol development decisions
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'warning.main', 
                color: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                mt: 0.3,
                flexShrink: 0,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}>
                →
              </Box>
              <Typography variant="body2" color="text.secondary">
                Early stakers receive bonus rewards
              </Typography>
            </Box>
          </Stack>
          
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'warning.main',
              bgcolor: 'rgba(255, 183, 77, 0.05)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BoltIcon sx={{ fontSize: 20, color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Coming Soon</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Staking functionality is under development. Follow our progress for updates on governance 
                participation and treasury distribution mechanisms.
              </Typography>
            </CardContent>
          </Card>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          p: { xs: 4, md: 6 },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Technical Implementation</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
          The 0% fee model is implemented in the facilitator's <Box component="code" sx={{ bgcolor: 'background.default', px: 1, py: 0.5, borderRadius: 1, fontFamily: 'monospace' }}>/settle</Box> endpoint:
        </Typography>
        <CodeBlock code={`// Simple: Transfer 100% to merchant
const totalAmount = BigInt(payment.amount);

// Transfer full amount to merchant (100%)
const tx = await tokenTransferTx({
  from: buyer,
  to: merchant,
  amount: totalAmount  // No fee deduction!
});

// Gas costs covered by X1Pays treasury via FEE_PAYER
await connection.sendTransaction(tx, [feePayer]);`} language="typescript" />
      </Paper>
    </Container>
  )
}
