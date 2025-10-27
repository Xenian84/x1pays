import { Link, useLocation } from 'react-router-dom'
import { Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Facilitator', href: '/facilitator' },
    { name: 'Docs', href: '/docs' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Code2 className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold gradient-text">X1Pays</span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://github.com/x1pays/x1pays"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold gradient-text">X1Pays</span>
              </div>
              <p className="text-gray-600 text-sm">
                HTTP 402 micropayments on X1 blockchain using wXNT tokens.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs" className="text-gray-600 hover:text-primary">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/docs/getting-started" className="text-gray-600 hover:text-primary">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link to="/docs/api-reference" className="text-gray-600 hover:text-primary">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link to="/docs/examples" className="text-gray-600 hover:text-primary">
                    Integration Examples
                  </Link>
                </li>
                <li>
                  <Link to="/docs/troubleshooting" className="text-gray-600 hover:text-primary">
                    Troubleshooting
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-primary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Community
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/x1pays/x1pays" className="text-gray-600 hover:text-primary">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/x1pays" className="text-gray-600 hover:text-primary">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/x1pays" className="text-gray-600 hover:text-primary">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-gray-400 text-sm text-center">
              © 2025 X1Pays. Open source under MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
