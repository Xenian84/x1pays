import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import LockIcon from '@mui/icons-material/Lock'
import LinkIcon from '@mui/icons-material/Link'
import BuildIcon from '@mui/icons-material/Build'
import PhonelinkIcon from '@mui/icons-material/Phonelink'
import ScienceIcon from '@mui/icons-material/Science'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import GitHubIcon from '@mui/icons-material/GitHub'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import HelpIcon from '@mui/icons-material/Help'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

const Troubleshooting = () => {
  const issues = [
    {
      category: "Payment Verification Errors",
      icon: <LockIcon sx={{ fontSize: 32 }} />,
      color: 'error',
      problems: [
        {
          title: "Invalid Signature Error",
          symptoms: ["HTTP 402 with 'Invalid signature' message", "Payment rejected immediately"],
          causes: [
            "Signature created with wrong private key",
            "Payment data modified after signing",
            "Timestamp expired (> 5 minutes old)",
            "Incorrect signature encoding"
          ],
          solutions: [
            "Verify you're using the correct wallet private key",
            "Ensure payment object matches exactly what was signed",
            "Generate fresh signatures (don't reuse old ones)",
            "Check that signature is base64-encoded Ed25519 format",
            "Example: const sig = ed.sign(JSON.stringify(payment), privateKey)"
          ]
        },
        {
          title: "Insufficient Payment Amount",
          symptoms: ["402 response: 'Amount too low'", "Payment verification fails"],
          causes: [
            "Payment amount less than required by endpoint",
            "Fee not included in payment calculation"
          ],
          solutions: [
            "Check the 'amount' field in HTTP 402 response",
            "Ensure you're sending exact amount or more",
            "Remember: merchant sets the price, not the protocol"
          ]
        },
        {
          title: "Recipient Mismatch",
          symptoms: ["Payment sent but not accepted", "Wrong recipient error"],
          causes: [
            "Payment sent to wrong wallet address",
            "Merchant wallet configuration incorrect"
          ],
          solutions: [
            "Verify merchant's wallet address from 402 response",
            "Check MERCHANT_WALLET env variable on server",
            "Ensure 'to' field in payment matches merchant address"
          ]
        }
      ]
    },
    {
      category: "Settlement Issues",
      icon: <LinkIcon sx={{ fontSize: 32 }} />,
      color: 'warning',
      problems: [
        {
          title: "Payment Verifies But Doesn't Settle",
          symptoms: ["Signature valid but no blockchain transaction", "Settlement timeout"],
          causes: [
            "Facilitator not configured correctly",
            "Simulation mode enabled in production",
            "RPC connection issues"
          ],
          solutions: [
            "Check Facilitator logs for errors",
            "Verify PAYTO_ADDRESS (merchant wallet) is set in API",
            "Ensure X1_RPC_URL is reachable",
            "Check if NODE_ENV=development (enables simulation)",
            "Verify FEE_PAYER wallet has funds for gas costs"
          ]
        },
        {
          title: "Transaction Failed on Blockchain",
          symptoms: ["Settlement attempted but transaction reverted", "Blockchain error in logs"],
          causes: [
            "Insufficient gas/funds in merchant wallet",
            "Invalid token contract address",
            "Network congestion"
          ],
          solutions: [
            "Ensure merchant wallet has native XNT for gas",
            "Verify wXNT token contract address is correct",
            "Check X1 network status",
            "Review transaction hash on X1 explorer"
          ]
        }
      ]
    },
    {
      category: "Integration Problems",
      icon: <BuildIcon sx={{ fontSize: 32 }} />,
      color: 'info',
      problems: [
        {
          title: "Middleware Not Intercepting Requests",
          symptoms: ["No 402 response on premium routes", "Requests bypass payment check"],
          causes: [
            "Middleware not applied to route",
            "Route defined before middleware",
            "Incorrect middleware order"
          ],
          solutions: [
            "Ensure x402Middleware is applied: app.use('/premium', x402Middleware, router)",
            "Check middleware comes before route handlers",
            "Verify route path matches middleware application",
            "Example: app.use('/api/premium', x402, premiumRoutes)"
          ]
        },
        {
          title: "CORS Errors with Payment Headers",
          symptoms: ["Browser blocks X-Payment header", "Payment data not accessible"],
          causes: [
            "CORS not configured for custom headers",
            "Payment header not in Access-Control-Expose-Headers"
          ],
          solutions: [
            "Add to CORS config: exposedHeaders: ['X-Payment', 'X-Payment-Response']",
            "Enable credentials if needed: credentials: true",
            "Ensure API domain matches or is in allowed origins"
          ]
        },
        {
          title: "Environment Variables Not Loading",
          symptoms: ["Undefined MERCHANT_WALLET", "Missing configuration errors"],
          causes: [
            ".env file not in correct location",
            "Environment variables not loaded",
            "Typos in variable names"
          ],
          solutions: [
            "Place .env in package root (same level as package.json)",
            "Import dotenv: require('dotenv').config()",
            "Check variable names match exactly (case-sensitive)",
            "Restart server after changing .env",
            "Use .env.example as template"
          ]
        }
      ]
    },
    {
      category: "Client SDK Issues",
      icon: <PhonelinkIcon sx={{ fontSize: 32 }} />,
      color: 'primary',
      problems: [
        {
          title: "Payment Client Creation Fails",
          symptoms: ["Cannot create PaymentClient", "Initialization errors"],
          causes: [
            "Missing API URL configuration",
            "Invalid facilitator URL",
            "Network connectivity issues"
          ],
          solutions: [
            "Verify API_URL is correct and reachable",
            "Check facilitator is running and accessible",
            "Test connectivity: curl $FACILITATOR_URL/health",
            "Ensure URLs include protocol (http:// or https://)"
          ]
        },
        {
          title: "Auto-Payment Not Working",
          symptoms: ["Requests fail even with wallet configured", "No automatic payment"],
          causes: [
            "Wallet not properly initialized",
            "Insufficient wXNT balance",
            "Private key format incorrect"
          ],
          solutions: [
            "Check wallet initialization: new Wallet(privateKey)",
            "Verify wallet has wXNT tokens",
            "Ensure private key is valid Ed25519 format",
            "Test manual payment first before auto-payment"
          ]
        }
      ]
    },
    {
      category: "Testing & Development",
      icon: <ScienceIcon sx={{ fontSize: 32 }} />,
      color: 'secondary',
      problems: [
        {
          title: "Want to Test Without Real Tokens",
          symptoms: ["Need to test without blockchain costs"],
          causes: [],
          solutions: [
            "Set NODE_ENV=development in .env",
            "Facilitator will simulate settlements",
            "All signatures still verified (security maintained)",
            "No actual blockchain transactions occur",
            "Response includes 'simulated: true' flag"
          ]
        },
        {
          title: "How to Debug Payment Flow",
          symptoms: ["Need to see what's happening"],
          causes: [],
          solutions: [
            "Enable debug logging in facilitator",
            "Check X-Payment-Response header in successful requests",
            "Examine facilitator /settle response",
            "Use browser dev tools Network tab",
            "Log payment object before signing",
            "Verify signature matches: console.log(signature)"
          ]
        }
      ]
    }
  ]

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={2} sx={{ mb: 8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
            Troubleshooting Guide
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Solutions to common issues when integrating x402 payments
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid',
            borderColor: 'primary.dark',
            borderRadius: 2,
            p: 4,
            mb: 6,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <LightbulbIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                Quick Debugging Tips
              </Typography>
              <Stack spacing={1}>
                {[
                  'Check facilitator logs first - most errors show up there',
                  'Verify all environment variables are set correctly',
                  'Use simulation mode (NODE_ENV=development) for testing',
                  'Inspect HTTP 402 response - it contains required payment details',
                  'Check X-Payment-Response header for settlement info',
                ].map((tip, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    {tip}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Stack spacing={6}>
          {issues.map((category, catIndex) => (
            <Card
              key={catIndex}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: `${category.color}.dark`,
              }}
            >
              <Box
                sx={{
                  bgcolor: `rgba(${category.color === 'error' ? '244, 67, 54' : category.color === 'warning' ? '255, 183, 77' : category.color === 'info' ? '0, 229, 255' : category.color === 'primary' ? '0, 229, 255' : '118, 255, 3'}, 0.1)`,
                  borderBottom: '1px solid',
                  borderColor: `${category.color}.dark`,
                  p: 3,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: `rgba(${category.color === 'error' ? '244, 67, 54' : category.color === 'warning' ? '255, 183, 77' : category.color === 'info' ? '0, 229, 255' : category.color === 'primary' ? '0, 229, 255' : '118, 255, 3'}, 0.2)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: `${category.color}.main`,
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {category.category}
                  </Typography>
                </Stack>
              </Box>
              
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={4}>
                  {category.problems.map((problem, probIndex) => (
                    <Box key={probIndex}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: `${category.color}.main` }}>
                        {problem.title}
                      </Typography>
                      
                      {problem.symptoms.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <ErrorIcon sx={{ fontSize: 18, color: 'error.main' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main' }}>
                              Symptoms:
                            </Typography>
                          </Stack>
                          <Stack spacing={1} sx={{ pl: 3.5 }}>
                            {problem.symptoms.map((symptom, i) => (
                              <Typography key={i} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Box component="span" sx={{ color: 'error.main', mt: 0.5 }}>•</Box>
                                {symptom}
                              </Typography>
                            ))}
                          </Stack>
                        </Box>
                      )}
                      
                      {problem.causes.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'warning.main' }}>
                              Common Causes:
                            </Typography>
                          </Stack>
                          <Stack spacing={1} sx={{ pl: 3.5 }}>
                            {problem.causes.map((cause, i) => (
                              <Typography key={i} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Box component="span" sx={{ color: 'warning.main', mt: 0.5 }}>•</Box>
                                {cause}
                              </Typography>
                            ))}
                          </Stack>
                        </Box>
                      )}
                      
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                            Solutions:
                          </Typography>
                        </Stack>
                        <Stack spacing={1} sx={{ pl: 3.5 }}>
                          {problem.solutions.map((solution, i) => (
                            <Typography key={i} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, lineHeight: 1.7 }}>
                              <Box component="span" sx={{ color: 'secondary.main', mt: 0.5 }}>•</Box>
                              {solution}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>

                      {probIndex < category.problems.length - 1 && (
                        <Divider sx={{ mt: 4 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.paper', borderRadius: 3, p: 6, mt: 8 }}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(118, 255, 3, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
          
          <Box sx={{ position: 'relative' }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <HelpIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Still stuck?
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                If you can't find a solution here, check our documentation or reach out to the community.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/docs/api-reference"
                  variant="contained"
                  startIcon={<MenuBookIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  API Reference
                </Button>
                <Button
                  component={Link}
                  to="/faq"
                  variant="outlined"
                  startIcon={<HelpIcon />}
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
                  Check FAQ
                </Button>
                <Button
                  href="https://github.com/x1pays"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: 'text.secondary',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'text.primary',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  GitHub Issues
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Troubleshooting
