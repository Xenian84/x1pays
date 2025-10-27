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
import BoltIcon from '@mui/icons-material/Bolt'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SettingsIcon from '@mui/icons-material/Settings'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
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

const AllServerOptions = () => {
  const frameworks = [
    {
      name: "Express.js",
      icon: BoltIcon,
      color: "success",
      description: "The most popular Node.js web framework",
      pros: [
        "Massive ecosystem and community",
        "Extensive middleware library",
        "Well-documented and battle-tested",
        "Easy to learn for beginners"
      ],
      cons: [
        "Slower than modern alternatives",
        "Callback-based (older pattern)",
        "Less type-safe without TypeScript setup"
      ],
      bestFor: "Traditional REST APIs, established projects, teams familiar with Express",
      quickstartLink: "/quickstart/express",
      example: `import express from 'express'
import { x402Middleware } from '@x1pays/middleware'

const app = express()

app.get('/premium', x402Middleware({
  facilitatorUrl: 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET,
  tokenMint: process.env.WXNT_MINT,
  amount: '1000'
}), (req, res) => {
  res.json({ data: 'paid content' })
})`
    },
    {
      name: "Hono",
      icon: LocalFireDepartmentIcon,
      color: "error",
      description: "Ultra-fast, lightweight, edge-ready framework",
      pros: [
        "4x faster than Express",
        "Edge-ready (Cloudflare Workers, Deno, Bun)",
        "Tiny bundle size",
        "Built-in TypeScript support",
        "Modern API design"
      ],
      cons: [
        "Smaller ecosystem than Express",
        "Newer, less battle-tested",
        "Fewer third-party middleware options"
      ],
      bestFor: "Edge deployments, high-performance APIs, modern TypeScript projects",
      quickstartLink: "/quickstart/hono",
      example: `import { Hono } from 'hono'
import { x402 } from '@x1pays/middleware/hono'

const app = new Hono()

app.get('/premium', x402({
  facilitatorUrl: 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET,
  tokenMint: process.env.WXNT_MINT,
  amount: '1000'
}), (c) => {
  return c.json({ data: 'paid content' })
})`
    },
    {
      name: "Fastify",
      icon: SettingsIcon,
      color: "info",
      description: "High-performance framework with schema validation",
      pros: [
        "Very fast (2x+ faster than Express)",
        "Built-in schema validation",
        "Excellent TypeScript support",
        "Plugin architecture",
        "Low overhead"
      ],
      cons: [
        "Stricter than Express (more opinionated)",
        "Smaller community than Express",
        "Different mental model from Express"
      ],
      bestFor: "High-throughput APIs, microservices, performance-critical applications",
      quickstartLink: "/docs/examples",
      example: `import Fastify from 'fastify'
import x402Plugin from '@x1pays/middleware/fastify'

const fastify = Fastify()

await fastify.register(x402Plugin, {
  facilitatorUrl: 'http://localhost:4000',
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET,
  tokenMint: process.env.WXNT_MINT,
  amount: '1000'
})

fastify.get('/premium', {
  preHandler: fastify.x402()
}, async (request) => {
  return { data: 'paid content' }
})`
    },
    {
      name: "Next.js API Routes",
      icon: ArrowUpwardIcon,
      color: "secondary",
      description: "API routes within Next.js applications",
      pros: [
        "Integrated with Next.js frontend",
        "Serverless-friendly",
        "TypeScript support out of the box",
        "Great for full-stack apps"
      ],
      cons: [
        "Tied to Next.js ecosystem",
        "Cold start latency in serverless",
        "Less flexible than standalone servers"
      ],
      bestFor: "Full-stack Next.js applications, serverless deployments",
      quickstartLink: "/docs/examples",
      example: `// pages/api/premium.ts
import { x402Handler } from '@x1pays/middleware/nextjs'

export default x402Handler({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  network: 'x1-mainnet',
  payToAddress: process.env.MERCHANT_WALLET!,
  tokenMint: process.env.WXNT_MINT!,
  amount: '1000',
  handler: async (req, res) => {
    // Payment verified! req.x402Payment has payment info
    res.status(200).json({ data: 'paid content' })
  }
})`
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
            All Server Options
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Choose the right framework for your x402-enabled API server.
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 4, fontSize: '2rem' }}>Quick Comparison</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ transition: 'all 0.3s ease', border: '1px solid', borderColor: 'primary.dark' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ transition: 'all 0.3s ease', bgcolor: 'background.paper' }}>
                  <TableCell><Typography fontWeight={600}>Framework</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Performance</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Learning Curve</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>TypeScript</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Edge Support</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><Typography fontWeight={600}>Express.js</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[1, 2, 3].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Easy</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Manual</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <CancelIcon sx={{ fontSize: 18, color: 'error.main' }} />
                      <Typography>No</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'rgba(0, 229, 255, 0.02)' }}>
                  <TableCell><Typography fontWeight={600}>Hono</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Fastest</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Easy</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Built-in</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography>Yes</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Typography fontWeight={600}>Fastify</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Very Fast</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Moderate</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Excellent</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                      <Typography>Partial</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'rgba(0, 229, 255, 0.02)' }}>
                  <TableCell><Typography fontWeight={600}>Next.js API</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[1, 2, 3].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Easy</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ fontSize: 18, color: 'warning.main' }} />)}
                      <Typography sx={{ ml: 1 }}>Built-in</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography>Vercel</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Stack spacing={6}>
          {frameworks.map((framework) => {
            const IconComponent = framework.icon;
            return (
              <Card
                key={framework.name}
                elevation={0}
                
                sx={{ transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: `${framework.color}.dark`,
                  '&:hover': {
                    borderColor: `${framework.color}.main`,
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
                          bgcolor: `rgba(${framework.color === 'success' ? '118, 255, 3' : framework.color === 'error' ? '255, 82, 82' : framework.color === 'info' ? '0, 229, 255' : '118, 255, 3'}, 0.1)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 32, color: `${framework.color}.main` }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {framework.name}
                        </Typography>
                        <Typography color="text.secondary">{framework.description}</Typography>
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
                        {framework.pros.map((pro, i) => (
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
                        {framework.cons.map((con, i) => (
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
                      <TrackChangesIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Best For</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{framework.bestFor}</Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Code Example</Typography>
                    <CodeBlock code={framework.example} language="typescript" />
                  </Box>

                  <Button
                    component={Link}
                    to={framework.quickstartLink}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.light' }
                    }}
                  >
                    View {framework.name} Quickstart
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <HelpOutlineIcon sx={{ color: 'info.main', fontSize: 28 }} />
              <Typography variant="h2" sx={{ fontSize: '2rem' }}>Decision Guide</Typography>
            </Box>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Choose Express if:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You want maximum compatibility, have a team familiar with it, or need access to the largest middleware ecosystem.
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Choose Hono if:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You need edge deployment, want the best performance, or are building a new TypeScript project from scratch.
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Choose Fastify if:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You need high throughput, want built-in schema validation, or are building microservices.
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Choose Next.js API Routes if:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You're already using Next.js for your frontend and want a unified full-stack application.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

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
                  See full working examples across frameworks
                </Typography>
              </CardContent>
            </Card>
            <Card
              component={Link}
              to="/quickstart/clients"
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
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build a Client</Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn how to consume your x402 API
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AllServerOptions;
