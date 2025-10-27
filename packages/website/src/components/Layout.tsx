import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import MenuIcon from '@mui/icons-material/Menu'
import CodeIcon from '@mui/icons-material/Code'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import ForumIcon from '@mui/icons-material/Forum'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Facilitator', href: '/facilitator' },
    { name: 'Docs', href: '/docs' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ 
          maxWidth: '1280px', 
          mx: 'auto', 
          width: '100%', 
          px: { xs: 2, sm: 3, lg: 4 }
        }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
            }}
          >
            <CodeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              X1Pays
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {navigation.map((item) => (
              <Button
                key={item.name}
                component={Link}
                to={item.href}
                sx={{
                  color: location.pathname === item.href ? 'primary.main' : 'text.primary',
                  fontWeight: location.pathname === item.href ? 600 : 400,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
            <Button
              variant="contained"
              href="https://github.com/x1pays/x1pays"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon />}
              sx={{ ml: 1 }}
            >
              GitHub
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 2 }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, bgcolor: 'background.paper', height: '100%' }}>
          <List>
            {navigation.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.href}
                  selected={location.pathname === item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="https://github.com/x1pays/x1pays"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon sx={{ mr: 2 }} />
                <ListItemText primary="GitHub" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box 
        component="footer" 
        sx={{ 
          borderTop: 1, 
          borderColor: 'primary.dark',
          mt: 10,
          bgcolor: 'background.paper' 
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: 6, 
            px: { xs: 2, sm: 3, lg: 4 }
          }}
        >
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CodeIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #00E5FF 0%, #76FF03 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  X1Pays
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                HTTP 402 micropayments on X1 blockchain using wXNT tokens.
              </Typography>
            </Box>
            
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 2, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  fontWeight: 600 
                }}
              >
                Resources
              </Typography>
              <Stack spacing={1}>
                <Box
                  component={Link}
                  to="/docs"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Documentation
                </Box>
                <Box
                  component={Link}
                  to="/docs/getting-started"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Getting Started
                </Box>
                <Box
                  component={Link}
                  to="/docs/api-reference"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  API Reference
                </Box>
                <Box
                  component={Link}
                  to="/docs/examples"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Integration Examples
                </Box>
                <Box
                  component={Link}
                  to="/docs/troubleshooting"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Troubleshooting
                </Box>
                <Box
                  component={Link}
                  to="/pricing"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Pricing
                </Box>
                <Box
                  component={Link}
                  to="/faq"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  FAQ
                </Box>
              </Stack>
            </Box>
            
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 2, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  fontWeight: 600 
                }}
              >
                Community
              </Typography>
              <Stack spacing={1}>
                <Box
                  component="a"
                  href="https://github.com/x1pays/x1pays"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <GitHubIcon fontSize="small" /> GitHub
                </Box>
                <Box
                  component="a"
                  href="https://twitter.com/x1pays"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <TwitterIcon fontSize="small" /> Twitter
                </Box>
                <Box
                  component="a"
                  href="https://discord.gg/x1pays"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <ForumIcon sx={{ fontSize: 16 }} /> Discord
                </Box>
              </Stack>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'primary.dark' }}>
            <Typography variant="body2" align="center" color="text.secondary">
              © 2025 X1Pays. Open source under MIT License.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
