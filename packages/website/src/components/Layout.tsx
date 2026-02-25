import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Zap, Github, Twitter } from 'lucide-react'

const NAV = [
  { name: 'Docs', href: '/docs' },
  { name: 'Pricing', href: '/pricing' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 z-50 border-b border-surface-border backdrop-blur-md bg-surface/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Zap size={22} className="text-accent-light" />
            <span className="font-heading text-lg font-bold text-white tracking-wider">
              X1Pays
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-[15px] font-medium transition-colors duration-200 cursor-pointer ${
                  location.pathname === item.href
                    ? 'text-accent-light'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://github.com/x1pays"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.npmjs.com/package/@x1pay/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
            >
              Get SDK
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white/60 cursor-pointer"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-surface-border bg-surface-raised px-4 py-4 space-y-3">
            {NAV.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium py-2 cursor-pointer ${
                  location.pathname === item.href
                    ? 'text-accent-light'
                    : 'text-white/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://www.npmjs.com/package/@x1pay/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold cursor-pointer"
            >
              Get SDK
            </a>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-surface-border mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-accent-light" />
                <span className="font-heading text-sm font-bold text-white tracking-wider">X1Pays</span>
              </div>
              <p className="text-white/30 text-[15px] leading-relaxed">
                AI payment infrastructure on X1 blockchain.
                <br />x402 protocol. Gasless. Multi-asset.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-white/25 font-semibold mb-4">Resources</h4>
              <div className="space-y-2.5">
                <Link to="/docs" className="block text-[15px] text-white/40 hover:text-white transition-colors cursor-pointer">Documentation</Link>
                <Link to="/pricing" className="block text-[15px] text-white/40 hover:text-white transition-colors cursor-pointer">Pricing</Link>
                <a href="https://www.npmjs.com/package/@x1pay/sdk" target="_blank" rel="noopener noreferrer" className="block text-[15px] text-white/40 hover:text-white transition-colors cursor-pointer">npm</a>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest text-white/25 font-semibold mb-4">Community</h4>
              <div className="space-y-2.5">
                <a href="https://github.com/x1pays" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[15px] text-white/40 hover:text-white transition-colors cursor-pointer">
                  <Github size={16} /> GitHub
                </a>
                <a href="https://x.com/x1pays" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[15px] text-white/40 hover:text-white transition-colors cursor-pointer">
                  <Twitter size={16} /> X (Twitter)
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-surface-border">
            <p className="text-center text-xs text-white/20">
              &copy; {new Date().getFullYear()} X1Pays. Open source under MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
