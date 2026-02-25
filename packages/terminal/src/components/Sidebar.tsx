import { Wallet, Activity, Settings, ExternalLink } from 'lucide-react';
import { ConnectButton } from './ConnectButton';

interface Props {
  connected: boolean;
  walletAddress: string | null;
  agentAddress: string | null;
  network: string | null;
}

export function Sidebar({ connected, walletAddress, agentAddress, network }: Props) {
  return (
    <aside className="w-72 border-r border-surface-border bg-surface flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm font-bold text-white tracking-wider">/X1_</span>
          <span className="text-white/30 text-xs">Terminal</span>
        </div>
      </div>

      {/* Wallet */}
      <div className="p-4 border-b border-surface-border">
        <div className="flex items-center gap-2 text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">
          <Wallet size={12} />
          Wallet
        </div>

        <ConnectButton />

        {walletAddress && agentAddress && (
          <div className="mt-3 space-y-2">
            <div>
              <div className="text-[10px] text-white/20 uppercase tracking-wider">Agent Wallet</div>
              <div className="text-xs font-mono text-accent-light/60 truncate">{agentAddress}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-[11px] text-white/25">{network || 'disconnected'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">
          <Activity size={12} />
          Quick Commands
        </div>
        <div className="space-y-1">
          {[
            { cmd: '/balance', desc: 'Check balances' },
            { cmd: '/portfolio', desc: 'Full portfolio' },
            { cmd: '/price WXNT', desc: 'wXNT price' },
            { cmd: '/swap 1 USDC.x WXNT', desc: 'Swap tokens' },
          ].map((item) => (
            <div
              key={item.cmd}
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-surface-overlay transition cursor-pointer group"
            >
              <span className="text-xs font-mono text-white/25 group-hover:text-accent-light/50">{item.cmd}</span>
              <span className="text-[10px] text-white/10">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <a
            href="https://x1pays.xyz"
            target="_blank"
            rel="noopener"
            className="text-[11px] text-white/15 hover:text-accent-light/40 flex items-center gap-1 transition"
          >
            x1pays.xyz <ExternalLink size={10} />
          </a>
          <button className="text-white/15 hover:text-white/40 transition">
            <Settings size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
