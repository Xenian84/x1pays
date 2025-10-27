import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Docs from './pages/Docs'
import GettingStarted from './pages/GettingStarted'
import ApiReference from './pages/ApiReference'
import TokenEconomy from './pages/TokenEconomy'
import FAQ from './pages/FAQ'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Troubleshooting from './pages/Troubleshooting'
import Examples from './pages/Examples'
import Echo from './pages/Echo'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/getting-started" element={<GettingStarted />} />
          <Route path="/docs/api-reference" element={<ApiReference />} />
          <Route path="/docs/token-economy" element={<TokenEconomy />} />
          <Route path="/docs/examples" element={<Examples />} />
          <Route path="/docs/troubleshooting" element={<Troubleshooting />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/echo" element={<Echo />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
