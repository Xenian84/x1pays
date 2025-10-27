import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import QuizIcon from '@mui/icons-material/Quiz'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import GitHubIcon from '@mui/icons-material/GitHub'

const FAQ = () => {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const faqs = [
    {
      category: 'Getting Started',
      color: 'primary',
      questions: [
        {
          q: 'What is x402?',
          a: 'x402 is a payment protocol that uses HTTP 402 (Payment Required) status code to enable seamless micropayments for API access. Instead of API keys or subscriptions, users pay per request using cryptocurrency on the X1 blockchain.',
        },
        {
          q: 'Why X1 blockchain?',
          a: 'X1 is a high-performance Layer 1 blockchain with extremely low transaction fees (fractions of a cent) and fast finality. This makes it perfect for micropayments where traditional payment rails would be too expensive.',
        },
        {
          q: 'Do I need to run my own blockchain node?',
          a: 'No! X1Pays provides a Facilitator service that handles all blockchain interactions for you. You just integrate the API middleware and we handle the rest.',
        },
      ],
    },
    {
      category: 'Payments & Tokens',
      color: 'secondary',
      questions: [
        {
          q: "What's the difference between wXNT and $XPY?",
          a: 'wXNT is the payment token - users pay with it for API access. $XPY is the governance and value capture token - holders can stake it for governance rights and benefit from protocol growth. X1Pays charges 0% protocol fees, so merchants receive 100% of every payment.',
        },
        {
          q: 'How much does each payment cost?',
          a: 'Payment amounts are set by the merchant (API provider). X1Pays charges 0% protocol fees and covers all gas costs. For example, if an API endpoint costs 1000 wXNT atomic units (0.001 wXNT), the merchant receives the full 1000 units (100%). Zero fees, instant settlement.',
        },
        {
          q: 'Where can I get wXNT tokens?',
          a: 'wXNT is a wrapped version of XNT (X1\'s native token). You can get XNT from X1 exchanges and wrap it to wXNT using the official X1 bridge or DEX protocols on X1.',
        },
        {
          q: 'How does X1Pays make money with 0% fees?',
          a: 'X1Pays monetizes through $XPY token appreciation rather than transaction fees. As the protocol grows and more value flows through the network, $XPY holders benefit from increased demand and ecosystem value, not by taking a cut of merchant revenue.',
        },
      ],
    },
    {
      category: 'Integration',
      color: 'info',
      questions: [
        {
          q: 'How do I integrate x402 into my API?',
          a: 'It\'s simple! Install @x1pays/middleware, configure your merchant wallet address, and wrap your premium routes. The middleware automatically handles payment verification and settlement. Check our Getting Started guide for detailed steps.',
        },
        {
          q: 'Can I use x402 with any programming language?',
          a: 'Yes! We provide official packages for Node.js/TypeScript (@x1pays/middleware for servers, @x1pays/client for API consumers). The x402 protocol is just HTTP - any language that can make HTTP requests and sign Ed25519 signatures can integrate. We have examples for Python, cURL, and more in our documentation.',
        },
        {
          q: 'Do my users need a special wallet?',
          a: 'Users need any X1-compatible wallet that supports Ed25519 signatures. Popular options include X1 Wallet, Phantom (if X1 support added), or any programmatic wallet using the X1 SDK.',
        },
        {
          q: 'How long does payment verification take?',
          a: 'Payment verification is near-instant (< 1 second) because we verify signatures cryptographically. Blockchain settlement happens in the background and takes 2-3 seconds on X1.',
        },
      ],
    },
    {
      category: 'Security & Privacy',
      color: 'warning',
      questions: [
        {
          q: 'Is x402 secure?',
          a: 'Yes! Payments are cryptographically signed using Ed25519 signatures, the same standard used by major blockchains. The Facilitator verifies signatures before settlement, preventing fraud and double-spending.',
        },
        {
          q: 'What if a user sends an invalid payment?',
          a: 'The middleware rejects invalid payments before they reach your API logic. Users receive a 402 response with details about what\'s wrong (invalid signature, insufficient amount, etc.).',
        },
        {
          q: 'Can users reverse payments?',
          a: 'No. Blockchain transactions are irreversible once confirmed. This protects merchants from chargebacks while ensuring instant, final settlement.',
        },
        {
          q: 'Do you store payment data?',
          a: 'The Facilitator only processes payments transiently. All payment records exist on the X1 blockchain, which is public and immutable. We don\'t maintain a centralized payment database.',
        },
      ],
    },
    {
      category: 'Troubleshooting',
      color: 'error',
      questions: [
        {
          q: 'Why am I getting \'Invalid signature\' errors?',
          a: 'This usually means the payment signature doesn\'t match the payment data. Check that: 1) You\'re using Ed25519 signatures (not secp256k1), 2) The signature was created with the correct private key, 3) The payment amount, recipient, and tokenMint match exactly what the API expects, 4) The signature is base58-encoded.',
        },
        {
          q: 'Payments verify but don\'t settle - what\'s wrong?',
          a: 'Check your configuration. Ensure the payToAddress parameter in your middleware config matches your merchant wallet address. In development mode, settlements are simulated by default (check the \'simulated\' field in the payment response).',
        },
        {
          q: 'How do I test without spending real tokens?',
          a: 'Use the simulation mode! Set your environment to development and the Facilitator will simulate settlements without actual blockchain transactions. Perfect for testing your integration.',
        },
        {
          q: 'Can I refund a payment?',
          a: 'x402 doesn\'t have built-in refunds since blockchain transactions are irreversible. However, you can manually send tokens back to a user\'s wallet address if needed for customer service reasons.',
        },
      ],
    },
  ]

  let panelIndex = 0

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <QuizIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
              Frequently Asked Questions
            </Typography>
          </Box>
          <Typography variant="h5" color="text.secondary">
            Everything you need to know about x402 payments on X1 blockchain
          </Typography>
        </Stack>

        <Stack spacing={6}>
          {faqs.map((category, catIndex) => (
            <Card
              key={catIndex}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: `${category.color}.dark`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: `${category.color}.main`,
                  }}
                >
                  {category.category}
                </Typography>
                <Stack spacing={1.5}>
                  {category.questions.map((faq) => {
                    const currentPanelId = `panel${panelIndex++}`
                    return (
                      <Accordion
                        key={currentPanelId}
                        expanded={expanded === currentPanelId}
                        onChange={handleChange(currentPanelId)}
                        elevation={0}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:before': {
                            display: 'none',
                          },
                          '&.Mui-expanded': {
                            borderColor: `${category.color}.dark`,
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: `${category.color}.main` }} />}
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.02)',
                            },
                          }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {faq.q}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {faq.a}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    )
                  })}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Card
          elevation={0}
          sx={{
            mt: 8,
            border: '1px solid',
            borderColor: 'primary.dark',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(118, 255, 3, 0.05) 100%)',
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Still have questions?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
              Can't find what you're looking for? Check out our documentation or join our community.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                href="/docs"
                size="large"
                startIcon={<RocketLaunchIcon />}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Read the Docs
              </Button>
              <Button
                variant="outlined"
                href="https://github.com/x1pays"
                target="_blank"
                rel="noopener noreferrer"
                size="large"
                startIcon={<GitHubIcon />}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: 'rgba(0, 229, 255, 0.08)',
                  },
                }}
              >
                GitHub Community
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default FAQ
