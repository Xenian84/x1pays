import { Link } from 'react-router-dom'
import {
  Zap,
  Bot,
  Shield,
  ArrowRight,
  Terminal,
  Layers,
  Cpu,
  ChevronRight,
  BarChart3,
} from 'lucide-react'

const INTEGRATIONS = [
  { name: 'SDK', pkg: '@x1pay/sdk', desc: 'WalletManager, payments, spending policies' },
  { name: 'DEX', pkg: '@x1pay/dex', desc: 'xDEX swaps, quotes, pool discovery' },
  { name: 'OpenClaw', pkg: '@x1pay/openclaw', desc: 'Full agent plugin — 12 tools, DeFi, trading' },
  { name: 'MCP', pkg: '@x1pay/mcp', desc: 'Model Context Protocol for Claude/Cursor' },
  { name: 'Middleware', pkg: '@x1pay/middleware', desc: 'Express x402 paywall in one line' },
]

const FEATURES = [
  {
    icon: Bot,
    title: 'Agent-Native',
    desc: 'OpenClaw plugin, MCP server, autonomous wallets. AI agents pay, trade, and manage portfolios via natural language.',
  },
  {
    icon: Zap,
    title: 'Gasless x402 Payments',
    desc: 'For x402 API payments, the facilitator co-signs and covers gas — buyers pay only the resource price. Direct sends and DEX swaps use the agent wallet for gas.',
  },
  {
    icon: Shield,
    title: 'Trustless Settlement',
    desc: 'Buyer signs, facilitator co-signs. On-chain TransferChecked — no custodial risk, no escrow, no middleman.',
  },
  {
    icon: Layers,
    title: 'Multi-Asset',
    desc: 'USDC.x, wXNT, or native XNT. Token-2022 compatible. Pay with stablecoins or native tokens — same flow.',
  },
  {
    icon: BarChart3,
    title: 'Built-in DEX',
    desc: 'Swap tokens on xDEX directly from your agent. Quotes, slippage protection, DCA, and limit orders built in.',
  },
  {
    icon: Cpu,
    title: '10 bps Fee',
    desc: 'Transparent, flat 0.10% per transaction. No subscriptions, no minimum volume. You pay only when value flows.',
  },
]

const CODE_EXAMPLE = `import express from 'express'
import { x402 } from '@x1pay/middleware'

const app = express()

app.use('/api/premium', x402({
  payTo: 'YOUR_WALLET',
  amount: '100000',
  tokenMint: 'USDX',
  network: 'x1-mainnet',
  facilitatorUrl: 'https://x1pays.xyz/facilitator-alpha-mainnet',
}))

app.get('/api/premium/data', (req, res) => {
  res.json({ answer: 42 })
})`

const AGENT_EXAMPLE = `import { WalletManager } from '@x1pay/sdk'

const wallet = new WalletManager(
  process.env.AGENT_KEY,
  { network: 'x1-mainnet' }
)

// Pay for x402 resource
const data = await wallet.payForResource(
  'https://api.example.com/premium/data'
)

// Check balances & stats
console.log(await wallet.getBalances())
console.log(wallet.stats)`

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(3,105,161,0.5) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
              Payments + DeFi infrastructure for AI agents on X1
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              The payment layer
              <br />
              <span className="text-accent-light">for machines</span>
            </h1>

            <p className="text-white/40 text-xl sm:text-2xl leading-relaxed max-w-xl mb-10">
              AI agents pay for APIs, trade on xDEX, manage portfolios.
              x402 protocol with gasless settlement. Direct sends and swaps on-chain.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/docs"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-accent text-white font-semibold text-base hover:brightness-110 transition cursor-pointer"
              >
                Start Building <ArrowRight size={18} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-surface-border text-white/60 font-medium text-base hover:text-white hover:border-white/20 transition cursor-pointer"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-12 tracking-wide">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-border rounded-xl overflow-hidden">
            {[
              { step: '01', title: 'Request', desc: 'Client hits your endpoint. Server responds HTTP 402 with payment terms.' },
              { step: '02', title: 'Sign', desc: 'Buyer builds a TransferChecked transaction and partially signs it. SDK handles this.' },
              { step: '03', title: 'Settle', desc: 'Facilitator co-signs, pays gas, submits on-chain. Merchant gets paid. Client gets data.' },
            ].map((s) => (
              <div key={s.step} className="bg-surface-raised p-8">
                <span className="text-accent-light font-mono text-sm">{s.step}</span>
                <h3 className="font-heading text-xl font-semibold text-white mt-2 mb-3">{s.title}</h3>
                <p className="text-white/35 text-base leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 tracking-wide">
            Built for the agent economy
          </h2>
          <p className="text-white/30 text-base mb-12 max-w-lg">
            Everything an AI agent needs to pay, trade, and operate on X1.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl bg-surface-raised border border-surface-border hover:border-accent/20 transition-colors duration-200 group"
              >
                <f.icon size={22} className="text-accent-light mb-4 group-hover:text-accent-light" />
                <h3 className="font-heading text-base font-semibold text-white mb-2 tracking-wide">{f.title}</h3>
                <p className="text-white/30 text-[15px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code examples */}
      <section className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 tracking-wide">
            Two sides of the same coin
          </h2>
          <p className="text-white/30 text-base mb-12 max-w-lg">
            Monetize an endpoint in 5 lines. Pay for one in 4.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-surface-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-overlay border-b border-surface-border">
                <Terminal size={14} className="text-accent-light" />
                <span className="text-xs text-white/40 font-mono">server.ts</span>
                <span className="ml-auto text-[10px] text-white/20 uppercase tracking-widest">Merchant</span>
              </div>
              <pre className="p-4 text-sm leading-relaxed overflow-x-auto bg-surface-raised">
                <code className="text-white/60 font-mono">{CODE_EXAMPLE}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-surface-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-overlay border-b border-surface-border">
                <Bot size={14} className="text-accent-light" />
                <span className="text-xs text-white/40 font-mono">agent.ts</span>
                <span className="ml-auto text-[10px] text-white/20 uppercase tracking-widest">AI Agent</span>
              </div>
              <pre className="p-4 text-sm leading-relaxed overflow-x-auto bg-surface-raised">
                <code className="text-white/60 font-mono">{AGENT_EXAMPLE}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 tracking-wide">
            One protocol, many integrations
          </h2>
          <p className="text-white/30 text-base mb-12 max-w-lg">
            npm packages for every framework. Drop in and go.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border rounded-xl overflow-hidden">
            {INTEGRATIONS.map((pkg) => (
              <div key={pkg.name} className="bg-surface-raised p-6 flex items-start gap-4 group hover:bg-surface-overlay transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-0.5">{pkg.name}</h3>
                  <p className="text-sm text-white/25 font-mono truncate">{pkg.pkg}</p>
                  <p className="text-sm text-white/35 mt-1.5">{pkg.desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/10 group-hover:text-white/30 transition-colors mt-1 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ship payments today
          </h2>
          <p className="text-white/30 text-base mb-8 max-w-md mx-auto">
            npm install, configure your wallet, deploy.
            Your first paid API call is minutes away.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/docs"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-accent text-white font-semibold text-base hover:brightness-110 transition cursor-pointer"
            >
              Read the Docs <ArrowRight size={18} />
            </Link>
            <a
              href="https://www.npmjs.com/package/@x1pay/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-surface-border text-white/60 font-medium text-base hover:text-white hover:border-white/20 transition cursor-pointer"
            >
              npm install @x1pay/sdk
            </a>
          </div>

          <p className="text-white/15 text-sm mt-6">
            0.10% per transaction &middot; No minimum &middot; Gas covered
          </p>
        </div>
      </section>
    </div>
  )
}
