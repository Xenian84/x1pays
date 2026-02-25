import { Link } from 'react-router-dom'
import { Check, ArrowRight, Zap } from 'lucide-react'

const EXAMPLES = [
  { amount: '0.01 USDC.x', fee: '0.000001 USDC.x', desc: 'Micro API call' },
  { amount: '0.10 USDC.x', fee: '0.00001 USDC.x', desc: 'AI agent query' },
  { amount: '1.00 USDC.x', fee: '0.0001 USDC.x', desc: 'Premium data request' },
  { amount: '10.00 USDC.x', fee: '0.001 USDC.x', desc: 'DEX swap (10 USDC.x)' },
  { amount: '100.00 USDC.x', fee: '0.01 USDC.x', desc: 'Large swap or batch' },
]

const INCLUDED = [
  'Gasless x402 API payments — facilitator pays gas',
  'Multi-asset support (USDC.x, wXNT, XNT)',
  'On-chain proof for every transaction',
  'OpenClaw plugin with 12 tools',
  'MCP server for Claude/Cursor',
  'xDEX swap integration',
  'Express middleware integration',
  'Spending policies and budget controls',
  'Token-2022 compatible',
  'No minimum volume',
]

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-white/35 text-base max-w-md mx-auto">
          One fee. No subscriptions. No tiers. You pay only when value flows.
        </p>
      </div>

      {/* Main pricing card */}
      <div className="max-w-lg mx-auto mb-16">
        <div className="rounded-2xl border border-accent/20 bg-surface-raised p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-light to-transparent" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-light text-xs font-medium mb-6">
            <Zap size={12} />
            Per transaction
          </div>

          <div className="mb-6">
            <span className="font-heading text-6xl font-bold text-white">0.10</span>
            <span className="text-white/40 text-xl ml-1">%</span>
          </div>

          <p className="text-white/30 text-base mb-8">
            10 basis points on every settled x402 payment.<br />
            Gas covered by X1Pays for x402 payments only.<br />
            Direct sends and DEX swaps: agent pays its own gas.
          </p>

          <Link
            to="/docs"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110 transition cursor-pointer"
          >
            Start Building <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* What's included */}
      <div className="max-w-lg mx-auto mb-16">
        <h2 className="font-heading text-lg font-bold text-white mb-6 tracking-wide">
          Everything included
        </h2>
        <div className="space-y-3">
          {INCLUDED.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Check size={14} className="text-accent-light flex-shrink-0" />
              <span className="text-[15px] text-white/40">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fee examples */}
      <div className="max-w-lg mx-auto">
        <h2 className="font-heading text-lg font-bold text-white mb-6 tracking-wide">
          Fee examples
        </h2>
        <div className="rounded-xl border border-surface-border overflow-hidden">
          <div className="grid grid-cols-3 gap-px bg-surface-border">
            <div className="bg-surface-overlay p-3">
              <span className="text-[11px] uppercase tracking-widest text-white/25 font-semibold">Payment</span>
            </div>
            <div className="bg-surface-overlay p-3">
              <span className="text-[11px] uppercase tracking-widest text-white/25 font-semibold">Fee (0.10%)</span>
            </div>
            <div className="bg-surface-overlay p-3">
              <span className="text-[11px] uppercase tracking-widest text-white/25 font-semibold">Use Case</span>
            </div>
          </div>
          {EXAMPLES.map((ex) => (
            <div key={ex.amount} className="grid grid-cols-3 gap-px bg-surface-border">
              <div className="bg-surface-raised p-3">
                <span className="text-[15px] text-white/60 font-mono">{ex.amount}</span>
              </div>
              <div className="bg-surface-raised p-3">
                <span className="text-[15px] text-accent-light font-mono">{ex.fee}</span>
              </div>
              <div className="bg-surface-raised p-3">
                <span className="text-[15px] text-white/30">{ex.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/15 text-sm mt-4 text-center">
          x402 payments: buyer pays resource price + 0.10% fee, gas covered by X1Pays.
          DEX swaps and direct sends: agent wallet pays gas directly.
        </p>
      </div>
    </div>
  )
}
