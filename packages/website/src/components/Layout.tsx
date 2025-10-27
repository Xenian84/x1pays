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
import MenuIcon from '@mui/icons-material/Menu'
import CodeIcon from '@mui/icons-material/Code'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import { SiDiscord } from '@icons-pack/react-simple-icons'

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
        <Toolbar className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 no-underline">
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
          </Link>

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

      <Box component="footer" className="border-t border-primary/10 mt-20" sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg" className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
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
              </div>
              <Typography variant="body2" color="text.secondary">
                HTTP 402 micropayments on X1 blockchain using wXNT tokens.
              </Typography>
            </div>
            
            <div>
              <Typography variant="subtitle2" className="mb-4 uppercase tracking-wider" sx={{ fontWeight: 600 }}>
                Resources
              </Typography>
              <div className="flex flex-col gap-2">
                <Link to="/docs" className="text-sm no-underline hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                  Documentation
                </Link>
                <Link to="/docs/getting-started" className="text-sm no-underline hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                  Getting Started
                </Link>
                <Link to="/docs/api-reference" className="text-sm no-underline hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                  API Reference
                </Link>
                <Link to="/docs/examples" className="text-sm no-underline hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                  Integration Examples
                </Link>
                <Link to="/docs/troubleshooting" className="text-sm no-underline hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                  Troubleshooting
                </Link>
                <Link to="/pricing" className="text-sm no-underline hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                  Pricing
                </Link>
                <Link to="/faq" className="text-sm no-underline hover:text-primary transition-colors" style={{ color: 'inherit' }}>
                  FAQ
                </Link>
              </div>
            </div>
            
            <div>
              <Typography variant="subtitle2" className="mb-4 uppercase tracking-wider" sx={{ fontWeight: 600 }}>
                Community
              </Typography>
              <div className="flex flex-col gap-2">
                <a href="https://github.com/x1pays/x1pays" target="_blank" rel="noopener noreferrer" className="text-sm no-underline hover:text-primary transition-colors flex items-center gap-2" style={{ color: 'inherit' }}>
                  <GitHubIcon fontSize="small" /> GitHub
                </a>
                <a href="https://twitter.com/x1pays" target="_blank" rel="noopener noreferrer" className="text-sm no-underline hover:text-primary transition-colors flex items-center gap-2" style={{ color: 'inherit' }}>
                  <TwitterIcon fontSize="small" /> Twitter
                </a>
                <a href="https://discord.gg/x1pays" target="_blank" rel="noopener noreferrer" className="text-sm no-underline hover:text-primary transition-colors flex items-center gap-2" style={{ color: 'inherit' }}>
                  <SiDiscord size={16} /> Discord
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-primary/10">
            <Typography variant="body2" align="center" color="text.secondary">
              © 2025 X1Pays. Open source under MIT License.
            </Typography>
          </div>
        </Container>
      </Box>
    </Box>
  )
}
