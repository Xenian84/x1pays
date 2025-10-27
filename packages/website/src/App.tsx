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
import Facilitator from './pages/Facilitator'
import ExpressQuickstart from './pages/ExpressQuickstart'
import HonoQuickstart from './pages/HonoQuickstart'
import AllServerOptions from './pages/AllServerOptions'
import AxiosClient from './pages/AxiosClient'
import FetchClient from './pages/FetchClient'
import AllClientOptions from './pages/AllClientOptions'

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
          <Route path="/facilitator" element={<Facilitator />} />
          <Route path="/quickstart/express" element={<ExpressQuickstart />} />
          <Route path="/quickstart/hono" element={<HonoQuickstart />} />
          <Route path="/quickstart/servers" element={<AllServerOptions />} />
          <Route path="/quickstart/axios" element={<AxiosClient />} />
          <Route path="/quickstart/fetch" element={<FetchClient />} />
          <Route path="/quickstart/clients" element={<AllClientOptions />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
