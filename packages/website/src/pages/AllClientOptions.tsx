import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import HttpIcon from '@mui/icons-material/Http'
import LanguageIcon from '@mui/icons-material/Language'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import CancelIcon from '@mui/icons-material/Cancel'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CodeBlock from '../components/CodeBlock'

const AllClientOptions = () => {
  const clients = [
    {
      name: "Axios",
      icon: HttpIcon,
      color: "warning",
      description: "Popular HTTP client with rich features",
      pros: [
        "Automatic JSON transformation",
        "Built-in timeout and retry logic",
        "Request/response interceptors",
        "Better error handling",
        "Wide browser support"
      ],
      cons: [
        "Additional dependency (~13KB)",
        "Slightly larger bundle size",
        "Less modern than native fetch"
      ],
      bestFor: "Complex applications, teams familiar with Axios, projects needing advanced HTTP features",
      quickstartLink: "/quickstart/axios",
      example: `import { x402Client } from '@x1pays/client/axios'

const response = await x402Client({
  url: 'https://api.example.com/premium',
  method: 'GET',
  wallet: wallet,
  retry: {
    maxRetries: 3,
    retryDelay: 1000
  }
})

console.log(response.data)
console.log(response.payment.txHash)`
    },
    {
      name: "Fetch API",
      icon: LanguageIcon,
      color: "error",
      description: "Native browser API for HTTP requests",
      pros: [
        "Zero dependencies (native)",
        "Smallest bundle size",
        "Modern Promise-based API",
        "Excellent streaming support",
        "Built into all modern browsers"
      ],
      cons: [
        "Manual JSON parsing",
        "No built-in timeout",
        "Less feature-rich than Axios",
        "Requires polyfill for older browsers"
      ],
      bestFor: "Lightweight apps, modern browsers, streaming use cases, minimal dependencies",
      quickstartLink: "/quickstart/fetch",
      example: `import { fetchX402JSON } from '@x1pays/client/fetch'

const response = await fetchX402JSON(
  'https://api.example.com/premium',
  { 
    method: 'GET',
    wallet 
  }
)

console.log(response.data)
console.log(response.payment.txHash)`
    },
    {
      name: "Native Fetch",
      icon: RocketLaunchIcon,
      color: "info",
      description: "Manual implementation with native fetch API",
      pros: [
        "Full control over flow",
        "No dependencies",
        "Educational",
        "Maximum flexibility",
        "Best performance"
      ],
      cons: [
        "More code to write",
        "Manual error handling",
        "No built-in retry logic"
      ],
      bestFor: "Learning x402 protocol, custom flows, maximum control",
      quickstartLink: "/quickstart/fetch",
      example: `// 1. Initial request
let res = await fetch(url)

// 2. Handle 402
if (res.status === 402) {
  const req = await res.json()
  
  // 3. Sign payment
  const payment = { /*...*/ }
  const sig = signPayment(payment, wallet)
  
  // 4. Settle with facilitator
  await fetch(\`\${req.facilitatorUrl}/settle\`, {
    method: 'POST',
    body: JSON.stringify({ ...payment, sig })
  })
  
  // 5. Retry with proof
  res = await fetch(url, {
    headers: { 'X-Payment': JSON.stringify(payment) }
  })
}`
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Box sx={{ mb: 8 }}>
          <Button
            component={Link}
            to="/facilitator"
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 4,
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)' }
            }}
          >
            Back to Facilitator
          </Button>
          <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            All Client Options
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Choose the right HTTP client for consuming x402-enabled APIs.
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 4, fontSize: '2rem' }}>Quick Comparison</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ transition: 'all 0.3s ease', border: '1px solid', borderColor: 'primary.dark' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ transition: 'all 0.3s ease', bgcolor: 'background.paper' }}>
                  <TableCell><Typography fontWeight={600}>Client</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Bundle Size</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Dependencies</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Features</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Learning Curve</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><Typography fontWeight={600}>Axios</Typography></TableCell>
                  <TableCell>~13KB</TableCell>
                  <TableCell>1 package</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography component="span" sx={{ ml: 0.5 }}>Rich</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarBorderIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography component="span" sx={{ ml: 0.5 }}>Easy</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'rgba(0, 229, 255, 0.02)' }}>
                  <TableCell><Typography fontWeight={600}>Fetch API</Typography></TableCell>
                  <TableCell>~2KB</TableCell>
                  <TableCell>Native (0)</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarBorderIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarBorderIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography component="span" sx={{ ml: 0.5 }}>Basic</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography component="span" sx={{ ml: 0.5 }}>Very Easy</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Typography fontWeight={600}>fetch-x402 SDK</Typography></TableCell>
                  <TableCell>~8KB</TableCell>
                  <TableCell>1 package</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarBorderIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography component="span" sx={{ ml: 0.5 }}>Advanced</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarBorderIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <StarBorderIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography component="span" sx={{ ml: 0.5 }}>Moderate</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Stack spacing={6}>
          {clients.map((client) => {
            const IconComponent = client.icon;
            return (
              <Card
                key={client.name}
                elevation={0}
                
                sx={{ transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: `${client.color}.dark`,
                  '&:hover': {
                    borderColor: `${client.color}.main`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: `rgba(${client.color === 'warning' ? '255, 183, 77' : client.color === 'error' ? '255, 82, 82' : '0, 229, 255'}, 0.1)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 32, color: `${client.color}.main` }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {client.name}
                        </Typography>
                        <Typography color="text.secondary">{client.description}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Pros</Typography>
                      </Box>
                      <Stack spacing={1.5}>
                        {client.pros.map((pro, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ color: 'success.main', mt: 0.5 }}>•</Box>
                            <Typography variant="body2" color="text.secondary">{pro}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Cons</Typography>
                      </Box>
                      <Stack spacing={1.5}>
                        {client.cons.map((con, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ color: 'warning.main', mt: 0.5 }}>•</Box>
                            <Typography variant="body2" color="text.secondary">{con}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TrackChangesIcon sx={{ fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Best For</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{client.bestFor}</Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Code Example</Typography>
                    <CodeBlock code={client.example} language="typescript" />
                  </Box>

                  <Button
                    component={Link}
                    to={client.quickstartLink}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.light' }
                    }}
                  >
                    View {client.name} Quickstart
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h2" sx={{ mb: 4, fontSize: '2rem' }}>Feature Comparison</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ transition: 'all 0.3s ease', border: '1px solid', borderColor: 'primary.dark' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ transition: 'all 0.3s ease', bgcolor: 'background.paper' }}>
                  <TableCell><Typography fontWeight={600}>Feature</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={600}>Axios</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={600}>Fetch</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={600}>fetch-x402</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { feature: 'Automatic payment handling', axios: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, fetch: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Payment caching', axios: <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />, fetch: <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Request interceptors', axios: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, fetch: <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Automatic JSON parsing', axios: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, fetch: <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Timeout support', axios: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, fetch: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}><WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} /><Typography component="span">Manual</Typography></Box>, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Retry logic', axios: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, fetch: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}><WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} /><Typography component="span">Manual</Typography></Box>, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Payment amount safety limit', axios: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, fetch: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'TypeScript support', axios: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, fetch: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Streaming responses', axios: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}><WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} /><Typography component="span">Limited</Typography></Box>, fetch: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />, sdk: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> },
                  { feature: 'Browser compatibility', axios: 'All browsers', fetch: 'Modern only', sdk: 'Modern only' },
                ].map((row, idx) => (
                  <TableRow key={idx} sx={{ bgcolor: idx % 2 === 1 ? 'rgba(0, 229, 255, 0.02)' : 'transparent' }}>
                    <TableCell>{row.feature}</TableCell>
                    <TableCell align="center">{row.axios}</TableCell>
                    <TableCell align="center">{row.fetch}</TableCell>
                    <TableCell align="center">{row.sdk}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Card
          elevation={0}
          sx={{ transition: 'all 0.3s ease',
            mt: 8,
            border: '1px solid',
            borderColor: 'info.dark',
            bgcolor: 'rgba(0, 229, 255, 0.05)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <HelpOutlineIcon sx={{ fontSize: 32 }} />
              <Typography variant="h2" sx={{ fontSize: '2rem' }}>Decision Guide</Typography>
            </Box>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Choose Axios if:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You need advanced HTTP features, want the best developer experience, or are working with a team familiar with Axios.
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Choose Fetch API if:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You want the smallest bundle size, prefer zero dependencies, need streaming support, or are building a lightweight application.
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Choose fetch-x402 SDK if:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You're building an x402-heavy application, need payment caching, want built-in wallet management, or require advanced x402 features.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h2" sx={{ mb: 4, fontSize: '2rem' }}>Migration Between Clients</Typography>
          <CodeBlock
            code={`// From Axios
const response = await x402Client({
  url: 'https://api.example.com/data',
  wallet
})

// To Fetch API
const response = await fetchX402(
  'https://api.example.com/data',
  { wallet }
)
const data = await response.json()

// To fetch-x402 SDK
const client = new X402Client({ wallet })
const data = await client.get(
  'https://api.example.com/data'
)`}
            language="typescript"
          />
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h2" sx={{ mb: 4, fontSize: '2rem' }}>Next Steps</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Card
              component={Link}
              to="/examples"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'primary.dark',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>View Complete Examples</Typography>
                <Typography variant="body2" color="text.secondary">
                  See full applications using different clients
                </Typography>
              </CardContent>
            </Card>
            <Card
              component={Link}
              to="/quickstart/servers"
              elevation={0}
              
              sx={{ transition: 'all 0.3s ease',
                textDecoration: 'none',
                border: '1px solid',
                borderColor: 'primary.dark',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build a Server</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create an x402-enabled API to consume
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AllClientOptions;
