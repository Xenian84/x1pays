import { Terminal, Copy, Check, Server, ArrowRight } from 'lucide-react'
import { useState } from 'react'

function CopyBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-xl border border-surface-border overflow-hidden my-4">
      {label && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-overlay border-b border-surface-border">
          <Terminal size={13} className="text-accent-light" />
          <span className="text-xs text-white/40 font-mono">{label}</span>
          <button onClick={copy} className="ml-auto text-white/20 hover:text-white/50 transition-colors cursor-pointer">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      )}
      <pre className="p-4 text-[15px] leading-relaxed overflow-x-auto bg-surface-raised">
        <code className="text-white/60 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <h2 className="font-heading text-2xl font-bold text-white mb-6 tracking-wide">{title}</h2>
      {children}
    </section>
  )
}

const NAV_ITEMS = [
  { id: 'install', label: 'Installation' },
  { id: 'merchant', label: 'Merchant Setup' },
  { id: 'sdk', label: 'SDK / WalletManager' },
  { id: 'openclaw', label: 'OpenClaw Plugin' },
  { id: 'mcp', label: 'MCP Server' },
  { id: 'dex', label: 'DEX / Trading' },
  { id: 'assets', label: 'Supported Assets' },
  { id: 'flow', label: 'Payment Flow' },
  { id: 'api', label: 'API Reference' },
]

export default function Docs() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex gap-12">
        {/* Sidebar */}
        <nav className="hidden lg:block w-48 flex-shrink-0 sticky top-24 self-start">
          <h3 className="text-[11px] uppercase tracking-widest text-white/25 font-semibold mb-4">On this page</h3>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-[15px] text-white/30 hover:text-white/70 transition-colors py-1.5 cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Documentation</h1>
            <p className="text-white/35 text-base leading-relaxed max-w-xl">
              Everything you need to accept payments, trade tokens, or build AI agents that operate on X1.
            </p>
          </div>

          <Section id="install" title="Installation">
            <p className="text-white/40 text-base mb-4">Choose the package for your use case.</p>

            <div className="space-y-3">
              <div>
                <p className="text-white/50 text-sm font-mono mb-1">Merchant — paywall your API</p>
                <CopyBlock code="npm install @x1pay/middleware" label="terminal" />
              </div>
              <div>
                <p className="text-white/50 text-sm font-mono mb-1">AI Agent — wallet management, payments, policies</p>
                <CopyBlock code="npm install @x1pay/sdk" label="terminal" />
              </div>
              <div>
                <p className="text-white/50 text-sm font-mono mb-1">OpenClaw — full agent plugin (payments + trading)</p>
                <CopyBlock code="npm install @x1pay/openclaw" label="terminal" />
              </div>
              <div>
                <p className="text-white/50 text-sm font-mono mb-1">DEX — xDEX swap integration</p>
                <CopyBlock code="npm install @x1pay/dex" label="terminal" />
              </div>
            </div>
          </Section>

          <Section id="merchant" title="Merchant Setup">
            <p className="text-white/40 text-base mb-4">
              Add a paywall to any Express endpoint in one line.
            </p>

            <CopyBlock label="server.ts" code={`import express from 'express'
import { x402 } from '@x1pay/middleware'

const app = express()

app.use('/api/premium', x402({
  payTo: 'YOUR_SOLANA_WALLET_ADDRESS',
  amount: '100000',
  tokenMint: 'USDX',
  network: 'x1-mainnet',
  facilitatorUrl: 'https://x1pays.xyz/facilitator-alpha-mainnet',
}))

app.get('/api/premium/data', (req, res) => {
  res.json({ data: 'premium content' })
})

app.listen(3000)`} />

            <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/10">
              <div className="flex items-start gap-3">
                <Server size={16} className="text-accent-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/50 text-[15px]">
                    <strong className="text-white/70">How it works:</strong> When a request arrives without payment, the middleware returns HTTP 402 with payment terms.
                    The client SDK builds a transaction, the buyer signs it, and the facilitator settles it on-chain.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section id="sdk" title="SDK / WalletManager">
            <p className="text-white/40 text-base mb-4">
              The core SDK provides WalletManager for autonomous agent payments, spending policies, and multi-asset support.
            </p>

            <CopyBlock label="agent.ts" code={`import { WalletManager } from '@x1pay/sdk'

const wallet = new WalletManager(
  process.env.AGENT_PRIVATE_KEY,
  {
    network: 'x1-mainnet',
    facilitatorUrl: 'https://x1pays.xyz/facilitator-alpha-mainnet',
  }
)

// Set spending limits
wallet.setPolicy({
  maxPerTransaction: 10_000_000n,  // 10 USDX
  sessionBudget: 100_000_000n,     // 100 USDX
  dailyBudget: 500_000_000n,       // 500 USDX
})

// Pay for x402 resource
const result = await wallet.payForResource(
  'https://api.example.com/premium/data'
)
console.log(result.data)

// Check balances
const balances = await wallet.getBalances()
console.log(balances)

// Send tokens
await wallet.send('RECIPIENT_ADDRESS', '5.0', 'USDX')

// Session stats
console.log(wallet.stats)`} />
          </Section>

          <Section id="openclaw" title="OpenClaw Plugin">
            <p className="text-white/40 text-base mb-4">
              Install the X1Pays plugin in OpenClaw to give agents access to payments, trading, and DeFi via natural language.
            </p>

            <CopyBlock label="terminal" code={`npm install @x1pay/openclaw`} />

            <p className="text-white/40 text-base mt-4 mb-2">Configure in your OpenClaw settings:</p>
            <CopyBlock label="openclaw.config.json" code={`{
  "plugins": {
    "entries": {
      "x1pays": {
        "package": "@x1pay/openclaw",
        "config": {
          "privateKey": "YOUR_BASE58_KEY",
          "network": "x1-mainnet",
          "sessionBudget": 100000000,
          "priceAlerts": true
        }
      }
    }
  }
}`} />

            <p className="text-white/40 text-base mt-6 mb-2">Available tools (12 total):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {[
                { tool: 'x1pays_balance', desc: 'Check wallet balances' },
                { tool: 'x1pays_send', desc: 'Send tokens' },
                { tool: 'x1pays_pay', desc: 'Pay for x402 resources' },
                { tool: 'x1pays_probe', desc: 'Check payment requirements' },
                { tool: 'x1pays_assets', desc: 'List supported tokens' },
                { tool: 'x1pays_swap', desc: 'Swap tokens on xDEX' },
                { tool: 'x1pays_quote', desc: 'Get swap quote' },
                { tool: 'x1pays_price', desc: 'Token price lookup' },
                { tool: 'x1pays_pools', desc: 'List xDEX pools' },
                { tool: 'x1pays_stats', desc: 'Session statistics' },
                { tool: 'x1pays_portfolio', desc: 'Full portfolio view' },
                { tool: 'x1pays_history', desc: 'Transaction history' },
              ].map((t) => (
                <div key={t.tool} className="flex items-center gap-2 p-2 rounded bg-surface-raised">
                  <code className="text-accent-light text-xs">{t.tool}</code>
                  <span className="text-white/25 text-xs">{t.desc}</span>
                </div>
              ))}
            </div>

            <p className="text-white/40 text-base mt-6 mb-2">Slash commands (instant, no AI):</p>
            <div className="space-y-1 mt-2">
              {[
                '/balance — Quick balance check',
                '/swap <amount> <from> <to> — Execute swap',
                '/send <amount> <asset> <address> — Send tokens',
                '/price <tokenA> <tokenB> — Token price',
                '/portfolio — Full portfolio view',
              ].map((cmd) => (
                <p key={cmd} className="text-white/40 text-sm font-mono">{cmd}</p>
              ))}
            </div>
          </Section>

          <Section id="mcp" title="MCP Server">
            <p className="text-white/40 text-base mb-4">
              Run X1Pays as an MCP tool server. Any MCP-compatible AI agent (Claude Desktop, Cursor) can discover and use all 12 tools.
            </p>

            <CopyBlock label="terminal" code={`# Install globally
npm install -g @x1pay/mcp

# Run with environment config
X1PAYS_PRIVATE_KEY=your_base58_key \\
X1PAYS_NETWORK=x1-mainnet \\
x1pays-mcp`} />

            <p className="text-white/40 text-base mt-4">
              Exposes all 12 tools: <code className="text-accent-light text-sm">x1pays_balance</code>,{' '}
              <code className="text-accent-light text-sm">x1pays_pay</code>,{' '}
              <code className="text-accent-light text-sm">x1pays_swap</code>,{' '}
              <code className="text-accent-light text-sm">x1pays_quote</code>,{' '}
              <code className="text-accent-light text-sm">x1pays_price</code>,{' '}
              <code className="text-accent-light text-sm">x1pays_pools</code>, and more.
            </p>
          </Section>

          <Section id="dex" title="DEX / Trading">
            <p className="text-white/40 text-base mb-4">
              Trade tokens on xDEX (Raydium CP Swap fork on X1) directly from code.
            </p>

            <CopyBlock label="trading.ts" code={`import { XDex } from '@x1pay/dex'
import { WalletManager } from '@x1pay/sdk'

const dex = XDex.create('x1-mainnet')
const wallet = new WalletManager(process.env.KEY)

// Get a quote
const quote = await dex.getQuote('USDX', 'WXNT', '10.0')
console.log(quote.amountOut, quote.priceImpact)

// Execute swap
const result = await dex.swap(
  wallet.keypair, 'USDX', 'WXNT', '10.0', 100
)
console.log(result.txHash)

// Check price
const price = await dex.getPrice('USDX', 'WXNT')

// List pools
const pools = await dex.listPools()`} />
          </Section>

          <Section id="assets" title="Supported Assets">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-surface-border rounded-xl overflow-hidden">
              {[
                { symbol: 'USDX', name: 'USD Coin (X1)', mint: 'B69chRzq...Gm9Tq', decimals: 6, program: 'Token-2022' },
                { symbol: 'wXNT', name: 'Wrapped XNT', mint: 'So111111...1112', decimals: 6, program: 'SPL Token' },
                { symbol: 'XNT', name: 'Native XNT', mint: 'native', decimals: 9, program: 'System' },
              ].map((a) => (
                <div key={a.symbol} className="bg-surface-raised p-5">
                  <h3 className="font-heading text-sm font-semibold text-white tracking-wide">{a.symbol}</h3>
                  <p className="text-xs text-white/25 mt-1">{a.name}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-white/30"><span className="text-white/15">Mint:</span> <span className="font-mono">{a.mint}</span></p>
                    <p className="text-xs text-white/30"><span className="text-white/15">Decimals:</span> {a.decimals}</p>
                    <p className="text-xs text-white/30"><span className="text-white/15">Program:</span> {a.program}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="flow" title="Payment Flow">
            <div className="space-y-4">
              {[
                { step: '1', actor: 'Client', action: 'GET /api/premium/data', result: 'Receives HTTP 402 with payment requirements (payTo, asset, amount, facilitator)' },
                { step: '2', actor: 'Client SDK', action: 'Build transaction', result: 'Creates TransferChecked instruction, sets facilitator as feePayer, buyer partially signs' },
                { step: '3', actor: 'Client', action: 'Retry with X-PAYMENT header', result: 'Sends serialized transaction in payment header' },
                { step: '4', actor: 'Middleware', action: 'Forward to facilitator /verify', result: 'Facilitator validates: correct feePayer, buyer signature, allowed instructions, simulates' },
                { step: '5', actor: 'Facilitator', action: '/settle', result: 'Co-signs as feePayer, submits to X1 blockchain, returns tx signature' },
                { step: '6', actor: 'Server', action: 'Return data', result: 'Payment confirmed — original handler executes, client receives response' },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <span className="text-accent-light font-mono text-xs w-5 text-right flex-shrink-0 pt-0.5">{s.step}</span>
                  <div className="flex-1 pb-4 border-b border-surface-border last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-white/60">{s.actor}</span>
                      <ArrowRight size={10} className="text-white/15" />
                      <span className="text-xs text-white/40 font-mono">{s.action}</span>
                    </div>
                    <p className="text-xs text-white/25">{s.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="api" title="API Reference">
            <p className="text-white/40 text-base mb-6">
              Facilitator endpoints available at <code className="text-accent-light text-sm">https://x1pays.xyz/facilitator-alpha-mainnet</code>
            </p>

            <div className="space-y-3">
              {[
                { method: 'GET', path: '/health', desc: 'Facilitator status, address, fee info' },
                { method: 'POST', path: '/verify', desc: 'Validate a payment transaction before settlement' },
                { method: 'POST', path: '/settle', desc: 'Co-sign and submit transaction on-chain' },
                { method: 'GET', path: '/stats', desc: 'Settlement statistics and success rate' },
              ].map((ep) => (
                <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised border border-surface-border">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                    {ep.method}
                  </span>
                  <span className="text-base text-white/60 font-mono">{ep.path}</span>
                  <span className="text-sm text-white/25 ml-auto hidden sm:block">{ep.desc}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
