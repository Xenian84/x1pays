import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Docs from './pages/Docs'
import GettingStarted from './pages/GettingStarted'
import ApiReference from './pages/ApiReference'
import TokenEconomy from './pages/TokenEconomy'

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
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
